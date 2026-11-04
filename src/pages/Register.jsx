import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import ContactForm from '../components/ContactForm';
import { API_BASE_URL } from '../config/api.js';
import {
  Target,
  UserPlus,
  Mail,
  Lock,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const RegisterPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Senhas divergentes',
        description: 'A confirmação de senha deve ser idêntica à senha informada.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: 'Senha insegura',
        description: 'A senha deve conter no mínimo 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Falha ao processar o cadastro.');
      }

      toast({
        title: 'Cadastro Realizado',
        description: 'Sua conta foi criada. Acesse a plataforma.',
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Erro no Registro',
        description: error instanceof Error ? error.message : 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-slate-50 flex flex-col justify-between p-4 sm:p-6 lg:p-10 font-sans">
      <div className="max-w-6xl w-full mx-auto space-y-8">
        {/* Top Header / Back */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao início</span>
          </Link>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Conformidade LGPD & Zero-Trust</span>
          </div>
        </div>

        {/* Brand Hero */}
        <div className="text-center space-y-3 pt-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto shadow-soft">
            <Target className="w-6 h-6 text-sky-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Criar Conta Corporativa
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Habilite sua empresa para prospectar leads B2B qualificados com validação forense.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-5xl mx-auto">
          {/* Card de Registro */}
          <div className="card p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Cadastro Institucional
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Preencha os campos abaixo para obter acesso à plataforma.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  E-mail Corporativo
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@empresa.com.br"
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  Senha (mínimo 6 caracteres)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                  required
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Ao criar sua conta, você concorda com nossos{' '}
                <Link to="/termos" className="text-slate-900 underline font-semibold">
                  Termos de Uso
                </Link>{' '}
                e com a nossa{' '}
                <Link to="/privacidade" className="text-slate-900 underline font-semibold">
                  Política de Privacidade (LGPD)
                </Link>.
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 text-sky-400" />
                    <span>Criar Conta & Iniciar</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-600">
                Já possui cadastro?{' '}
                <Link
                  to="/login"
                  className="font-bold text-slate-900 hover:underline"
                >
                  Fazer login
                </Link>
              </p>
            </div>
          </div>

          {/* Contact Card */}
          <ContactForm />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 mt-12 py-4">
        LeadHunter AI &copy; {new Date().getFullYear()} &mdash; Plataforma Corporativa de Prospecção.
      </footer>
    </div>
  );
};

export default RegisterPage;
