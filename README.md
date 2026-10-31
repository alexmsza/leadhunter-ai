# 🎯 LeadHunter AI • Motor de Prospecção & Qualificação de Leads B2B com Gemini AI

Plataforma inteligente de prospecção ativa B2B que combina busca parametrizada de empresas por nicho/região, enriquecimento cadastral e qualificação automática de decisores utilizando o **Google Gemini AI**.

---

## ⚡ Diferenciais de Arquitetura

- **Frontend Reativo**: React + Vite + Tailwind CSS + Radix UI para interface ágil e responsiva.
- **Backend de Alta Performance**: Python + FastAPI estruturado para processamento assíncrono de listas e scraping seguro.
- **Inteligência com Gemini AI**: Scoring de maturidade digital (0 a 10), identificação de gargalos de conversão e geração de scripts de abordagem personalizados por nicho.
- **Segurança & RBAC**: Autenticação stateless via tokens JWT criptografados com isolamento de histórico por usuário.
- **Exportação Ágil**: Filtros por localização, porte da empresa, status de CNPJ e exportação direta para CRM e listas de WhatsApp.

---

## 📁 Estrutura do Projeto

```
leadhunter-ai/
├── api/                    # Backend FastAPI & IA
│   ├── main.py             # Rotas REST e autenticação JWT
│   ├── enrich_leads.py     # Integração com Google Gemini AI
│   ├── data.py             # Conexão e filtros da base de estabelecimentos
│   └── requirements.txt    # Dependências Python (FastAPI, google-genai, etc.)
├── src/                    # Frontend React (SPA)
│   ├── components/         # Formulários de busca, resultados e visualização
│   ├── context/            # AuthContext e gerenciamento de estado
│   ├── pages/              # Painel principal, Login, Cadastro, Histórico e Perfil
│   ├── App.jsx             # Roteamento protegido
│   └── main.jsx            # Ponto de entrada
├── public/                 # Assets estáticos
├── .env.example            # Template sanitizado de variáveis
├── package.json            # Dependências Node.js
└── vite.config.js          # Configuração de build Vite
```

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- Node.js 18+
- Python 3.10+ (com `uv` ou `venv`)

### 2. Configuração do Frontend
```bash
npm install
npm run dev
```

### 3. Configuração do Backend (API)
```bash
cd api
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 4. Variáveis de Ambiente
Copie `.env.example` para `.env` na raiz e configure:
```env
SECRET_KEY="sua_chave_secreta_jwt"
GEMINI_API_KEY="sua_chave_gemini_api"
```

---

## 🔒 Segurança & Privacidade
- Nenhuma chave ou credencial deve ser commitada no repositório.
- Sanitização de inputs contra injeção e proteção contra vazamento de PII em conformidade com as diretrizes da LGPD.

---

Desenvolvido por **Alex Souza** • *Souza Consultoria*
