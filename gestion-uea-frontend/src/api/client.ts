// src/api/client.ts
const API_BASE_URL = 'http://localhost:8000/api';

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Gérer les erreurs d'authentification
    if (response.status === 401) {
      console.error('❌ Token invalide ou expiré');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expirée');
    }

    // Vérifier le Content-Type
    const contentType = response.headers.get('content-type');
    
    if (!response.ok) {
      // Essayer de lire le JSON d'erreur si disponible
      if (contentType?.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur ${response.status}`);
      }
      throw new Error(`Erreur ${response.status}`);
    }

    // Vérifier que la réponse est bien du JSON
    if (!contentType?.includes('application/json')) {
      const text = await response.text();
      console.error('❌ Réponse non-JSON reçue:', text.substring(0, 200));
      throw new Error('Réponse invalide du serveur');
    }

    return response.json();
  } catch (error) {
    console.error('❌ Erreur API:', error);
    throw error;
  }
};