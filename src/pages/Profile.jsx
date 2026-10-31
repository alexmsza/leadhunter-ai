import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { API_BASE_URL } from '../../config/api.js';

const ProfilePage = () => {
  const { token, logout } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [profileData, setProfileData] = useState({
    email: '',
    company_name: '',
    company_services: ''
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Falha ao carregar dados do perfil.');
      
      const data = await response.json();
      setProfileData({
        email: data.email || '',
        company_name: data.company_name || '',
        company_services: data.company_services || ''
      });
    } catch (error) {
      toast({
        title: 'Erro ao carregar perfil',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          company_name: profileData.company_name,
          company_services: profileData.company_services
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha ao atualizar o perfil.');
      }

      const updatedData = await response.json();
      setProfileData({
        email: updatedData.email || '',
        company_name: updatedData.company_name || '',
        company_services: updatedData.company_services || ''
      });

      toast({
        title: 'Perfil Atualizado!',
        description: 'Suas informações foram salvas com sucesso.',
        variant: 'success',
      });

    } catch (error) {
      toast({
        title: 'Erro ao Atualizar',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">👤 Meu Perfil</h1>
        
        {isFetching ? (
          <div className="text-center">
            <p>Carregando perfil...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Informações da Conta</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="bg-gray-100 px-4 py-3 rounded-lg border border-gray-200 text-gray-600">
                    {profileData.email}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado.</p>
                </div>

                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Empresa (Opcional)
                  </label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={profileData.company_name}
                    onChange={handleChange}
                    placeholder="Ex: Agência de Marketing Digital"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                   <p className="text-xs text-gray-500 mt-1">Esta informação será usada pela IA para gerar leads mais relevantes.</p>
                </div>

                <div>
                  <label htmlFor="company_services" className="block text-sm font-medium text-gray-700 mb-2">
                    Principais Serviços/Produtos (Opcional)
                  </label>
                  <textarea
                    id="company_services"
                    name="company_services"
                    value={profileData.company_services}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Ex: Criação de sites, gestão de redes sociais, consultoria de vendas"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                   <p className="text-xs text-gray-500 mt-1">Ajude a IA a entender o que sua empresa oferece.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50"
              >
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
            <button 
                onClick={logout}
                className="text-sm text-gray-600 hover:text-red-600 hover:underline"
            >
                Sair da conta (Logout)
            </button>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
