import apiClient from './apiClient';

export interface User {
  _id: string;
  username: string;
  role: string;
  status: string;
  lastLogin?: Date;
  staffInfo?: any;
  memberInfo?: any;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export const authService = {

  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return apiClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body: credentials,
      requireAuth: false
    });
  },


  logout: async (): Promise<{ message: string }> => {
    const result = await apiClient<{ message: string }>('/auth/logout', {
      method: 'POST'
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    return result;
  },


  getProfile: async (): Promise<{ user: User }> => {
    return apiClient('/auth/profile');
  },

  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('token');
    return !!token;
  }
};

export default authService;
