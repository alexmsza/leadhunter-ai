import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { API_BASE_URL } from '../config/api.js';
import { User, Building2, Briefcase, Phone, Save, ShieldCheck, Mail } from 'lucide-react';

const ProfilePage = () => {
  const { token, logout } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [profileData, setProfileData] = useState({
    email: '',
    company_name: '',
    company_services: '',
    phone: '',
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setIsFetching(true);
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Falha ao carregar dados cadastrais.');

      const data = await response.json();
      setProfileData({
        email: data.email || '',
        company_name: data.company_name || '',
        company_services: data.company_services || '',
        phone: data.phone || '',
      });
    } catch (error) {
      toast({
        title: 'Erro ao carregar perfil',
        description: error instanceof Error ? error.message : 'Não foi possível buscar as informações.',
        variant: 'destructive',
      });
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company_name: profileData.company_name,
          company_services: profileData.company_services,
          phone: profileData.phone,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Falha ao atualizar o perfil.');
      }

      toast({
        title: 'Perfil Salvo',
        description: 'Parâmetros corporativos atualizados com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao Atualizar',
        description: error instanceof Error ? error.message : 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 py-10 max-w-3xl space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
            Configuração de Conta
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Perfil Corporativo & Contexto de Negócio
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            As informações da sua empresa orientam os modelos para prospecções mais assertivas.
          </p>
        </div>

        {isFetching ? (
          <div className="card p-12 text-center space-y-3">
            <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Carregando dados cadastrais...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-6">
            <div className="space-y-4">
              {/* E-mail (read-only) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  E-mail de Acesso
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="w-full px-3.5 py-2.5 bg-slate-100/80 border border-slate-200 rounded-xl text-sm text-slate-600 font-mono cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-400">O endereço de e-mail está associado à sua licença.</p>
              </div>

              {/* Nome da Empresa */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  Nome da Empresa / Assessoria
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={profileData.company_name}
                  onChange={handleChange}
                  placeholder="Ex: Prime Tech Solutions"
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                />
              </div>

              {/* Telefone / WhatsApp */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  Telefone / WhatsApp Institucional
                </label>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  placeholder="Ex: (11) 98765-4321"
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                />
              </div>

              {/* Serviços / Produtos */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  Produtos / Serviços Ofertados
                </label>
                <textarea
                  name="company_services"
                  value={profileData.company_services}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Ex: Desenvolvimento de software customizado, consultoria tributária, automação de processos comerciais..."
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all resize-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={logout}
                className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
              >
                Encerrar Sessão
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isLoading ? 'Salvando...' : 'Salvar Alterações'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default ProfilePage;
