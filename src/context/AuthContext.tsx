import { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/User';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication
      // In a real app, we would validate credentials against a backend
      
      // For demo purposes, allow any login
      // Use some predefined accounts for demonstration
      let userAccount: User;
      
      if (email.includes('admin')) {
        userAccount = {
          id: '1',
          name: 'Admin User',
          email,
          cpf: '',
          role: 'admin',
          active: true,
        };
      } else if (email.includes('dentist')) {
        userAccount = {
          id: '2',
          name: 'Dr. Example',
          email,
          cpf: '',
          role: 'dentist',
          active: true,
        };
      } else if (email.includes('aux')) {
        userAccount = {
          id: '3',
          name: 'Auxiliary Staff',
          email,
          cpf: '',
          role: 'auxiliary',
          active: true,
        };
      } else {
        userAccount = {
          id: '4',
          name: 'Reception Staff',
          email,
          cpf: '',
          role: 'reception',
          active: true,
        };
      }
      
      setUser(userAccount);
      localStorage.setItem('user', JSON.stringify(userAccount));
      
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Authentication failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};