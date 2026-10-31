import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';

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
      const response = await fetch('/api/search-history', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSearches(data);
      } else {
        // Mock data para demonstração
        const mockData = [
          {
            id: 1,
            niche: "Restaurantes",
            region: "São Paulo, SP",
            quantity: 50,
            results_count: 23,
            created_at: "2024-01-15T10:30:00Z",
            status: "completed"
          },
          {
            id: 2,
            niche: "Salões de Beleza",
            region: "Rio de Janeiro, RJ",
            quantity: 30,
            results_count: 18,
            created_at: "2024-01-14T14:20:00Z",
            status: "completed"
          },
          {
            id: 3,
            niche: "Lojas de Roupas",
            region: "Belo Horizonte, MG",
            quantity: 40,
            results_count: 0,
            created_at: "2024-01-13T09:15:00Z",
            status: "failed"
          }
        ];
        setSearches(mockData);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o histórico.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSearch = async (searchId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta busca?')) {
      return;
    }

    try {
      const response = await fetch(`/api/search-history/${searchId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSearches(searches.filter(search => search.id !== searchId));
        toast({
          title: 'Busca excluída',
          description: 'A busca foi removida do histórico.',
          variant: 'success'
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir a busca.',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Concluída</span>;
      case 'failed':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Falhou</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">Pendente</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">Desconhecido</span>;
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">📊 Histórico de Buscas</h1>
            <div className="text-sm text-gray-600">
              Total: {searches.length} buscas
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-semibold text-gray-800">Total de Buscas</h3>
              <p className="text-2xl font-bold text-blue-600">{searches.length}</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-2xl mb-2">✅</div>
              <h3 className="font-semibold text-gray-800">Bem-sucedidas</h3>
              <p className="text-2xl font-bold text-green-600">
                {searches.filter(s => s.status === 'completed').length}
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="font-semibold text-gray-800">Leads Encontrados</h3>
              <p className="text-2xl font-bold text-purple-600">
                {searches.reduce((total, search) => total + (search.results_count || 0), 0)}
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="text-2xl mb-2">⭐</div>
              <h3 className="font-semibold text-gray-800">Taxa de Sucesso</h3>
              <p className="text-2xl font-bold text-indigo-600">
                {searches.length > 0 ? 
                  Math.round((searches.filter(s => s.status === 'completed').length / searches.length) * 100) : 0
                }%
              </p>
            </div>
          </div>

          {/* Search History List */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Buscas Realizadas</h2>
            </div>
            
            {searches.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {searches.map((search) => (
                  <div key={search.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <h3 className="font-semibold text-gray-800">{search.niche}</h3>
                          {getStatusBadge(search.status)}
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div>
                            <strong>Região:</strong> {search.region}
                          </div>
                          <div>
                            <strong>Quantidade solicitada:</strong> {search.quantity}
                          </div>
                          <div>
                            <strong>Resultados encontrados:</strong> {search.results_count || 0}
                          </div>
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-500">
                          Realizada em: {new Date(search.created_at).toLocaleDateString('pt-BR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {search.status === 'completed' && search.results_count > 0 && (
                          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm">
                            Ver Resultados
                          </button>
                        )}
                        <button 
                          onClick={() => deleteSearch(search.id)}
                          className="bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200 transition-colors text-sm"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Nenhuma busca realizada ainda
                </h3>
                <p className="text-gray-600 mb-6">
                  Comece sua primeira busca de leads para ver o histórico aqui.
                </p>
                <a 
                  href="/leadhunter"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                >
                  Buscar Leads Agora
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};