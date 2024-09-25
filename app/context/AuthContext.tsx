import React, {createContext, useState, useContext, FC, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null; // Adjust 'any' to match your user data structure
  login: (userData: any, authKey: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // Check for existing authKey on app load
    const checkAuthStatus = async () => {
      const storedAuthKey = await AsyncStorage.getItem('authKey');
      console.log(storedAuthKey);
      if (storedAuthKey) {
        setIsAuthenticated(true);
        const user = await AsyncStorage.getItem('user');
        if (typeof user === "string") {
          setUser(JSON.parse(user));
        }
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (userData: any, authKey: string) => {
    try {
      await AsyncStorage.setItem('authKey', authKey);
      await AsyncStorage.setItem('user', userData.toString());
      setIsAuthenticated(true);
      setUser(userData);
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
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
