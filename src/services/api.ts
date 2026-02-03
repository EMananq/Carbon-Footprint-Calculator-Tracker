// API Service - HTTP client for backend
const API_URL = 'http://localhost:5000/api';

// Get stored token
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

// Auth API
export const authAPI = {
  register: async (email: string, password: string, displayName: string) => {
    const data = await apiRequest<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    });
    localStorage.setItem('token', data.token);
    return data;
  },

  login: async (email: string, password: string) => {
    const data = await apiRequest<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem('token', data.token);
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getMe: async () => {
    return apiRequest<any>('/auth/me');
  },

  updateProfile: async (displayName: string, monthlyGoal: number) => {
    return apiRequest<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ displayName, monthlyGoal }),
    });
  },
};

// Activities API
export const activitiesAPI = {
  getAll: async () => {
    return apiRequest<any[]>('/activities');
  },

  create: async (activity: {
    category: string;
    type: string;
    value: number;
    unit: string;
    date: string;
    notes?: string;
  }) => {
    return apiRequest<any>('/activities', {
      method: 'POST',
      body: JSON.stringify(activity),
    });
  },

  update: async (id: number, activity: {
    category: string;
    type: string;
    value: number;
    unit: string;
    date: string;
    notes?: string;
  }) => {
    return apiRequest<any>(`/activities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(activity),
    });
  },

  delete: async (id: number) => {
    return apiRequest<any>(`/activities/${id}`, {
      method: 'DELETE',
    });
  },
};

// Stats API
export const statsAPI = {
  getStats: async () => {
    return apiRequest<{
      daily: number;
      weekly: number;
      monthly: number;
      byCategory: Record<string, number>;
    }>('/stats');
  },

  getTrend: async (days: number = 14) => {
    return apiRequest<{ date: string; emission: number }[]>(`/stats/trend?days=${days}`);
  },
};
