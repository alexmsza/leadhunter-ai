import React, { useState } from 'react';
import { useToast } from '../hooks/use-toast';
import { API_BASE_URL } from '../../config/api.js';

const ContactForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha nome, email e mensagem.',
        variant: 'destructive'
      });
      return;
    }

    if (formData.message.length < 10) {
      toast({
        title: 'Mensagem muito curta',
        description: 'A mensagem deve ter pelo menos 10 caracteres.',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Falha ao enviar mensagem.');
        } else {
          throw new Error(`Erro no servidor: ${response.status} ${response.statusText}. Verifique as credenciais de e-mail no backend.`);
        }
      }

      toast({ 
        title: 'Mensagem Enviada!', 
        description: 'Entraremos em contato em breve.',
        variant: 'success'
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
      toast({ 
        title: 'Erro', 
        description: errorMessage, 
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800">Solicite um Orçamento</h3>
        <p className="text-gray-600 mt-1">Peça acesso ou tire suas dúvidas.</p>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Seu nome"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telefone (Opcional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(XX) XXXXX-XXXX"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensagem *
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Sua mensagem..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
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
                Enviando...
              </div>
            ) : (
              'Enviar Mensagem'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;