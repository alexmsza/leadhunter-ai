import React, { useState } from 'react';

const LeadConfigForm = ({ onSubmit, isLoading }) => {
  const [config, setConfig] = useState({
    niche: "",
    region: "",
    quantity: 50,
    criteria: "poucos reels, não anuncia, alcance baixo, poucas curtidas em posts",
    include_keywords: "",
    exclude_keywords: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(config);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">🎯</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Configurar Busca</h2>
        </div>
        <p className="text-gray-600">
          Configure os parâmetros para gerar leads personalizados com IA
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <span className="text-lg">🔍</span>
              Nicho de Mercado
            </label>
            <input
              type="text"
              value={config.niche}
              onChange={(e) => setConfig({ ...config, niche: e.target.value })}
              placeholder="Ex: Energia solar, Consultoria empresarial"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <span className="text-lg">🎯</span>
              Região
            </label>
            <input
              type="text"
              value={config.region}
              onChange={(e) => setConfig({ ...config, region: e.target.value })}
              placeholder="Ex: Brasília, São Paulo, Rio de Janeiro"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
            <span className="text-lg">⚡</span>
            Quantidade de Leads: {config.quantity}
          </label>
          <div className="px-4">
            <input
              type="range"
              value={config.quantity}
              onChange={(e) => setConfig({ ...config, quantity: parseInt(e.target.value) })}
              min={10}
              max={300}
              step={10}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>10</span>
              <span>150</span>
              <span>300</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
            <span className="text-lg">🔧</span>
            Critérios de Baixa Presença Digital
          </label>
          <textarea
            value={config.criteria}
            onChange={(e) => setConfig({ ...config, criteria: e.target.value })}
            placeholder="Ex: poucos reels, não anuncia, alcance baixo, poucas curtidas"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px] resize-none"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <span className="text-lg text-green-500">➕</span>
              Palavras-chave para Incluir
            </label>
            <input
              type="text"
              value={config.include_keywords}
              onChange={(e) => setConfig({ ...config, include_keywords: e.target.value })}
              placeholder="Ex: B2B, software, artesanal"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2 text-gray-700">
              <span className="text-lg text-red-500">➖</span>
              Palavras-chave para Excluir
            </label>
            <input
              type="text"
              value={config.exclude_keywords}
              onChange={(e) => setConfig({ ...config, exclude_keywords: e.target.value })}
              placeholder="Ex: B2C, governo, grande porte"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Gerando lista com Gemini...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="text-lg mr-2">⚡</span>
              Gerar lista com Gemini
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default LeadConfigForm;