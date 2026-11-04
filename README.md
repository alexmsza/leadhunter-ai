# 🎯 LeadHunter AI • Motor Forense de Veracidade Zero-Trust & Prospecção B2B

Plataforma corporativa de inteligência, enriquecimento e auditoria forense de leads B2B. Elimina dados falsificados, e-mails fictícios e métricas sintéticas através de um motor de verificação multinível com **garantia estrita de link de referência conferível na última coluna**.

---

## ⚡ Diferenciais de Arquitetura & Segurança

- **Motor Forense Zero-Trust (`api/veracity_engine.py`)**:
  - **Probing SSR no Instagram**: Checagem real via endpoint público `/embed/` para validar se o handle existe e capturar seguidores reais renderizados no HTML.
  - **Validação DNS / Hostname**: Resolução em tempo real de domínios corporativos para descartar domínios fictícios (`example.com`, `teste.com.br`, etc.).
  - **Filtro Anti-Sintético**: Bloqueio de dados viciados (ex: anomalia sistemática de seguidores fixos/duplicados, telefones sequenciais `1234-5678` e nomes de teste).
  - **Garantia Estrita da Última Coluna `link_referencia`**: Todos os leads auditados trazem obrigatoriamente a URL pública oficial para conferência humana direta.
- **Frontend Editorial & Design Engineering (`anti-vibe-code-design` + `ui-skills`)**:
  - Eliminação de gradientes genéricos de IA, badges artificiais e animações instáveis (`hover:scale-105`).
  - Tipografia editorial (`Plus Jakarta Sans`), sombras em camadas (*Beautiful Shadows*), `min-h-dvh` e alinhamento numérico tabular (`tabular-nums`).
  - Substituição integral de emojis soltos por ícones profissionais `lucide-react`.
- **Backend Resiliente & LGPD (`api/main.py`)**:
  - Armazenamento local automático em **SQLite com WAL Mode** (`PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL;`), permitindo execução *zero-config* imediata sem depender de MySQL externo para dev/testes.
  - Suporte corporativo transparente a MySQL quando configurado em `.env`.
  - Hashing seguro nativo via `bcrypt` direto (imune ao bug de compatibilidade `passlib` / `bcrypt >= 4.1.0`).
  - Sanitização de logs: mascaramento automático de e-mails de usuários (ex: `al***@sousza.com (sha256:b1b392)`) impedindo vazamento de PII no console.
- **Roteamento Unificado & Governança**:
  - Rotas canônicas (`/`, `/history`, `/profile`, `/login`, `/register`) com suporte transparente a apelidos legados (`/leadhunter/*`).
  - Páginas de conformidade regulatória: `/termos` e `/privacidade` em estrita aderência à LGPD.

---

## 📁 Estrutura do Repositório

```
leadhunter-ai/
├── api/
│   ├── main.py             # API FastAPI, JWT, endpoints e workers assíncronos
│   ├── veracity_engine.py  # Motor Forense Zero-Trust (DNS, SSR embed, anti-sintético)
│   └── requirements.txt    # Dependências do backend Python
├── config/
│   └── api.js              # Configuração centralizada da URL da API (Vite env fallback)
├── src/
│   ├── components/         # Layout editorial, formulários, tabela com link_referencia
│   ├── context/            # AuthContext com persistência de token JWT
│   ├── pages/              # Index, History, Profile, Login, Register, Legal
│   ├── index.css           # Design Tokens, Beautiful Shadows e tipografia
│   └── App.jsx             # Roteamento seguro e páginas protegidas
├── test_e2e.py             # Suíte de regressão E2E automatizada (8 testes forenses)
├── .env.example            # Template sanitizado de variáveis
├── package.json            # Dependências Vite + React + Tailwind
└── vite.config.js          # Configuração de build e chunks
```

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- Node.js 18+
- Python 3.10+ (ou `uv`)

### 2. Frontend
```bash
npm install
npm run build   # Compilação de produção
npm run dev     # Servidor de desenvolvimento em http://localhost:5173
```

### 3. Backend (API)
```bash
# Execução direta com uv (recomendado):
uv run --with fastapi --with uvicorn --with python-dotenv --with bcrypt --with "python-jose[cryptography]" --with pydantic --with requests --with python-multipart uvicorn api.main:app --reload --port 8000

# Ou via venv tradicional:
python -m venv .venv
# Windows: .venv\Scripts\activate | Linux: source .venv/bin/activate
pip install -r api/requirements.txt
uvicorn api.main:app --reload --port 8000
```

### 4. Execução dos Testes Automatizados
```bash
uv run --with fastapi --with uvicorn --with python-dotenv --with bcrypt --with "python-jose[cryptography]" --with pydantic --with requests --with python-multipart --with httpx python test_e2e.py
```

---

## 🔒 Segurança, Privacidade & LGPD

- Nenhuma credencial ou chave privada deve ser commitada no repositório.
- A plataforma opera em estrita conformidade com a LGPD (Lei 13.709/2018), coletando exclusivamente dados públicos institucionais de pessoas jurídicas (PJs) para fins legítimos de prospecção comercial.

---

Desenvolvido por **Alex Souza** • *Souza Consultoria*
