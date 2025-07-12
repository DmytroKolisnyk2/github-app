import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { initKeycloak, login, logout, getUsername, register } from '../services/keycloak';
import { getUserProfile } from '../services/api';
import type { User } from '../services/api';

interface AuthContextType {
  isLoading: boolean;
  isLoggedIn: boolean;
  user: User | null;
  login: () => void;
  logout: () => void;
  register: () => void;
  username: string | undefined;
}

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isLoggedIn: false,
  user: null,
  login,
  logout,
  register,
  username: undefined,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const authenticated = await initKeycloak();
        setIsLoggedIn(authenticated);

        if (authenticated) {
          try {
            const userProfile = await getUserProfile();
            setUser(userProfile);
          } catch (profileError) {
            console.error('Error getting user profile:', profileError);
          }
        }
      } catch (error) {
        console.error('Failed to initialize authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const value = {
    isLoading,
    isLoggedIn,
    user,
    login,
    logout,
    register,
    username: getUsername(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
