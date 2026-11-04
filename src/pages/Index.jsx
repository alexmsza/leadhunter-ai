import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import LeadConfigForm from '../components/LeadConfigForm';
import LeadResults from '../components/LeadResults';
import ScheduleGuide from '../components/ScheduleGuide';
import { API_BASE_URL } from '../config/api.js';
import { ShieldCheck, Target, Globe, CheckCircle2, Sparkles } from 'lucide-react';

const Index = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  const { token } = useAuth();

  const handleFormSubmit = async (data) => {
    setIsLoading(true);
    setShowResults(false);
    setLeads([]);

    try {
      const response = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Erro no processamento da solicitação' }));
        throw new Error(errorData.detail || `Falha HTTP: ${response.status}`);
      }

      const resultLeads = await response.json();
      setLeads(resultLeads);
      setShowResults(true);

      if (resultLeads.length === 0) {
        toast({
          title: 'Nenhum lead qualificado no filtro',
          description: 'Ajuste o nicho ou região para expandir a amostragem auditada.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Amostra Zero-Trust Processada',
          description: `${resultLeads.length} leads auditados com link de referência conferível.`,
        });
      }
    } catch (error) {
      console.error('Erro na prospecção de leads:', error);
      toast({
        title: 'Falha na comunicação com o servidor',
        description: error instanceof Error ? error.message : 'Tente novamente em alguns instantes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-10 space-y-12 max-w-6xl">
        {/* Editorial Hero Section */}
        <section className="text-center space-y-6 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-soft">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Motor Forense de Veracidade Zero-Trust 2.0</span>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Prospecção B2B com Verificação Forense em Tempo Real
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Elimine listas sintéticas, dados fictícios e e-mails fantasmas. Toda oportunidade é auditada
              com resolução DNS, verificação social SSR e fonte pública de referência conferível.
            </p>
          </div>

          {/* Pillars Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-soft text-xs font-semibold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Garantia Anti-Sintética</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-soft text-xs font-semibold text-slate-700">
              <Globe className="w-4 h-4 text-sky-600" />
              <span>Validação DNS & Domínio</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200/80 shadow-soft text-xs font-semibold text-slate-700">
              <Target className="w-4 h-4 text-indigo-600" />
              <span>Link de Referência Obrigatório</span>
            </div>
          </div>
        </section>

        {/* Configuration Form */}
        <section id="leadhunter-form">
          <LeadConfigForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </section>

        {/* Results Section */}
        <section>
          <LeadResults leads={leads} isVisible={showResults} />
        </section>

        {/* Schedule Guide */}
        <section>
          <ScheduleGuide />
        </section>
      </div>
    </Layout>
  );
};

export default Index;
