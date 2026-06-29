import { createContext, useContext, useState, useCallback } from 'react';

const ACCOUNTS = {
  admin: { password: 'admin123', role: 'admin', name: 'Администратор', initials: 'АД' },
  user:  { password: 'user123',  role: 'user',  name: 'Пользователь',  initials: 'ПЛ' },
};

const STORAGE_KEY = 'dm_session';

const AuthContext = createContext(null);

function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession);

  const login = useCallback((loginValue, password) => {
    const acc = ACCOUNTS[loginValue?.trim().toLowerCase()];
    if (!acc || acc.password !== password) {
      return { ok: false, error: 'Неверный логин или пароль' };
    }

    const session = {
      login: loginValue.trim().toLowerCase(),
      role: acc.role,
      name: acc.name,
      initials: acc.initials,
      token: `demo.${acc.role}.${loginValue}`,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(session);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
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
