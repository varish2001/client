import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      const { data } = await api.get("/users/me");
      setUser(data);
    } catch {
      localStorage.removeItem("fit_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("fit_token")) fetchMe();
    else setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/users/login", { email, password });
    if (data.token) localStorage.setItem("fit_token", data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/users/register", { name, email, password });
    if (data.token) localStorage.setItem("fit_token", data.token);
    setUser(data.user);
    return data;
  };

  const completeOnboarding = ({ token, user: nextUser }) => {
    if (token) localStorage.setItem("fit_token", token);
    setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem("fit_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        completeOnboarding,
        logout,
        refreshUser: fetchMe
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
