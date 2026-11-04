import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { API_BASE_URL } from '../config/api.js';
import {
  History,
  CheckCircle2,
  Users,
  Percent,
  Trash2,
  Calendar,
  ExternalLink,
  Search,
  SearchX,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HistoryPage = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  const [searches, setSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSearchHistory();
  }, []);

  const fetchSearchHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/search-history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSearches(Array.isArray(data) ? data : []);
      } else {
        setSearches([]);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      toast({
        title: 'Falha de Conexão',
        description: 'Não foi possível carregar o histórico de prospecção.',
        variant: 'destructive',
      });
      setSearches([]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSearch = async (searchId) => {
    if (!window.confirm('Confirma a remoção definitiva deste registro de busca do histórico?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/search-history/${searchId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSearches((prev) => prev.filter((s) => s.id !== searchId));
        toast({
          title: 'Registro Excluído',
          description: 'A busca foi removida com sucesso do banco de dados.',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o registro.',
        variant: 'destructive',
      });
    }
  };

  const completedSearches = searches.filter((s) => (s.status || '').toUpperCase() === 'COMPLETED');
  const totalLeadsFound = searches.reduce((acc, s) => acc + (s.leads_count || s.results_count || 0), 0);
  const successRate = searches.length > 0 ? Math.round((completedSearches.length / searches.length) * 100) : 100;

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4" />
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Carregando registros forenses...
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-10 max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
              Auditoria de Consultas
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Histórico Forense de Buscas
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Registro imutável de todas as prospecções executadas com verificação Zero-Trust.
            </p>
          </div>

          <div className="text-xs font-medium text-slate-500 tabular-nums">
            Total de consultas: <strong className="text-slate-900">{searches.length}</strong>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5 space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total de Buscas</span>
            <p className="text-2xl font-bold tabular-nums text-slate-900">{searches.length}</p>
          </div>

          <div className="card p-5 space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Concluídas</span>
            <p className="text-2xl font-bold tabular-nums text-emerald-600">{completedSearches.length}</p>
          </div>

          <div className="card p-5 space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Leads Auditados</span>
            <p className="text-2xl font-bold tabular-nums text-sky-600">{totalLeadsFound}</p>
          </div>

          <div className="card p-5 space-y-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Taxa de Sucesso</span>
            <p className="text-2xl font-bold tabular-nums text-slate-900">{successRate}%</p>
          </div>
        </div>

        {/* Search List */}
        <div className="card overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Consultas Realizadas
            </h2>
          </div>

          {searches.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {searches.map((item) => {
                const dateStr = item.created_at
                  ? new Date(item.created_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Recente';

                const leadsCount = item.leads_count || item.results_count || 0;

                return (
                  <div key={item.id} className="p-5 sm:p-6 hover:bg-slate-50/60 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-bold text-slate-900">
                            {item.niche || item.query_niche || 'Nicho Geral'}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {item.status || 'COMPLETED'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-600">
                          <div>
                            <span className="text-slate-400 font-medium">Região:</span>{' '}
                            <strong className="text-slate-700">{item.region || item.query_region || 'Brasil'}</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">Volume:</span>{' '}
                            <strong className="text-slate-700 tabular-nums">{item.quantity} solicitados</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium">Leads Verificados:</span>{' '}
                            <strong className="text-emerald-700 tabular-nums">{leadsCount}</strong>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{dateStr}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => deleteSearch(item.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors"
                          title="Remover do histórico"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Excluir</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <SearchX className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-bold text-slate-900">Nenhuma busca realizada</h3>
                <p className="text-xs text-slate-500">
                  Execute sua primeira prospecção com verificação forense para gerar histórico auditável.
                </p>
              </div>
              <Link to="/app" className="btn-primary text-xs py-2 px-4 inline-flex">
                Iniciar Nova Busca
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HistoryPage;
