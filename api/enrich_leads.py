import os
import re
import time
import requests
import mysql.connector
from dotenv import load_dotenv
from typing import Optional, Dict, Any
from bs4 import BeautifulSoup
from thefuzz import fuzz

# Carrega as variáveis do arquivo .env
load_dotenv()

# --- CONFIGURAÇÃO ---
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": os.getenv("DB_PASSWORD"), 
    "database": os.getenv("DB_NAME")      
}
SERPER_API_KEY = os.getenv("SERPER_API_KEY")

# --- FUNÇÕES DE ENRIQUECIMENTO ---

def analisar_presenca_digital(company_name: str, city: str, state: str) -> Optional[Dict[str, Any]]:
    """Usa a Serper para fazer uma análise completa da presença digital de uma empresa."""
    if not SERPER_API_KEY:
        print("!!! ERRO: Chave da Serper (SERPER_API_KEY) não encontrada no arquivo .env.")
        return "STOP"

    # Limpa o nome para uma busca mais eficaz
    clean_company_name = re.split(r'\s\d{11,14}', company_name)[0].strip().lower()
    search_name_key = " ".join(clean_company_name.split()[:2])
    
    query = f'"{clean_company_name}" {city} {state}'
    headers = {"X-API-KEY": SERPER_API_KEY, "Content-Type": "application/json"}
    data = {"q": query, "gl": "br", "hl": "pt"}
    
    print(f"  - Analisando presença digital de '{clean_company_name}' via Serper...")
    try:
        response = requests.post("https://google.serper.dev/search", headers=headers, json=data, timeout=15)
        
        if response.status_code == 200:
            results = response.json()
            analise = {"site_encontrado": None, "avaliacao_google": None, "total_avaliacoes": 0, "analise_digital": "Presença digital não detectada."}
            
            if "local_pack" in results and results["local_pack"].get("results"):
                for local_result in results["local_pack"]["results"]:
                    title = local_result.get("title", "").lower()
                    ratio = fuzz.partial_ratio(clean_company_name, title)
                    if ratio > 80:
                        print(f"    -> Match encontrado no Google Maps (Similaridade: {ratio}%): '{local_result.get('title')}'")
                        analise["avaliacao_google"] = local_result.get("rating")
                        analise["total_avaliacoes"] = local_result.get("reviews", 0)
                        analise["site_encontrado"] = local_result.get("website")
                        
                        if analise["total_avaliacoes"] > 50: analise["analise_digital"] = "Forte presença no Google Maps com bom engajamento."
                        elif analise["total_avaliacoes"] > 0: analise["analise_digital"] = "Presença básica no Google Maps, baixo engajamento."
                        else: analise["analise_digital"] = "Listada no Google Maps, mas sem avaliações (oportunidade)."
                        break
            
            print(f"  - Análise concluída. Avaliação: {analise['avaliacao_google']}, Reviews: {analise['total_avaliacoes']}")
            return analise

        elif response.status_code == 401:
            print("!!! ERRO 401: Chave da Serper é inválida.")
            return "STOP"
    except requests.exceptions.RequestException as e:
        print(f"  - Erro ao conectar na Serper: {e}")
    return None

# --- LÓGICA PRINCIPAL ---
def main():
    print("Iniciando processo de enriquecimento de leads...")
    conn = None
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT cnpj_completo, nome_final, municipio_nome, uf FROM estabelecimentos WHERE analise_digital IS NULL LIMIT 20")
        leads_para_enriquecer = cursor.fetchall()
        
        print(f"Encontrados {len(leads_para_enriquecer)} leads para enriquecer.")

        for lead in leads_para_enriquecer:
            if not lead.get('nome_final'):
                print(f"\nPulando CNPJ {lead['cnpj_completo']} por não ter nome.")
                continue

            print(f"\nProcessando: {lead['nome_final']} ({lead['cnpj_completo']})")
            resultado_analise = analisar_presenca_digital(lead["nome_final"], lead["municipio_nome"], lead["uf"])
            
            if resultado_analise == "STOP":
                print("Execução interrompida por erro de chave de API.")
                break
            
            if resultado_analise:
                update_query = "UPDATE estabelecimentos SET site_encontrado = %s, avaliacao_google = %s, total_avaliacoes = %s, analise_digital = %s WHERE cnpj_completo = %s"
                params = (resultado_analise["site_encontrado"], resultado_analise["avaliacao_google"], resultado_analise["total_avaliacoes"], resultado_analise["analise_digital"], lead['cnpj_completo'])
                cursor.execute(update_query, params)
                conn.commit()
                print(f"  - SUCESSO: Banco de dados enriquecido com a análise digital.")

    except mysql.connector.Error as err:
        print(f"Erro de banco de dados: {err}")
    except Exception as e:
        print(f"Ocorreu um erro inesperado: {e}")
    finally:
        if conn and conn.is_connected():
            cursor.close()
            conn.close()
            print("\nConexão com o banco de dados fechada.")

if __name__ == "__main__":
    main()