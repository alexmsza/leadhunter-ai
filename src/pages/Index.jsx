import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import LeadConfigForm from '../components/LeadConfigForm';
import LeadResults from '../components/LeadResults';
import ScheduleGuide from '../components/ScheduleGuide';
import { API_BASE_URL } from '../../config/api.js';

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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Erro desconhecido no servidor' }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const resultLeads = await response.json();
      setLeads(resultLeads);
      setShowResults(true);

      if (resultLeads.length === 0) {
        toast({
          title: "Nenhum lead encontrado",
          description: "Tente ajustar seus critérios de busca para melhores resultados.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Busca concluída!",
          description: `${resultLeads.length} leads encontrados.`,
          variant: "success",
        });
      }

    } catch (error) {
      console.error("Failed to fetch leads:", error);
      toast({
        title: "Ocorreu um erro!",
        description: error instanceof Error ? error.message : "Não foi possível buscar os leads. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              Encontre Clientes com
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ml-3">
                Inteligência Artificial
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Use o poder da IA para identificar empresas com baixa presença digital 
              e transformá-las em oportunidades de negócio
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <span className="text-2xl">🎯</span>
              <span className="text-sm font-medium">Busca Inteligente</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <span className="text-2xl">👥</span>
              <span className="text-sm font-medium">Leads Qualificados</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <span className="text-2xl">⚡</span>
              <span className="text-sm font-medium">Resultados Rápidos</span>
            </div>
          </div>
        </section>

        {/* Configuration Form */}
        <section>
          <LeadConfigForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        </section>

        {/* Results */}
        <section>
          <LeadResults leads={leads} isVisible={showResults} />
        </section>

        {/* Schedule Guide */}
        <section>
          <ScheduleGuide />
        </section>
      </main>
    </Layout>
  );
};

export default Index;