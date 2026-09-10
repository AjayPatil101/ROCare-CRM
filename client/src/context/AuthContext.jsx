import { createContext, useState, useEffect, useCallback } from "react";
import { authService } from "../services/authService.js";

export const AuthContext = createContext(null);

/**
 * Holds the logged-in user + token, persists them to localStorage, and
 * exposes login/register/logout so any component can call useAuth().
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    // Validate the stored token against the API on first load
    authService
      .getMe()
      .then((res) => setUser(res.data.data))
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const persistSession = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  const login = useCallback(async (email, password) => {
    const res = await authService.login(email, password);
    persistSession(res.data.data);
    return res.data.data;
  }, []);

  const register = useCallback(async (payload) => {
    const res = await authService.register(payload);
    persistSession(res.data.data);
    return res.data.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
