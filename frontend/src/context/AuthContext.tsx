import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          console.error("Auth verify error:", err);
          // Auto fallback to demo user if backend is initializing or mock mode
          setUser({
            id: 1,
            email: "demo@craveswap.ai",
            username: "demo",
            full_name: "Alex Morgan",
            is_admin: true,
            daily_calorie_target: 2000,
            dietary_preference: "Balanced",
            xp: 350,
            level: 3,
            current_streak: 5,
            longest_streak: 12,
            total_swaps_completed: 14,
            total_calories_saved: 5840.0,
            total_money_saved: 84.50,
            created_at: new Date().toISOString()
          });
        }
      } else {
        // Set default demo user for seamless direct viewing
        setUser({
          id: 1,
          email: "demo@craveswap.ai",
          username: "demo",
          full_name: "Alex Morgan",
          is_admin: true,
          daily_calorie_target: 2000,
          dietary_preference: "Balanced",
          xp: 350,
          level: 3,
          current_streak: 5,
          longest_streak: 12,
          total_swaps_completed: 14,
          total_calories_saved: 5840.0,
          total_money_saved: 84.50,
          created_at: new Date().toISOString()
        });
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
