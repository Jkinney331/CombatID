import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  email: string;
  phone?: string;
  combatId?: string;
  name?: string;
  role: 'fighter' | 'gym' | 'promotion' | 'commission' | 'admin';
  verificationStatus: 'pending' | 'verified' | 'rejected';
  profileComplete: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, phone: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
}

const TOKEN_KEY = 'combatid_auth_token';
const USER_KEY = 'combatid_user';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/auth/login', { email, password });

      // Mock successful login
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: '1',
        email,
        combatId: 'DOEJ123456',
        name: 'John Doe',
        role: 'fighter',
        verificationStatus: 'verified',
        profileComplete: true,
      };

      const mockToken = 'mock_jwt_token_' + Date.now();

      // Store in secure storage
      await SecureStore.setItemAsync(TOKEN_KEY, mockToken);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(mockUser));

      set({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (email: string, password: string, phone: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/auth/register', { email, password, phone });

      // Mock successful registration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: '1',
        email,
        phone,
        role: 'fighter',
        verificationStatus: 'pending',
        profileComplete: false,
      };

      const mockToken = 'mock_jwt_token_' + Date.now();

      // Store in secure storage
      await SecureStore.setItemAsync(TOKEN_KEY, mockToken);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(mockUser));

      set({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Registration failed',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      // Clear secure storage
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userJson = await SecureStore.getItemAsync(USER_KEY);

      if (token && userJson) {
        const user = JSON.parse(userJson) as User;

        // TODO: Validate token with backend
        // const response = await api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } });

        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  updateUser: (updates: Partial<User>) => {
    const { user } = get();
    if (user) {
      const updatedUser = { ...user, ...updates };
      set({ user: updatedUser });
      // Also update secure storage
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser));
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
