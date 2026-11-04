import React from 'react';
import { Layout } from '../components/Layout';
import { ShieldCheck, Lock, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LegalPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para a plataforma
        </Link>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 shadow-sm space-y-10">
          <header className="border-b border-slate-100 pb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              Governança & Conformidade
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Termos de Uso e Política de Privacidade
            </h1>
            <p className="text-slate-600 mt-2 text-sm">
              Última atualização: {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </header>

          <section className="space-y-4">
            <div className="flex items-center gap-3 text-slate-900">
              <FileText className="w-5 h-5 text-slate-700" />
              <h2 className="text-xl font-semibold">1. Termos de Uso</h2>
            </div>
            <div className="text-slate-600 text-sm leading-relaxed space-y-3">
              <p>
                O <strong>LeadHunter AI</strong> é uma plataforma de inteligência e auditoria de dados públicos corporativos
                desenvolvida para apoiar operações legítimas de prospecção comercial B2B, análise de mercado e qualificação cadastral.
              </p>
              <p>
                Ao utilizar a plataforma, o usuário se compromete a:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Utilizar os dados exclusivamente para comunicações pertinentes, profissionais e de interesse legítimo mútuo;</li>
                <li>Não empregar a ferramenta para envio massivo não solicitado (SPAM) ou práticas abusivas de contato;</li>
                <li>Respeitar as solicitações de opt-out (descadastro) manifestadas por qualquer destinatário;</li>
                <li>Manter a confidencialidade de suas credenciais de acesso à plataforma.</li>
              </ul>
            </div>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <div className="flex items-center gap-3 text-slate-900">
              <Lock className="w-5 h-5 text-slate-700" />
              <h2 className="text-xl font-semibold">2. Privacidade e Conformidade LGPD</h2>
            </div>
            <div className="text-slate-600 text-sm leading-relaxed space-y-3">
              <p>
                Em estrita conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD)</strong>,
                a plataforma atua sob o princípio do <em>Security by Design</em> e tratamento de dados baseado em fontes manifestamente públicas:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Dados Públicos de Pessoa Jurídica:</strong> Os dados de empresas (razão social, CNPJ, município e e-mails institucionais)
                  são oriundos de bases públicas e canais corporativos abertos, conforme previsto no Artigo 7º da LGPD.
                </li>
                <li>
                  <strong>Proteção de PII nos Logs:</strong> Nossos sistemas empregam sanitização e mascaramento criptográfico (SHA-256)
                  em logs e trilhas de auditoria para impedir a exposição de dados sensíveis ou informações de identificação pessoal.
                </li>
                <li>
                  <strong>Motor Zero-Trust:</strong> Todos os registros gerados passam por checagem forense (resolução DNS e auditoria pública)
                  com link de referência obrigatório para conferência humana direta na fonte.
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-4 border-t border-slate-100 pt-8">
            <h2 className="text-xl font-semibold text-slate-900">3. Contato e Encarregado de Dados (DPO)</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Para esclarecimentos sobre privacidade, exclusão de dados de cadastro ou solicitações de titulares,
              utilize o canal de atendimento no formulário de contato da plataforma.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default LegalPage;
