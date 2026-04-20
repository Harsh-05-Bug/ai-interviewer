import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      const data = await res.json();
      if (data.success) setUser(data.user);
      else setUser(null);
    } catch { setUser(null); }
    finally { setLoading(false); }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) { setUser(data.user); return { success: true, user: data.user }; }
      return { success: false, error: data.error, needsVerification: data.needsVerification, email: data.email };
    } catch { return { success: false, error: 'Cannot connect to server.' }; }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (data.success) {
        if (data.needsVerification) return { success: true, needsVerification: true, user: data.user };
        setUser(data.user);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error };
    } catch { return { success: false, error: 'Cannot connect to server.' }; }
  };

  const googleAuth = async (credential) => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify({ credential })
      });
      const data = await res.json();
      if (data.success) { setUser(data.user); return { success: true, user: data.user }; }
      return { success: false, error: data.error };
    } catch { return { success: false, error: 'Cannot connect to server.' }; }
  };

  const logout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); } catch {}
    setUser(null);
  };

  const updateUser = (updates) => setUser(prev => ({ ...prev, ...updates }));

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, googleAuth, logout, checkAuth, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);