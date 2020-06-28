import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface User {
  id: string;
  name: string;
  avatar_url: string;
}
interface AuthState {
  token: string;
  user: User;
}
interface SignCredentials {
  email: string;
  password: string;
}
interface AuthContextData {
  signOut(): void;
  signIn(credentials: SignCredentials): Promise<void>;
  user: User;
}
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Gobarber:token');
    const user = localStorage.getItem('@Gobarber:user');

    if (token && user) {
      return { token, user: JSON.parse(user) };
    }
    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('sessions', { email, password });
    const { token, user } = response.data;
    setData({ token, user });
    localStorage.setItem('@Gobarber:token', token);
    localStorage.setItem('@Gobarber:user', JSON.stringify(user));
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@Gobarber:token');
    localStorage.removeItem('@Gobarber:user');
    setData({} as AuthState);
  }, []);
  return (
    <AuthContext.Provider value={{ user: data.user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}
