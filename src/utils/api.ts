import { SystemUser, CheckIn, UserRole } from '@/types/user';

const API_BASE_URL = '/api';

// Tipos para respostas da API
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Utilitário para fazer requisições
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: 'Erro de conexão com o servidor'
    };
  }
}

// API de Usuários
export const usersApi = {
  // Listar todos os usuários
  getAll: (): Promise<ApiResponse<SystemUser[]>> => {
    return apiRequest<SystemUser[]>('/users');
  },

  // Buscar usuário por ID
  getById: (id: string): Promise<ApiResponse<SystemUser>> => {
    return apiRequest<SystemUser>(`/users/${id}`);
  },

  // Criar novo usuário
  create: (userData: Omit<SystemUser, 'id'>): Promise<ApiResponse<SystemUser>> => {
    return apiRequest<SystemUser>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Atualizar usuário
  update: (id: string, userData: Partial<SystemUser>): Promise<ApiResponse<SystemUser>> => {
    return apiRequest<SystemUser>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Deletar usuário
  delete: (id: string): Promise<ApiResponse<SystemUser>> => {
    return apiRequest<SystemUser>(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// API de Autenticação
export const authApi = {
  // Login
  login: (email: string, password: string, role: UserRole): Promise<ApiResponse<SystemUser>> => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  },
};

// API de Check-ins
export const checkInsApi = {
  // Listar check-ins (com filtros opcionais)
  getAll: (filters?: { status?: string; studentId?: string }): Promise<ApiResponse<CheckIn[]>> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.studentId) params.append('studentId', filters.studentId);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/checkins?${queryString}` : '/checkins';
    
    return apiRequest<CheckIn[]>(endpoint);
  },

  // Buscar check-in por ID
  getById: (id: string): Promise<ApiResponse<CheckIn>> => {
    return apiRequest<CheckIn>(`/checkins/${id}`);
  },

  // Criar novo check-in
  create: (checkInData: { studentId: string; studentName: string }): Promise<ApiResponse<CheckIn>> => {
    return apiRequest<CheckIn>('/checkins', {
      method: 'POST',
      body: JSON.stringify(checkInData),
    });
  },

  // Aprovar check-in
  approve: (checkInId: string, notes?: string, approvedBy?: string): Promise<ApiResponse<CheckIn>> => {
    return apiRequest<CheckIn>('/checkins/approve', {
      method: 'POST',
      body: JSON.stringify({ checkInId, notes, approvedBy }),
    });
  },

  // Rejeitar check-in
  reject: (checkInId: string, notes?: string, approvedBy?: string): Promise<ApiResponse<CheckIn>> => {
    return apiRequest<CheckIn>('/checkins/reject', {
      method: 'POST',
      body: JSON.stringify({ checkInId, notes, approvedBy }),
    });
  },

  // Atualizar status do check-in (método genérico)
  updateStatus: (
    id: string, 
    status: 'approved' | 'rejected', 
    notes?: string, 
    approvedBy?: string
  ): Promise<ApiResponse<CheckIn>> => {
    return apiRequest<CheckIn>(`/checkins/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes, approvedBy }),
    });
  },

  // Deletar check-in
  delete: (id: string): Promise<ApiResponse<CheckIn>> => {
    return apiRequest<CheckIn>(`/checkins/${id}`, {
      method: 'DELETE',
    });
  },
};

// Utilitários de validação
export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  required: (value: unknown): boolean => {
    return value !== null && value !== undefined && value !== '';
  },

  role: (role: string): role is UserRole => {
    return ['student', 'teacher', 'admin'].includes(role);
  },
};

const api = {
  users: usersApi,
  auth: authApi,
  checkIns: checkInsApi,
  validators,
};

export default api;