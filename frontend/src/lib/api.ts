const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4016/api';

interface RequestOptions {
  method?: string;
  body?: unknown;
  token?: string | null;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'İstek başarısız' }));
    throw new ApiError(response.status, error.message || 'İstek başarısız');
  }

  return response.json();
}

export const api = {
  auth: {
    register: (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      escapeVenueName: string;
      phone?: string;
      city?: string;
      state?: string;
    }) => request('/auth/register', { method: 'POST', body: data }),

    login: (data: { email: string; password: string }) =>
      request('/auth/login', { method: 'POST', body: data }),

    me: (token: string) => request('/auth/me', { token }),
  },

  dashboard: {
    stats: (token: string) => request('/dashboard/stats', { token }),
  },

  escapeRooms: {
    list: (token: string, params?: { page?: number; status?: string; wing?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.status) query.set('status', params.status);
      if (params?.wing) query.set('wing', params.wing);
      const qs = query.toString();
      return request(`/escape-rooms${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/escape-rooms', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/escape-rooms/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/escape-rooms/${id}`, { method: 'DELETE', token }),
  },

  gameSessions: {
    list: (token: string, params?: { page?: number; status?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.status) query.set('status', params.status);
      const qs = query.toString();
      return request(`/game-sessions${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/game-sessions', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/game-sessions/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/game-sessions/${id}`, { method: 'DELETE', token }),
  },

  puzzleMaintenance: {
    list: (token: string, params?: { status?: string; priority?: string }) => {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.priority) query.set('priority', params.priority);
      const qs = query.toString();
      return request(`/puzzle-maintenance${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/puzzle-maintenance', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/puzzle-maintenance/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/puzzle-maintenance/${id}`, { method: 'DELETE', token }),
  },

  resetChecklist: {
    list: (token: string, params?: { page?: number; status?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.status) query.set('status', params.status);
      const qs = query.toString();
      return request(`/reset-checklists${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/reset-checklists', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/reset-checklists/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/reset-checklists/${id}`, { method: 'DELETE', token }),
  },

  propOrders: {
    list: (token: string, params?: { page?: number; status?: string; propCategory?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.status) query.set('status', params.status);
      if (params?.propCategory) query.set('propCategory', params.propCategory);
      const qs = query.toString();
      return request(`/prop-orders${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/prop-orders', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/prop-orders/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/prop-orders/${id}`, { method: 'DELETE', token }),
  },

  rateTiers: {
    list: (token: string, params?: { page?: number; status?: string }) => {
      const query = new URLSearchParams();
      if (params?.page) query.set('page', String(params.page));
      if (params?.status) query.set('status', params.status);
      const qs = query.toString();
      return request(`/rate-tiers${qs ? `?${qs}` : ''}`, { token });
    },
    create: (token: string, data: Record<string, unknown>) =>
      request('/rate-tiers', { method: 'POST', body: data, token }),
    update: (token: string, id: string, data: Record<string, unknown>) =>
      request(`/rate-tiers/${id}`, { method: 'PATCH', body: data, token }),
    delete: (token: string, id: string) =>
      request(`/rate-tiers/${id}`, { method: 'DELETE', token }),
  },

  escapeVenue: {
    get: (token: string) => request('/escape-venue', { token }),
    update: (token: string, data: Record<string, unknown>) =>
      request('/escape-venue', { method: 'PATCH', body: data, token }),
  },
};

export { ApiError };
