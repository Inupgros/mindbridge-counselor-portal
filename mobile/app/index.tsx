import { Redirect } from "expo-router";
import React from "react";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return null;

  if (isLoggedIn) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
