# 🤖 LeadHunter AI (leadhunter/)

Aplicação completa de geração de leads usando inteligência artificial.

## 📋 Estrutura

```
leadhunter/
├── components/         # Componentes da aplicação
├── context/           # Context providers (Auth, etc)
├── hooks/             # Custom hooks
├── pages/             # Páginas da aplicação
└── lib/               # Utilitários e configurações
```

## 🎯 Funcionalidades Principais

### 🔐 Autenticação
- Sistema completo de login/registro
- JWT tokens para sessões
- Proteção de rotas sensíveis
- Logout automático por inatividade

### 🎯 Geração de Leads
- IA powered por Google Gemini
- Critérios personalizáveis de busca
- Filtros avançados por nicho/região
- Scoring automático de qualidade

### 📊 Dashboard
- Visualização de leads gerados
- Estatísticas de performance
- Histórico de pesquisas
- Exportação de dados

### 👤 Perfil de Usuário
- Configuração de empresa
- Preferências de busca
- Histórico de atividades
- Configurações de conta

## 🏗️ Arquitetura

### Componentes (components/)
```
components/
├── ContactForm.jsx     # Formulário de contato integrado
├── Layout.jsx          # Layout da aplicação
├── LeadConfigForm.jsx  # Configuração de busca
├── LeadResults.jsx     # Exibição de resultados
├── ProtectedRoute.jsx  # Proteção de rotas
├── ScheduleGuide.jsx   # Guia de agendamento
├── Toaster.jsx         # Sistema de notificações
└── ui/                 # Componentes base (Radix UI)
```

### Context (context/)
```
context/
└── AuthContext.tsx     # Gerenciamento de autenticação
```

### Hooks (hooks/)
```
hooks/
├── use-mobile.tsx      # Detecção de dispositivo móvel
└── use-toast.js        # Sistema de notificações toast
```

### Páginas (pages/)
```
pages/
├── Index.tsx           # Dashboard principal
├── Login.jsx           # Página de login
├── Register.jsx        # Página de registro
├── Profile.tsx         # Perfil do usuário
├── History.tsx         # Histórico de leads
└── NotFound.tsx        # Página 404
```

## 🔐 Sistema de Autenticação

### AuthContext
- **Função**: Gerenciar estado de autenticação global
- **Funcionalidades**:
  - Login/logout de usuários
  - Armazenamento seguro de tokens
  - Verificação de sessão ativa
  - Redirecionamento automático

### ProtectedRoute
- **Função**: Proteger rotas que requerem autenticação
- **Comportamento**:
  - Verificar token válido
  - Redirecionar para login se necessário
  - Manter URL de destino para retorno

### Fluxo de Autenticação
1. Usuário acessa `/leadhunter/login`
2. Insere credenciais
3. Sistema valida com backend
4. Token JWT armazenado
5. Redirecionamento para dashboard
6. Acesso às funcionalidades protegidas

## 🎯 Geração de Leads

### LeadConfigForm
- **Função**: Configurar parâmetros de busca
- **Campos**:
  - Nicho de mercado
  - Região geográfica
  - Quantidade desejada
  - Critérios específicos
  - Palavras-chave incluir/excluir

### Integração com IA
```javascript
// Fluxo de geração
1. Usuário configura busca
2. Dados enviados para backend
3. Backend consulta Gemini AI
4. IA retorna leads qualificados
5. Resultados exibidos na interface
6. Leads salvos no histórico
```

### LeadResults
- **Função**: Exibir leads gerados
- **Funcionalidades**:
  - Lista paginada de resultados
  - Detalhes expandíveis
  - Scoring visual
  - Ações (contatar, exportar, salvar)

## 📊 Dashboard e Analytics

### Métricas Principais
- Total de leads gerados
- Taxa de conversão
- Leads por nicho
- Performance por região
- Histórico temporal

### Visualizações
- Gráficos de performance
- Mapas de calor por região
- Timeline de atividades
- Ranking de melhores leads

## 🎨 Interface e UX

### Design System
- **Cores**: Gradientes azul/roxo
- **Tipografia**: Inter font family
- **Componentes**: Radix UI base
- **Animações**: Framer Motion suave

### Responsividade
- Mobile-first design
- Layouts adaptativos
- Touch-friendly interactions
- Performance otimizada

### Acessibilidade
- ARIA labels completos
- Navegação por teclado
- Alto contraste disponível
- Screen reader compatibility

## 🔧 Integração com Backend

### Endpoints Principais
```
POST /api/login          # Autenticação
POST /api/register       # Registro
GET  /api/profile        # Perfil do usuário
POST /api/search         # Geração de leads
GET  /api/history        # Histórico
POST /api/contact        # Formulário de contato
```

### Autenticação
- JWT Bearer tokens
- Refresh automático
- Interceptors para requisições
- Tratamento de erros global

## 📱 Funcionalidades Mobile

### Responsividade
- Layout stack em mobile
- Formulários otimizados para touch
- Navegação por gestos
- Performance melhorada

### PWA Ready
- Service Worker configurado
- Manifest para instalação
- Cache strategies
- Funcionamento offline básico

## 🚀 Performance

### Otimizações
- Code splitting por rota
- Lazy loading de componentes
- Memoização de computações pesadas
- Debounce em formulários

### Bundle Size
- Tree shaking automático
- Bibliotecas essenciais apenas
- Compressão gzip
- Assets otimizados

## 🔧 Desenvolvimento

### Comandos
```bash
# Executar aplicação
npm run dev

# Build de produção  
npm run build

# Testes
npm run test

# Lint
npm run lint
```

### Estrutura de Desenvolvimento
- Hot reload configurado
- TypeScript para type safety
- ESLint para qualidade
- Prettier para formatação

## 🎯 Roadmap

### Próximas Features
- [ ] Integração com CRM
- [ ] Webhook notifications
- [ ] API pública
- [ ] Machine learning insights
- [ ] Relatórios avançados
- [ ] Integração social media