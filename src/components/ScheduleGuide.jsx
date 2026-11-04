import React from 'react';
import {
  Calendar,
  Clock,
  CheckSquare,
  PhoneCall,
  MailCheck,
  Lightbulb,
  Sparkles,
} from 'lucide-react';

const scheduleItems = [
  {
    day: 'Segunda-feira',
    activity: 'Planejamento & Follow-up',
    description: 'Auditar respostas da semana anterior, atualizar pipeline e selecionar novos nichos.',
    icon: CheckSquare,
    badgeColor: 'text-sky-700 bg-sky-50 border-sky-200',
    time: '09h – 11h',
  },
  {
    day: 'Terça-feira',
    activity: 'Prospecção Intensiva (Lote 1)',
    description: 'Geração com verificação forense e primeiro contato com decisores via WhatsApp e e-mail.',
    icon: PhoneCall,
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    time: '09h – 12h',
  },
  {
    day: 'Quarta-feira',
    activity: 'Prospecção Intensiva (Lote 2)',
    description: 'Continuidade de contatos qualificados e apresentação do diagnóstico de presença digital.',
    icon: PhoneCall,
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    time: '09h – 12h',
  },
  {
    day: 'Quinta-feira',
    activity: 'Conexões & Demonstrações',
    description: 'Agendamento de reuniões de diagnóstico e envio de propostas para leads engajados.',
    icon: PhoneCall,
    badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    time: '09h – 12h',
  },
  {
    day: 'Sexta-feira',
    activity: 'Fechamento & Auditoria Semanal',
    description: 'Últimos follow-ups, consolidação de métricas e limpeza da base de dados.',
    icon: MailCheck,
    badgeColor: 'text-slate-700 bg-slate-100 border-slate-200',
    time: '09h – 12h',
  },
];

const ScheduleGuide = () => {
  return (
    <div className="card p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Metodologia Comercial
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-slate-900">
            Cronograma Semanal de Prospecção
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ritmo sugerido para transformar leads auditados em reuniões comerciais agendadas.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Cadência Semanal</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {scheduleItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                  {item.day}
                </span>
                <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {item.time}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 leading-tight">
                  {item.activity}
                </h4>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <p className="font-bold">Horário de Ouro para Follow-Up (14h &ndash; 17h)</p>
          <p className="text-amber-800 leading-relaxed">
            Reserve o período da tarde para acompanhar respostas de WhatsApp e responder a interessados.
            Leads corporativos apresentam taxas de conversão 40% maiores quando respondidos no mesmo dia útil.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScheduleGuide;
