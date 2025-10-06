import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiClient } from '../api/client';
import type { User } from '../types';
import type { AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem('token');

      if (savedToken) {
        try {
          // Utiliser apiClient au lieu de authAPI.me()
          const response = await apiClient('/auth/me');
          const userFromAPI = response.user;

          console.log("✅ Utilisateur depuis /me :", userFromAPI);

          if (!userFromAPI || !userFromAPI.role) {
            console.warn("⚠️ Utilisateur invalide ou rôle manquant");
            logout();
            return;
          }

          setUser(userFromAPI);
          setToken(savedToken);
          localStorage.setItem('user', JSON.stringify(userFromAPI));
        } catch (error) {
          console.error('❌ Token invalide:', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const { token: access_token, user } = response;

      setToken(access_token);
      setUser(user);

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, user };
    } catch (error: any) {
      console.error('❌ Erreur de connexion:', error);
      return {
        success: false,
        message: error.message || 'Erreur de connexion'
      };
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    hasRole,
    hasAnyRole,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};