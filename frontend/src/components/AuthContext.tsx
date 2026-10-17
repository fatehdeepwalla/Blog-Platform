import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiService, UserProfile } from '../services/apiService';

interface AuthContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(Boolean(localStorage.getItem('token')));

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    apiService.logout();
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsAuthLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    const loadUser = async () => {
      if (!token) {
        if (active) { setIsAuthenticated(false); setUser(null); setIsAuthLoading(false); }
        return;
      }
      setIsAuthLoading(true);
      try {
        const profile = await apiService.getCurrentUser();
        if (active) { setUser(profile); setIsAuthenticated(true); }
      } catch {
        if (active) {
          localStorage.removeItem('token');
          apiService.logout();
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (active) setIsAuthLoading(false);
      }
    };
    void loadUser();
    return () => { active = false; };
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiService.login({ email, password });
    localStorage.setItem('token', response.token);
    setToken(response.token);
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated, isAuthLoading, user, login, logout, token }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
export default AuthContext;
