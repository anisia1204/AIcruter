// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  ENDPOINTS: {
    CHAT: '/api/chat',
    DOCUMENT_ANALYZE: '/api/documents/analyze',
    DOCUMENT_PARSE: '/api/documents/parse',
    HEALTH: '/'
  }
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
