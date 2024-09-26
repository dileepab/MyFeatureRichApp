import React, {createContext, useState, useContext, FC, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null; // Adjust 'any' to match your user data structure
  authKey: any | null; // Adjust 'any' to match your user data structure
  login: (userData: any, authKey: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [authKey, setAuthKey] = useState('');

  useEffect(() => {
  const checkAuthStatus = async () => {
    const storedAuthKey = await AsyncStorage.getItem('authKey');
    if (storedAuthKey) {
      setAuthKey(storedAuthKey);
      setIsAuthenticated(true);
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser)); // Parse JSON string back to an object
      }
    }
  };
  checkAuthStatus();
}, []);


  const login = async (userData: any, authKey: string) => {
    try {
      await AsyncStorage.setItem('authKey', authKey);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setAuthKey(authKey);
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error storing authKey:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('authKey');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error removing authKey:', error);
      // Handle the error appropriately
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, authKey, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
