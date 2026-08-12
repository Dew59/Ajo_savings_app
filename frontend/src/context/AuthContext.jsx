import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authApi } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await authApi.getMe();
      setUser(data.data.user);
      return data.data.user;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    fetchUser().finally(() => setLoading(false));
  }, [fetchUser]);

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials);
    setUser(data.data.user);
    return data.data.user;
  };

  const register = async (payload) => {
    const { data } = await authApi.register(payload);
    setUser(data.data.user);
    return data.data.user;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      fetchUser,
      setUser,
    }),
    [user, loading, fetchUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
