import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Layout = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/leadhunter/login');
  };

  const handleBackToMain = () => {
    navigate('/');
  };

  const navLinks = [
    { href: '/leadhunter', label: 'Busca', icon: '🔍' },
    { href: '/leadhunter/history', label: 'Histórico', icon: '📊' },
    { href: '/leadhunter/profile', label: 'Perfil', icon: '👤' },
  ];

  const isCurrentPath = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header melhorado */}
      <header className="w-full border-b-2 border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo e título */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToMain}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                title="Voltar ao site principal"
              >
                <span className="text-2xl">←</span>
                <span className="text-sm font-medium hidden sm:block">Voltar</span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">🎯</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 tracking-tight">LeadHunter AI</h1>
                  <p className="text-sm text-gray-600 font-medium">Inteligência Artificial para Prospecção</p>
                </div>
              </div>
            </div>

            {isAuthenticated && (
              <>
                {/* Navegação principal */}
                <nav className="hidden md:flex items-center gap-2 bg-gray-100 rounded-xl p-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`
                        flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-base transition-all duration-200
                        ${isCurrentPath(link.href) 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-white hover:shadow-md'
                        }
                      `}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span className="font-bold">{link.label}</span>
                    </Link>
                  ))}
                </nav>

                {/* Botão de logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-all font-semibold border border-red-200"
                >
                  <span className="text-lg">🚪</span>
                  <span className="hidden sm:block">Sair</span>
                </button>
              </>
            )}
          </div>

          {/* Navegação mobile */}
          {isAuthenticated && (
            <nav className="md:hidden mt-4 flex items-center gap-1 bg-gray-100 rounded-xl p-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`
                    flex flex-col items-center gap-1 px-3 py-2 rounded-lg font-semibold text-xs transition-all duration-200 flex-1
                    ${isCurrentPath(link.href) 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:text-blue-600 hover:bg-white'
                    }
                  `}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className="font-bold">{link.label}</span>
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Breadcrumb melhorado */}
      {isAuthenticated && (
        <div className="bg-white/70 backdrop-blur-sm border-b border-gray-200 py-3">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={handleBackToMain}
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                Kattu Web
              </button>
              <span className="text-gray-400">›</span>
              <span className="text-gray-600 font-medium">LeadHunter AI</span>
              {location.pathname !== '/leadhunter' && (
                <>
                  <span className="text-gray-400">›</span>
                  <span className="text-gray-800 font-semibold">
                    {navLinks.find(link => link.href === location.pathname)?.label || 'Página'}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo principal */}
      <main className="relative">
        {children}
      </main>

      {/* Botão flutuante de volta */}
      {isAuthenticated && (
        <button
          onClick={() => navigate(-1)}
          className="fixed bottom-6 left-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 z-40"
          title="Voltar"
        >
          <span className="text-xl">←</span>
        </button>
      )}

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">© 2024 LeadHunter AI - Kattumaram Tech</p>
            <p className="text-sm">
              Encontre leads qualificados com Inteligência Artificial
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};