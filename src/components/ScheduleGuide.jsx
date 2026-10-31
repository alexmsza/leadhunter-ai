import React from 'react';

const scheduleItems = [
  {
    day: "Segunda-feira",
    activity: "Organização e Follow-up",
    description: "Revisar leads da semana anterior e organizar pipeline",
    icon: "✅",
    color: "bg-blue-500",
    time: "9h - 11h"
  },
  {
    day: "Terça-feira",
    activity: "Prospecção Intensiva",
    description: "Geração de novos leads e primeiro contato",
    icon: "📞",
    color: "bg-green-500",
    time: "9h - 12h"
  },
  {
    day: "Quarta-feira",
    activity: "Prospecção Intensiva",
    description: "Continuação da geração e qualificação de leads",
    icon: "📞",
    color: "bg-green-500",
    time: "9h - 12h"
  },
  {
    day: "Quinta-feira",
    activity: "Prospecção Intensiva",
    description: "Finalização da prospecção semanal",
    icon: "📞",
    color: "bg-green-500",
    time: "9h - 12h"
  },
  {
    day: "Sexta-feira",
    activity: "Prospecção e Follow-up",
    description: "Últimos contatos e acompanhamento de respostas",
    icon: "📧",
    color: "bg-purple-500",
    time: "9h - 12h"
  }
];

const ScheduleGuide = () => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-xl">📅</span>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Cronograma Sugerido</h3>
        </div>
        <p className="text-gray-600">
          Organize sua semana para maximizar resultados na prospecção
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scheduleItems.map((item, index) => (
          <div key={index} className="p-4 border border-gray-200 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-md">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-white border border-gray-200 text-xs font-medium px-2 py-1 rounded-full">
                  {item.day}
                </span>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>🕘</span>
                  {item.time}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-white text-sm">{item.icon}</span>
                </div>
                <h4 className="font-semibold text-sm text-gray-800">{item.activity}</h4>
              </div>
              
              <p className="text-xs text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-yellow-200 rounded-lg flex items-center justify-center mt-0.5">
            <span className="text-yellow-700 text-sm">💡</span>
          </div>
          <div>
            <h4 className="font-medium text-sm text-gray-800 mb-1">Dica de Produtividade</h4>
            <p className="text-xs text-gray-600">
              <strong>Tarde (14h - 17h):</strong> Reserve para checar respostas, agendar reuniões e qualificar leads interessados. 
              Este horário é ideal para atividades de follow-up e nutrição de relacionamentos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleGuide;