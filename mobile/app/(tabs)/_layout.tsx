import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useColors } from "@/hooks/useColors";

export default function TabLayout() {
  const colors = useColors();
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: isWeb ? 84 : 60,
          paddingBottom: isWeb ? 20 : 8,
          paddingTop: 8,
          elevation: 0,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: "Inter_500Medium",
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <Feather name="home" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="students"
        options={{
          title: "Students",
          tabBarIcon: ({ color }) => <Feather name="users" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="appointments"
        options={{
          title: "Appointments",
          tabBarIcon: ({ color }) => <Feather name="calendar" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="schools"
        options={{
          title: "Schools",
          tabBarIcon: ({ color }) => <Feather name="book-open" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="revenue"
        options={{
          title: "Revenue",
          tabBarIcon: ({ color }) => <Feather name="trending-up" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
