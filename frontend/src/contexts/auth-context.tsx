"use client";

import * as React from "react";
import { useLoginMutation } from "@/redux/services/authApi";
import type { LoginRequest, User } from "../../types/user";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const [loginMutation] = useLoginMutation();

  // Initialize auth state from backend (optional)
  React.useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
          credentials: "include", // send httpOnly cookie
        });
        if (res.ok) {
          const data: User = await res.json();
          setUser({ ...data, role: data.role.toLowerCase() });
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await loginMutation(credentials).unwrap();

      // The token is set in httpOnly cookie by backend
      // Only store user in state
      const normalizedUser = {
        ...response.user,
        role: response.user.role.toLowerCase(),
      };
      setUser(normalizedUser);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
