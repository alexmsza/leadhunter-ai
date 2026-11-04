import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Sliders,
  Filter,
  PlusCircle,
  MinusCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

const LeadConfigForm = ({ onSubmit, isLoading }) => {
  const [config, setConfig] = useState({
    niche: '',
    region: '',
    quantity: 20,
    criteria: 'baixa presença digital, sem anúncios ativos, website desatualizado',
    include_keywords: '',
    exclude_keywords: '',
    probe_live_social: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(config);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/80 shadow-card">
      <div className="flex items-start justify-between border-b border-slate-100 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Parâmetros de Auditoria
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Configurar Filtros de Prospecção
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Defina o segmento, localização e requisitos para enriquecimento com verificação Zero-Trust.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nicho e Região */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              Nicho / Segmento
            </label>
            <input
              type="text"
              value={config.niche}
              onChange={(e) => setConfig({ ...config, niche: e.target.value })}
              placeholder="Ex: Clínicas odontológicas, Consultoria"
              className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              Região / Município / UF
            </label>
            <input
              type="text"
              value={config.region}
              onChange={(e) => setConfig({ ...config, region: e.target.value })}
              placeholder="Ex: São Paulo, Belo Horizonte, Brasil"
              className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
              required
            />
          </div>
        </div>

        {/* Quantidade Slider */}
        <div className="space-y-2 p-4 bg-slate-50/80 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              Volume de Amostragem Auditada
            </label>
            <span className="text-sm font-bold tabular-nums text-slate-900 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-soft">
              {config.quantity} leads
            </span>
          </div>
          <input
            type="range"
            value={config.quantity}
            onChange={(e) => setConfig({ ...config, quantity: parseInt(e.target.value, 10) })}
            min={5}
            max={50}
            step={5}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
          />
          <div className="flex justify-between text-[11px] text-slate-500 tabular-nums">
            <span>5 (Amostra Rápida)</span>
            <span>25</span>
            <span>50 (Lote Completo)</span>
          </div>
        </div>

        {/* Critérios */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            Critérios de Qualificação
          </label>
          <textarea
            value={config.criteria}
            onChange={(e) => setConfig({ ...config, criteria: e.target.value })}
            placeholder="Ex: sem campanha de tráfego pago, presença tímida no Instagram, e-mail institucional corporativo"
            className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all resize-none min-h-[72px]"
            rows={2}
          />
        </div>

        {/* Palavras-chave */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
              Palavras-chave Inclusivas
            </label>
            <input
              type="text"
              value={config.include_keywords}
              onChange={(e) => setConfig({ ...config, include_keywords: e.target.value })}
              placeholder="Ex: B2B, consultoria, premium"
              className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <MinusCircle className="w-3.5 h-3.5 text-rose-500" />
              Palavras-chave Exclusivas
            </label>
            <input
              type="text"
              value={config.exclude_keywords}
              onChange={(e) => setConfig({ ...config, exclude_keywords: e.target.value })}
              placeholder="Ex: franquia, governo, terceirizado"
              className="w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
            />
          </div>
        </div>

        {/* Zero-Trust Toggle */}
        <div className="flex items-center justify-between p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <div>
              <p className="text-xs font-bold text-emerald-900">Auditoria Forense Zero-Trust Ativa</p>
              <p className="text-[11px] text-emerald-700">
                Garante link de referência conferível, verificação DNS e bloqueio de contagens repetidas.
              </p>
            </div>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
            Ativo
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary w-full py-3 text-sm font-semibold rounded-xl"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <span>Auditando e Gerando Leads Verificados...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Executar Prospecção com Garantia Forense</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default LeadConfigForm;
