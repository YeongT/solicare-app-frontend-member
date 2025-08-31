import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCookie, setCookie, deleteCookie } from '../utils/cookies';
import { isTokenExpired } from '../utils/jwt';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  token: string | null;
  userName: string | null;
  login: (token: string, name: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(getCookie('jwt'));
  const [userName, setUserName] = useState<string | null>(getCookie('name'));



  const login = (newToken: string, name: string) => {
    setToken(newToken);
    setUserName(name);
    setCookie('jwt', newToken, 1); // 하루 유효
    setCookie('name', name, 1); // localStorage.setItem('name', name);
  };

  const logout = () => {
    setToken(null);
    setUserName(null);
    deleteCookie('jwt');
    deleteCookie('name'); // localStorage.removeItem('name');
    navigate('/login'); //window.location.href = '/login';
  };
  useEffect(() => {
    if (token && isTokenExpired(token)) {
      logout();
    }
  }, [logout, token]);
  return (
    <AuthContext.Provider
      value={{
        token,
        userName,
        login,
        logout,
        isAuthenticated: !!token && !isTokenExpired(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
