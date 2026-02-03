// Authentication Context - Using Node.js Backend
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI } from '../services/api';

interface User {
  id: number;
  email: string;
  displayName: string;
  monthlyGoal: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: { displayName?: string; monthlyGoal?: number }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userData = await authAPI.getMe();
            setUser(userData);
          } catch (error) {
            // Token expired or invalid or server not available
            console.log('Auth check failed:', error);
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        // Always set loading to false
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Register new user
  async function register(email: string, password: string, displayName: string) {
    const { user: userData } = await authAPI.register(email, password, displayName);
    setUser(userData);
  }

  // Login existing user
  async function login(email: string, password: string) {
    const { user: userData } = await authAPI.login(email, password);
    setUser(userData);
  }

  // Logout
  function logout() {
    authAPI.logout();
    setUser(null);
  }

  // Update user profile
  async function updateUserProfile(data: { displayName?: string; monthlyGoal?: number }) {
    if (!user) return;
    
    const updatedUser = await authAPI.updateProfile(
      data.displayName || user.displayName,
      data.monthlyGoal || user.monthlyGoal
    );
    setUser(updatedUser);
  }

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateUserProfile,
  };

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
