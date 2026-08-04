import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { apiFetch } from '../api/apiFetch';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const response = await apiFetch('/api/v1/getMe');
      const data = await response.json();
      if (response.ok && data.result === 'success') {
        setUser(data.user);
        return true;
      }
      setUser(null);
      return false;
    } catch (error) {
      console.error(error);
      setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchMe().finally(() => setChecking(false));
  }, [fetchMe]);

  const login = useCallback(async (loginValue, password) => {
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ login: loginValue, password }),
      });

      const data = await response.json();

      if (response.ok && data.result === 'success') {
        await fetchMe();
        return { ok: true };
      }

      return { ok: false, error: 'Неверный логин или пароль' };
    } catch (error) {
      console.error(error);
      return { ok: false, error: 'Не удалось подключиться к серверу' };
    }
  }, [fetchMe]);

  const logout = useCallback(async () => {
    try {
      await fetch('/auth/logout', { credentials: 'include' });
    } catch (error) {
      console.error(error);
    }
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    checking,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
