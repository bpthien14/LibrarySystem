'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import authService, { User, LoginCredentials } from '@/lib/api/authService';
import { ApiError } from '@/lib/api/apiClient';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const refreshUser = async () => {
    if (!authService.isAuthenticated()) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { user } = await authService.getProfile();
      setUser(user);
      setError(null);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin người dùng:', error);
      if (error instanceof ApiError && error.status === 401) {
        localStorage.removeItem('token');
        setUser(null);
      }
      setError('Không thể lấy thông tin người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setError(null);
      toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn đến với hệ thống quản lý thư viện",
      });
      router.push('/');
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      if (error instanceof ApiError) {
        setError(error.message);
        toast({
          title: "Đăng nhập thất bại",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setError('Đã xảy ra lỗi khi đăng nhập');
        toast({
          title: "Đăng nhập thất bại",
          description: "Đã xảy ra lỗi khi đăng nhập",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.push('/login');
      toast({
        title: "Đăng xuất thành công",
        description: "Bạn đã đăng xuất khỏi hệ thống",
      });
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
      localStorage.removeItem('token');
      setUser(null);
      router.push('/login');
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
