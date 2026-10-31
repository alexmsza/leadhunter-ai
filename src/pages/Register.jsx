import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import ContactForm from '../components/ContactForm';
import { API_BASE_URL } from '../../config/api.js';

export const RegisterPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({ 
        title: 'Erro', 
        description: 'As senhas não coincidem.', 
        variant: 'destructive' 
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({ 
        title: 'Erro', 
        description: 'A senha deve ter pelo menos 6 caracteres.', 
        variant: 'destructive' 
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Falha ao registrar.');
        } else {
          throw new Error(`Erro no servidor: ${response.status} ${response.statusText}`);
        }
      }

      toast({ 
        title: 'Registro bem-sucedido!', 
        description: 'Você já pode fazer login.', 
        variant: 'success' 
      });
      navigate('/leadhunter/login');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
      toast({ 
        title: 'Erro no Registro', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToMain = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      {/* Botão de voltar */}
      <div className="w-full max-w-6xl mb-6">
        <button
          onClick={handleBackToMain}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-white/50"
        >
          <span className="text-2xl">←</span>
          <span className="font-medium">Voltar ao site principal</span>
        </button>
      </div>

      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">🎯</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">LeadHunter AI</h1>
              <p className="text-gray-600 font-medium">Crie sua conta e comece a gerar leads</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário de Registro */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">Criar Conta Gratuita</h2>
              <p className="text-gray-600 mt-1">Registre-se e comece a usar hoje mesmo</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Senha
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                    minLength={6}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Senha
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirme sua senha"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Registrando...
                    </div>
                  ) : (
                    '🚀 Criar Conta Gratuita'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Já tem uma conta?{' '}
                  <Link 
                    to="/leadhunter/login" 
                    className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                  >
                    Fazer Login
                  </Link>
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-xs text-gray-500">
                  Ao criar uma conta, você concorda com nossos{' '}
                  <Link to="/termos" className="text-blue-600 hover:text-blue-700 underline">
                    Termos de Uso
                  </Link>{' '}
                  e{' '}
                  <Link to="/privacidade" className="text-blue-600 hover:text-blue-700 underline">
                    Política de Privacidade
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Formulário de Contato */}
          <ContactForm />
        </div>

        {/* Seção de vantagens */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🎁 O que você ganha com o LeadHunter AI?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🆓</div>
              <h4 className="font-semibold text-gray-800 mb-2">Gratuito</h4>
              <p className="text-gray-600 text-sm">
                Comece a usar sem pagar nada
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🤖</div>
              <h4 className="font-semibold text-gray-800 mb-2">IA Poderosa</h4>
              <p className="text-gray-600 text-sm">
                Algoritmos que realmente funcionam
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <h4 className="font-semibold text-gray-800 mb-2">Histórico</h4>
              <p className="text-gray-600 text-sm">
                Acompanhe todas suas buscas
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💼</div>
              <h4 className="font-semibold text-gray-800 mb-2">Profissional</h4>
              <p className="text-gray-600 text-sm">
                Ferramenta para vendedores sérios
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};