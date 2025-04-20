import { createContext, useState, useEffect, ReactNode, useContext } from 'react';

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  university: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  register: (userData: RegisterData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  university: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  register: async () => {},
  login: async () => {},
  logout: () => {},
  clearError: () => {},
});

// Provider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user data when component mounts or token changes
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        setLoading(true);
        try {
          const res = await fetch('http://localhost:3001/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Token is invalid
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            setError('Session expired. Please log in again.');
          }
        } catch (err) {
          console.error('Error loading user:', err);
          setError('Could not connect to server');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (userData: RegisterData) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Register error:', err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        setIsAuthenticated(true);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext); 