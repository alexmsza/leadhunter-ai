import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from '../components/Logo';
import ContactForm from '../components/ContactForm';
import {
  ShieldCheck,
  Target,
  Globe,
  CheckCircle2,
  Lock,
  ArrowRight,
  Database,
  Search,
  Sparkles,
  Zap,
  BarChart3,
  FileSpreadsheet,
  AlertTriangle,
  Scale,
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* Top Navbar */}
      <header className="w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Logo variant="full" size="default" />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#como-funciona" className="hover:text-slate-900 transition-colors">
              Como Funciona
            </a>
            <a href="#diferenciais" className="hover:text-slate-900 transition-colors">
              Motor Zero-Trust
            </a>
            <a href="#sobre" className="hover:text-slate-900 transition-colors">
              Sobre a Plataforma
            </a>
            <a href="#lgpd" className="hover:text-slate-900 transition-colors">
              Segurança & LGPD
            </a>
            <a href="#contato" className="hover:text-slate-900 transition-colors">
              Contato
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                to="/app"
                className="btn-primary text-xs py-2 px-4 shadow-soft inline-flex items-center gap-2"
              >
                <span>Acessar Painel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-xs py-2 px-4 shadow-soft"
                >
                  Criar Conta
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200/60 bg-gradient-to-b from-white via-slate-50 to-slate-100/50">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl text-center space-y-8">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-bold tracking-wide shadow-soft">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Motor Forense de Veracidade Zero-Trust 2.0 Ativo</span>
          </div>

          {/* Main Title */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Prospecção B2B de Alta Conversão com{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-sky-800 to-sky-600">
                Auditoria Forense em Tempo Real
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
              Diga adeus a listas sintéticas, dados fictícios e e-mails fantasmas.
              Toda oportunidade gerada pelo LeadHunter.ai acompanha{' '}
              <strong className="text-slate-900 font-semibold">prova documental na fonte</strong> e{' '}
              <strong className="text-slate-900 font-semibold">link de referência conferível</strong>.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {isAuthenticated ? (
              <Link
                to="/app"
                className="btn-primary w-full sm:w-auto text-sm py-3.5 px-8 rounded-xl shadow-soft flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Ir para o Painel de Prospecção</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary w-full sm:w-auto text-sm py-3.5 px-8 rounded-xl shadow-soft flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>Iniciar Prospecção Gratuitamente</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/login"
                  className="btn-secondary w-full sm:w-auto text-sm py-3.5 px-6 rounded-xl flex items-center justify-center gap-2"
                >
                  <span>Já tenho uma conta &bull; Entrar</span>
                </Link>
              </>
            )}
          </div>

          {/* Pillars Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-soft">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Garantia Anti-Sintética</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-soft">
              <Globe className="w-4 h-4 text-sky-600" />
              <span>Validação DNS & Domínio</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-soft">
              <Target className="w-4 h-4 text-indigo-600" />
              <span>Link de Referência Obrigatório</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-soft">
              <Lock className="w-4 h-4 text-slate-700" />
              <span>100% em Conformidade com a LGPD</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="py-16 md:py-20 border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-full">
              O Problema dos Dados Falsificados
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Por que a maioria das listas de leads fracassa?
            </h2>
            <p className="text-sm text-slate-600">
              Ferramentas tradicionais reciclam bases obsoletas, geram alucinações sintéticas e entregam contatos inexistentes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* O Mercado Tradicional */}
            <div className="p-6 sm:p-8 rounded-2xl border border-rose-200/80 bg-rose-50/30 space-y-4">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Mercado Tradicional & Vibe-Coding</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">&times;</span>
                  <span><strong>Alucinações de IA:</strong> Modelos gerando empresas e nomes fictícios sem correspondência real.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">&times;</span>
                  <span><strong>Bug Sistemático de Seguidores:</strong> Bases com números fixos (ex: 1250 seguidores em massa) e perfis inativos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">&times;</span>
                  <span><strong>Domínios Fantasmas:</strong> E-mails apontando para domínios inexistentes (`empresa.com`, `teste.com.br`) com alto bounce.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-600 font-bold">&times;</span>
                  <span><strong>Sem Auditoria:</strong> O usuário recebe a lista e não tem como provar se os dados são legítimos.</span>
                </li>
              </ul>
            </div>

            {/* A Abordagem LeadHunter.ai */}
            <div className="p-6 sm:p-8 rounded-2xl border border-emerald-200/80 bg-emerald-50/30 space-y-4">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>O Padrão LeadHunter.ai Zero-Trust</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Probing SSR no Instagram:</strong> Consulta direta no HTML do endpoint `/embed/` para capturar seguidores reais e barrar contas inexistentes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Validação DNS de Domínios:</strong> Checagem de MX e socket para assegurar que o provedor existe antes de sugerir o e-mail.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Coluna Final link_referencia:</strong> Todo registro entrega a URL pública exata para conferência humana em um clique.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Zero Mocks:</strong> Nada é inventado. Se o registro não passar no teste de veracidade, é descartado.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-16 md:py-20 border-b border-slate-200 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-full shadow-soft">
              Fluxo Metodológico
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Como funciona em 3 passos simples
            </h2>
            <p className="text-sm text-slate-600">
              Uma esteira automatizada que une busca segmentada e conferência forense antes da entrega.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm shadow-soft">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">1. Parametrização Alvo</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Defina o nicho, região e critérios de baixa maturidade digital (poucos posts, sem tráfego pago ativo ou website desatualizado).
              </p>
            </div>

            <div className="card p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm shadow-soft">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">2. Varredura Forense</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                O motor Zero-Trust executa probing em tempo real nas fontes públicas, validando existência cadastral, seguidores e integridade do domínio.
              </p>
            </div>

            <div className="card p-6 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-sm shadow-soft">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">3. Entrega com Evidência</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receba a listagem auditada com score de veracidade e a coluna <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">link_referencia</code> pronta para exportação em CSV.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Differentials Section */}
      <section id="diferenciais" className="py-16 md:py-20 border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-full">
              Engenharia de Alta Precisão
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Os Pilares do Motor LeadHunter.ai
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Live SSR Probing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspeção real de tags OpenGraph e JSON-LD público no Instagram sem quebra por bloqueio de sessão.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Anti-Sintético</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Algoritmo heurístico que detecta contagens repetidas de seguidores e nomes fictícios gerados por LLM.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">SQLite WAL Nativo</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Persistência local ultra-rápida em modo Write-Ahead Logging com suporte corporativo transparente a MySQL.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Zero PII Leaks</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sanitização e mascaramento criptográfico (SHA-256) em logs de console e trilhas de auditoria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-16 md:py-20 border-b border-slate-200 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-8">
          <div className="card p-8 sm:p-10 space-y-6">
            <div className="flex items-center gap-3">
              <Logo variant="icon" size="default" />
              <div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900">
                  Sobre o LeadHunter.ai
                </h3>
                <p className="text-xs text-slate-500">
                  Criado para elevar o padrão da prospecção B2B corporativa
                </p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4">
              <p>
                O <strong>LeadHunter.ai</strong> nasceu da necessidade real de equipes comerciais e consultorias estratégicas
                que dependem de dados qualificados e não podem perder tempo lidando com cadastros frios, números inventados ou
                endereços que não existem.
              </p>
              <p>
                Nossa filosofia é baseada no <strong>Zero-Trust Data</strong>: todo dado gerado deve carregar em si a evidência
                de onde veio e como pode ser conferido por um ser humano. É por isso que não entregamos apenas nomes e telefones,
                mas sim um dossiê pronto para abordagem comercial com a fonte oficial indexada.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-500 font-medium">
                Desenvolvido por <strong>Alex Souza</strong> &bull; Consultoria de Inteligência & Dados
              </div>
              <Link
                to="/register"
                className="btn-primary text-xs py-2 px-4 shadow-soft"
              >
                Solicitar Acesso à Plataforma
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Security & LGPD Section */}
      <section id="lgpd" className="py-16 md:py-20 border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              Conformidade Regulatória
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Segurança, Privacidade & LGPD
            </h2>
            <p className="text-sm text-slate-600">
              Operação estritamente alinhada à Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
            </p>
          </div>

          <div className="card p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Scale className="w-4 h-4 text-emerald-600" />
                  <h4>Dados de Pessoas Jurídicas (PJs)</h4>
                </div>
                <p>
                  O LeadHunter.ai realiza o tratamento exclusivo de dados corporativos de pessoas jurídicas provenientes de fontes
                  manifestamente públicas e diretórios empresariais abertos, conforme respaldo do Artigo 7º da LGPD.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Lock className="w-4 h-4 text-sky-600" />
                  <h4>Privacidade e Zero Leaks</h4>
                </div>
                <p>
                  Informações de identificação pessoal (PII) são mascaradas por hash unidirecional em todas as operações de log.
                  Suas credenciais são protegidas por criptografia moderna e tokens JWT de curta duração.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                <Link to="/termos" className="hover:text-slate-900 underline">
                  Termos de Uso
                </Link>
                <span>&bull;</span>
                <Link to="/privacidade" className="hover:text-slate-900 underline">
                  Política de Privacidade
                </Link>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                LGPD-BR • Security by Design
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 max-w-xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Atendimento Corporativo
            </span>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Fale com Nossa Equipe
            </h2>
            <p className="text-xs text-slate-600">
              Tire dúvidas sobre integrações, contratos enterprise ou solicite demonstração técnica.
            </p>
          </div>

          <ContactForm />
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Pronto para transformar sua prospecção B2B?
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Junte-se às operações comerciais que operam com veracidade Zero-Trust e zero desperdício de tempo.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs py-3 px-6 rounded-xl shadow-soft transition-colors inline-flex items-center gap-2"
            >
              <span>Criar Conta Gratuita</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/login"
              className="border border-slate-700 hover:bg-slate-800 text-white font-semibold text-xs py-3 px-6 rounded-xl transition-colors"
            >
              Acessar Minha Conta
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 py-10 text-xs">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo variant="icon" size="sm" />
            <div>
              <p className="font-bold text-slate-200">LeadHunter.ai</p>
              <p className="text-[11px] text-slate-500">
                &copy; {new Date().getFullYear()} LeadHunter.ai &mdash; Todos os direitos reservados.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <Link to="/termos" className="hover:text-slate-200 transition-colors">
              Termos de Uso
            </Link>
            <Link to="/privacidade" className="hover:text-slate-200 transition-colors">
              Privacidade & LGPD
            </Link>
            <Link to="/login" className="hover:text-slate-200 transition-colors">
              Login
            </Link>
            <Link to="/register" className="hover:text-slate-200 transition-colors">
              Cadastro
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
