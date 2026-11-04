import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo } from './Logo';
import {
  Search,
  History,
  User,
  LogOut,
  Target,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const Layout = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { href: '/', label: 'Busca Inteligente', icon: Search },
    { href: '/history', label: 'Histórico Forense', icon: History },
    { href: '/profile', label: 'Meu Perfil', icon: User },
  ];

  const isCurrentPath = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/leadhunter';
    }
    return location.pathname === path || location.pathname === `/leadhunter${path}`;
  };

  return (
    <div className="min-h-dvh flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Header */}
      <header className="w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex items-center justify-between">
            {/* Logo e Branding */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3 group">
                <Logo variant="full" />
              </Link>
            </div>

            {/* Navegação Desktop */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    const active = isCurrentPath(link.href);
                    return (
                      <Link
                        key={link.href}
                        to={link.href}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
                          active
                            ? 'bg-white text-slate-900 shadow-soft'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${active ? 'text-sky-600' : 'text-slate-500'}`} />
                        <span>{link.label}</span>
                      </Link>
                    );
                  })}
                </nav>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                  title="Encerrar sessão"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm py-2 px-4"
                >
                  Criar Conta
                </Link>
              </div>
            )}
          </div>

          {/* Navegação Mobile */}
          {isAuthenticated && (
            <nav className="md:hidden mt-3 pt-3 border-t border-slate-100 flex items-center justify-around gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isCurrentPath(link.href);
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex-1 text-center transition-colors ${
                      active
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label.split(' ')[0]}</span>
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* Sub-header / Breadcrumbs */}
      {isAuthenticated && location.pathname !== '/' && location.pathname !== '/leadhunter' && (
        <div className="bg-white/60 border-b border-slate-200/60 py-2.5">
          <div className="container mx-auto px-4 sm:px-6 flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">
              LeadHunter
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold">
              {navLinks.find((l) => isCurrentPath(l.href))?.label || 'Plataforma'}
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 relative">
        {children}
      </main>

      {/* Corporate Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>LeadHunter AI &copy; {new Date().getFullYear()} &mdash; Garantia de Veracidade Forense Zero-Trust</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/termos" className="hover:text-slate-800 transition-colors">
              Termos de Uso
            </Link>
            <span>&bull;</span>
            <Link to="/privacidade" className="hover:text-slate-800 transition-colors">
              Privacidade & LGPD
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
