import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

const AUTH_KEY = "mindbridge_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(AUTH_KEY).then((val) => {
      setIsLoggedIn(val === "true");
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async () => {
    await AsyncStorage.setItem(AUTH_KEY, "true");
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(AUTH_KEY);
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
