"""
Script de ETL (Extração, Transformação e Carga) para processar dados públicos de CNPJ.

Este script executa as seguintes etapas:
1. Carrega configurações (caminhos de arquivos, credenciais de DB) de um arquivo .env.
2. Lê os arquivos de Empresas e Municípios da Receita Federal.
3. Lê o arquivo de Estabelecimentos em blocos (chunks).
4. Para cada bloco:
    a. Filtra empresas "ATIVAS".
    b. Em modo de teste, limita o processamento a um número pequeno de registros.
    c. Enriquece com Nomes de Município e Razão Social.
    d. Para nomes que AINDA estão nulos, consulta a API da ReceitaWS para preenchê-los.
    e. Salva o bloco totalmente enriquecido no banco de dados MySQL.
"""

import os
import time
import requests
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
from typing import Dict, Any, Optional, Tuple

# --- CONSTANTE DE TESTE ---
# Defina um número para limitar o processamento a N registros por bloco.
# Defina como None para rodar o script completo.
TEST_LIMIT = 5

# --- 1. CONFIGURAÇÃO E CARREGAMENTO ---

def load_config() -> Dict[str, Any]:
    """Carrega e valida as configurações a partir de variáveis de ambiente."""
    load_dotenv()
    config = {
        "db_user": os.getenv("DB_USER", "root"),
        "db_password": os.getenv("DB_PASSWORD"),
        "db_host": os.getenv("DB_HOST", "localhost"),
        "db_name": os.getenv("DB_NAME"),
        "db_table": "estabelecimentos",
        "path_estabelecimentos": os.getenv("PATH_ESTABELECIMENTOS"),
        "path_municipios": os.getenv("PATH_MUNICIPIOS"),
        "path_empresas": os.getenv("PATH_EMPRESAS"),
    }
    # Validação simples para garantir que os caminhos essenciais e o nome do DB foram definidos
    if not all([config["path_estabelecimentos"], config["db_name"]]):
        raise ValueError("ERRO: As variáveis de ambiente PATH_ESTABELECIMENTOS e DB_NAME devem ser definidas no arquivo .env")
    return config

def load_lookup_dfs(config: Dict[str, Any]) -> Tuple[pd.DataFrame, pd.DataFrame]:
    """Carrega os arquivos de Municípios e Empresas para a memória."""
    print("Lendo arquivos de lookup (Municípios e Empresas)...")
    try:
        colunas_municipios = ['municipio_codigo', 'municipio_nome']
        df_municipios = pd.read_csv(
            config["path_municipios"], sep=";", header=None, names=colunas_municipios,
            encoding='latin-1', dtype=str
        )
        colunas_empresas = ['cnpj_basico', 'razao_social']
        df_empresas = pd.read_csv(
            config["path_empresas"], sep=";", header=None, names=colunas_empresas,
            encoding='latin-1', dtype=str, usecols=colunas_empresas
        )
        print("Arquivos de lookup carregados com sucesso.")
        return df_municipios, df_empresas
    except FileNotFoundError as e:
        print(f"ERRO: Arquivo de lookup não encontrado: {e.filename}")
        raise

# --- 2. FUNÇÃO DE ENRIQUECIMENTO VIA RECEITA WS ---

def enrich_with_receitaws(cnpj: str) -> Optional[str]:
    """Consulta um CNPJ na ReceitaWS e retorna o nome da empresa se estiver ATIVA."""
    if not cnpj or not cnpj.strip():
        return None
    try:
        time.sleep(21)  # Respeita o limite da API gratuita (3 chamadas/min)
        print(f"    -> Consultando ReceitaWS para o CNPJ {cnpj}...")
        response = requests.get(f"https://www.receitaws.com.br/v1/cnpj/{cnpj.strip()}", timeout=15)
        response.raise_for_status()  # Lança um erro para status codes 4xx/5xx
        
        data = response.json()
        if data.get("situacao") == "ATIVA":
            # Retorna o nome fantasia, se não houver, retorna a razão social
            return data.get("fantasia") or data.get("nome")
            
    except requests.exceptions.RequestException as e:
        print(f"      - Erro ao consultar ReceitaWS para CNPJ {cnpj}: {e}")
    return None

# --- 3. LÓGICA PRINCIPAL DE PROCESSAMENTO ---

def process_chunk(chunk: pd.DataFrame, df_municipios: pd.DataFrame, df_empresas: pd.DataFrame) -> pd.DataFrame:
    """Aplica as transformações e enriquecimento em um bloco de dados."""
    print(f"\nProcessando Bloco com {len(chunk)} linhas...")
    
    # Filtra apenas estabelecimentos com situação cadastral "ATIVA" (código '02')
    processed_chunk = chunk[chunk['situacao_cadastral'] == '02'].copy()
    
    if processed_chunk.empty:
        print("  - Nenhum registro 'ATIVO' encontrado neste bloco.")
        return processed_chunk

    # Aplica o limite de teste, se estiver configurado
    if TEST_LIMIT:
        print(f"--- MODO DE TESTE ATIVO: Limitando o bloco a {TEST_LIMIT} registros. ---")
        processed_chunk = processed_chunk.head(TEST_LIMIT)

    # Enriquece os dados com informações dos arquivos de lookup
    processed_chunk = pd.merge(processed_chunk, df_municipios, on='municipio_codigo', how='left')
    processed_chunk = pd.merge(processed_chunk, df_empresas, on='cnpj_basico', how='left')
    
    # Define o nome final, usando o nome fantasia ou a razão social
    processed_chunk['nome_final'] = processed_chunk['nome_fantasia'].fillna(processed_chunk['razao_social'])
    processed_chunk['cnpj_completo'] = processed_chunk['cnpj_basico'] + processed_chunk['cnpj_ordem'] + processed_chunk['cnpj_dv']

    # Para registros que ainda não têm nome, consulta a API da ReceitaWS
    nomes_faltantes = processed_chunk[processed_chunk['nome_final'].isnull()]
    if not nomes_faltantes.empty:
        print(f"  - Encontrados {len(nomes_faltantes)} registros sem nome. Buscando na ReceitaWS...")
        for index, row in nomes_faltantes.iterrows():
            nome_da_api = enrich_with_receitaws(row['cnpj_completo'])
            if nome_da_api:
                processed_chunk.loc[index, 'nome_final'] = nome_da_api
                print(f"      -> Nome encontrado e atualizado para CNPJ {row['cnpj_completo']}")
    
    return processed_chunk

def save_chunk_to_db(chunk: pd.DataFrame, table_name: str, engine, is_first_chunk: bool):
    """Salva o bloco de dados processado no banco de dados MySQL."""
    if chunk.empty:
        print("  - Nenhum dado para salvar neste bloco.")
        return

    colunas_uteis = [
        'cnpj_completo', 'nome_final', 'cnae_fiscal_principal', 
        'municipio_nome', 'uf', 'correio_eletronico', 'ddd_1', 'telefone_1'
    ]
    
    # Garante que todas as colunas necessárias existam no DataFrame
    for col in colunas_uteis:
        if col not in chunk.columns:
            chunk[col] = None
    
    chunk_to_save = chunk[colunas_uteis].dropna(subset=['nome_final'])
    
    if chunk_to_save.empty:
        print("  - Nenhum registro com nome final para salvar.")
        return

    write_mode = 'replace' if is_first_chunk else 'append'
    try:
        chunk_to_save.to_sql(table_name, con=engine, if_exists=write_mode, index=False, chunksize=1000)
        print(f"  - Bloco salvo no MySQL com {len(chunk_to_save)} registros.")
    except Exception as e:
        print(f"ERRO ao salvar no banco de dados: {e}")


# --- 4. ORQUESTRADOR ---

def main():
    """Função principal que orquestra todo o processo de ETL."""
    try:
        config = load_config()
        df_municipios, df_empresas = load_lookup_dfs(config)
        
        db_conn_str = f"mysql+pymysql://{config['db_user']}:{config['db_password']}@{config['db_host']}/{config['db_name']}"
        engine = create_engine(db_conn_str)
        
        colunas_estabelecimentos = [
            'cnpj_basico', 'cnpj_ordem', 'cnpj_dv', 'identificador_matriz_filial', 
            'nome_fantasia', 'situacao_cadastral', 'data_situacao_cadastral', 
            'motivo_situacao_cadastral', 'nome_cidade_exterior', 'pais', 
            'data_inicio_atividade', 'cnae_fiscal_principal', 'cnae_fiscal_secundaria', 
            'tipo_logradouro', 'logradouro', 'numero', 'complemento', 'bairro', 
            'cep', 'uf', 'municipio_codigo', 'ddd_1', 'telefone_1', 'ddd_2', 
            'telefone_2', 'ddd_fax', 'fax', 'correio_eletronico', 'situacao_especial', 
            'data_situacao_especial'
        ]
        
        leitor_csv = pd.read_csv(
            config["path_estabelecimentos"], sep=";", header=None, 
            names=colunas_estabelecimentos, encoding='latin-1', 
            dtype=str, chunksize=100000
        )

        print("\nIniciando processo completo de carga e enriquecimento...")
        start_time = time.time()

        for i, chunk in enumerate(leitor_csv):
            processed_chunk = process_chunk(chunk, df_municipios, df_empresas)
            save_chunk_to_db(processed_chunk, config["db_table"], engine, is_first_chunk=(i == 0))
            
            # Se o modo de teste estiver ativo, pare após o primeiro bloco.
            if TEST_LIMIT:
                print("\nModo de teste: Processando apenas uma amostra do primeiro bloco e finalizando.")
                break

        end_time = time.time()
        print(f"\n--- PROCESSO CONCLUÍDO! (Tempo total: {(end_time - start_time):.2f} segundos) ---")

    except Exception as e:
        print(f"\nOcorreu um erro CRÍTICO durante o processo: {e}")

if __name__ == "__main__":
    main()