import React from 'react';
import { useToast } from '../hooks/use-toast';

const LeadResults = ({ leads, isVisible }) => {
  const { toast } = useToast();

  const exportToCSV = () => {
    if (leads.length === 0) return;

    const headers = ['Nome da Empresa', 'Instagram/Site', 'WhatsApp'];
    const csvContent = [
      headers.join(','),
      ...leads.map(lead => [
        lead.name || lead.business_name || 'N/A',
        lead.instagram || lead.website || 'N/A',
        lead.whatsapp || lead.contact || 'N/A'
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export realizado!",
      description: `${leads.length} leads exportados para CSV`,
    });
  };

  if (!isVisible || leads.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Leads Encontrados</h3>
          <p className="text-gray-600">
            {leads.length} empresas identificadas com baixa presença digital
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span>📥</span>
          Exportar CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Mobile View */}
          <div className="grid grid-cols-1 gap-4 sm:hidden">
            {leads.map((lead, index) => (
              <div key={lead.id || index} className="p-4 border border-gray-200 bg-gray-50 rounded-lg">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-gray-800">{lead.name || lead.business_name || `Lead ${index + 1}`}</h4>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      Score: {lead.score}%
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {(lead.instagram || lead.website) && (
                      <div className="flex items-center gap-2">
                        {lead.instagram ? (
                          <span className="text-pink-500">📷</span>
                        ) : (
                          <span className="text-blue-500">🌐</span>
                        )}
                        <a
                          href={lead.instagram || lead.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {lead.instagram ? '@' + lead.instagram.split('/').pop() : 'Website'}
                          <span className="text-xs">🔗</span>
                        </a>
                      </div>
                    )}
                    
                    {(lead.whatsapp || lead.contact) && (
                      <div className="flex items-center gap-2">
                        <span className="text-green-500">💬</span>
                        <a
                          href={`https://wa.me/${(lead.whatsapp || lead.contact).replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          {lead.whatsapp || lead.contact}
                          <span className="text-xs">🔗</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden sm:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Nome da Empresa</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Instagram/Site</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">WhatsApp</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-800">Score</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => (
                  <tr key={lead.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-800">{lead.name || lead.business_name || `Lead ${index + 1}`}</div>
                      {lead.description && (
                        <div className="text-sm text-gray-600 mt-1">{lead.description}</div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {(lead.instagram || lead.website) ? (
                        <a
                          href={lead.instagram || lead.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-2"
                        >
                          {lead.instagram ? (
                            <>
                              <span className="text-pink-500">📷</span>
                              @{lead.instagram.split('/').pop()}
                            </>
                          ) : (
                            <>
                              <span className="text-blue-500">🌐</span>
                              Website
                            </>
                          )}
                          <span className="text-xs">🔗</span>
                        </a>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      {(lead.whatsapp || lead.contact) ? (
                        <a
                          href={`https://wa.me/${(lead.whatsapp || lead.contact).replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-2"
                        >
                          <span className="text-green-500">💬</span>
                          {lead.whatsapp || lead.contact}
                          <span className="text-xs">🔗</span>
                        </a>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {lead.score}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadResults;