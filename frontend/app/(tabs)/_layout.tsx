import React, { useEffect } from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";

import { useAuth } from "@/context/authContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FinanceProvider } from "../../context/FinanceContext"; // ✅ adjust path

import { Colors } from "@/constants/Colors";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    // ✅ wrap your navigation tree in FinanceProvider
    <FinanceProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="legal" options={{ headerShown: false }} />
        <Stack.Screen name="finance" options={{ headerShown: false }} />
      </Stack>
    </FinanceProvider>
  );
}
