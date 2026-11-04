// Configuração centralizada da URL da API
// Em desenvolvimento: aponta para http://localhost:8000/api
// Em produção: usa VITE_API_URL do ambiente ou fallback seguro

export const API_BASE_URL = (
  import.meta.env?.VITE_API_URL || 'http://localhost:8000/api'
).replace(/\/+$/, '');

export default API_BASE_URL;
