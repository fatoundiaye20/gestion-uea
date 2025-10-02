import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authAPI } from '../services/api';
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
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));

      try {
        const response = await authAPI.me();

        // ✅ Correction ici : lire directement response.data
        const userFromAPI = response.data.user || response.data;

        console.log("Utilisateur depuis /me :", userFromAPI);

        if (!userFromAPI || !userFromAPI.role) {
          console.warn("Utilisateur invalide ou rôle manquant :", userFromAPI);
          logout();
          return;
        }

        setUser(userFromAPI);
        localStorage.setItem('user', JSON.stringify(userFromAPI));
      } catch (error) {
        console.error('Token invalide:', error);
        logout();
      }
    }
    setLoading(false);
  };

  loadUser();
}, []);


  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { access_token, user } = response.data;

      setToken(access_token);
      setUser(user);

      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, user };
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur de connexion'
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
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
