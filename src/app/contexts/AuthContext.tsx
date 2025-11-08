'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAuthLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const validateToken = async (): Promise<User | null> => {
    const token = localStorage.getItem('authToken');
    console.log('Validating token:', !!token);
    if (!token) return null;
    try {
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      console.log('Decoded token on load:', decoded);
      if (decoded.exp && decoded.exp > Date.now() / 1000) {
        const user = {
          id: decoded.user_id,
          email: decoded.username,
          name: decoded.username,
        };
        console.log('Validated user:', user);
        return user;
      } else {
        console.log('Token expired');
      }
    } catch (error) {
      console.log('Error validating token:', error);
    }
    return null;
  };

  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    const checkAuth = async () => {
      const userData = await validateToken();
      if (userData) {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
      setIsAuthLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:12020/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login response data:', data);
      const { token } = data;

      if (!token) {
        throw new Error('No token in response');
      }

      // Decode JWT to get user data
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      console.log('Decoded JWT payload:', decoded);
      const userData = {
        id: decoded.user_id,
        email: decoded.username, // Using username as email since email not in JWT
        name: decoded.username,
      };

      if (!userData.id) {
        throw new Error('Invalid user data from token');
      }

      console.log('Decoded user data:', userData);
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return true;
    } catch (err) {
      console.log('Login error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, isLoading, isAuthLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
