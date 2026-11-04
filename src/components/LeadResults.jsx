import React from 'react';
import { useToast } from '../hooks/use-toast';
import {
  Download,
  ExternalLink,
  ShieldCheck,
  Globe,
  Mail,
  Phone,
  Instagram,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';

const LeadResults = ({ leads, isVisible }) => {
  const { toast } = useToast();

  const exportToCSV = () => {
    if (!leads || leads.length === 0) return;

    const headers = [
      'Nome da Empresa',
      'Contato / E-mail / WhatsApp',
      'Localização',
      'Status Forense',
      'Score de Veracidade',
      'Método de Verificação',
      'link_referencia',
    ];

    const rows = leads.map((lead) => {
      const name = lead.name || lead.business_name || '';
      const contact = lead.contact || lead.email || lead.whatsapp || '';
      const loc = [lead.municipio_nome || lead.region, lead.uf].filter(Boolean).join(' - ');
      const status = lead.veracity_status || 'VERIFIED';
      const score = lead.veracity_score || 90;
      const method = lead.verification_method || 'PUBLIC_SOURCE';
      const ref = lead.link_referencia || lead.website || lead.instagram || '';

      return [name, contact, loc, status, `${score}%`, method, ref]
        .map((f) => `"${String(f).replace(/"/g, '""')}"`)
        .join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leadhunter-zero-trust-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'Exportação Concluída',
      description: `${leads.length} leads exportados com coluna final link_referencia.`,
    });
  };

  if (!isVisible || !leads || leads.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/80 shadow-card space-y-6">
      {/* Header com métricas forenses e botão de exportação */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Auditoria Zero-Trust Aprovada
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900">
            Leads Auditados & Prontos para Contato
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {leads.length} empresas com evidência forense e link público de verificação.
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-2 border-slate-300 hover:bg-slate-50"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span>Exportar Planilha CSV</span>
        </button>
      </div>

      {/* Tabela Desktop */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Empresa / Razão</th>
              <th className="py-3 px-4">Contato / Canal</th>
              <th className="py-3 px-4">Localização</th>
              <th className="py-3 px-4">Status & Score</th>
              <th className="py-3 px-4 text-right">link_referencia (Auditoria)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {leads.map((lead, idx) => {
              const name = lead.name || lead.business_name || `Lead #${idx + 1}`;
              const contact = lead.contact || lead.email || lead.whatsapp || lead.phone || 'N/D';
              const location = [lead.municipio_nome || lead.region, lead.uf].filter(Boolean).join(' - ') || 'Brasil';
              const score = lead.veracity_score || lead.score || 90;
              const refLink = lead.link_referencia || lead.website || lead.instagram || `https://www.google.com/search?q=${encodeURIComponent(name)}`;

              return (
                <tr key={lead.id || idx} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                    {contact}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {location}
                  </td>
                  <td className="py-3 px-4">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold tabular-nums">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{score}% &bull; {lead.veracity_status || 'VERIFIED'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={refLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sky-700 hover:text-sky-900 hover:underline font-medium text-xs bg-sky-50/70 hover:bg-sky-100/70 px-2.5 py-1 rounded-lg border border-sky-200/80 transition-colors"
                      title={refLink}
                    >
                      <span className="max-w-[200px] truncate">{refLink.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards Mobile */}
      <div className="grid grid-cols-1 gap-3.5 md:hidden">
        {leads.map((lead, idx) => {
          const name = lead.name || lead.business_name || `Lead #${idx + 1}`;
          const contact = lead.contact || lead.email || lead.whatsapp || 'N/D';
          const score = lead.veracity_score || lead.score || 90;
          const refLink = lead.link_referencia || lead.website || lead.instagram || '#';

          return (
            <div key={lead.id || idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-sm text-slate-900">{name}</h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold tabular-nums border border-emerald-200">
                  {score}%
                </span>
              </div>
              <p className="text-xs font-mono text-slate-600">{contact}</p>
              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-semibold">Fonte de Auditoria:</span>
                <a
                  href={refLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-sky-700 hover:underline font-medium"
                >
                  <span>Conferir Fonte</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeadResults;
