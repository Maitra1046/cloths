import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, LoginCredentials, SignupData } from '@/types/user';

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
};

type AuthContextType = AuthState & {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "beenas-auth";

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: 'admin-1',
    email: 'admin@beenas.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'user-1',
    email: 'user@example.com',
    name: 'Regular User',
    role: 'user',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({ isAuthenticated: false, user: null });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Clear any existing authentication state on app load
    // Users should manually log in each time they visit the website
    window.localStorage.removeItem(STORAGE_KEY);
    setState({ isAuthenticated: false, user: null });
  }, []);

  // Removed automatic localStorage persistence - users need to log in each session

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication
    const user = mockUsers.find(u => u.email === credentials.email);
    
    if (user && credentials.password === 'password') { // Simple mock password
      const next: AuthState = { isAuthenticated: true, user };
      setState(next);
      
      // Navigate based on role
      if (user.role === 'admin') {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
      
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (data: SignupData): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      setIsLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      name: data.name,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockUsers.push(newUser);
    
    const next: AuthState = { isAuthenticated: true, user: newUser };
    setState(next);
    navigate("/", { replace: true });
    
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setState({ isAuthenticated: false, user: null });
    navigate("/", { replace: true });
  };

  const isAdmin = state.user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      login, 
      signup, 
      logout, 
      isLoading, 
      isAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};


