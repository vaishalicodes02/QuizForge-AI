import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { loginUser, registerUser } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("access_token")
  );
  const [loading, setLoading] = useState(true);

  // Get the currently logged-in user
  const fetchCurrentUser = async (accessToken) => {
    try {
      const response = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch current user:", error);

      // Token is invalid/expired
      localStorage.removeItem("access_token");
      setToken(null);
      setUser(null);
    }
  };

  // Restore authentication when the app loads
  useEffect(() => {
    const restoreAuth = async () => {
      const savedToken = localStorage.getItem("access_token");

      if (savedToken) {
        setToken(savedToken);
        await fetchCurrentUser(savedToken);
      }

      setLoading(false);
    };

    restoreAuth();
  }, []);

  // Login
  const login = async (credentials) => {
    const data = await loginUser(credentials);

    const accessToken = data.access_token;

    localStorage.setItem("access_token", accessToken);

    setToken(accessToken);

    await fetchCurrentUser(accessToken);

    return data;
  };

  // Register
  const register = async (userData) => {
    const data = await registerUser(userData);

    return data;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("access_token");

    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}