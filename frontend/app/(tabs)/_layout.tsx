import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import {Redirect, Stack} from 'expo-router'
import { useAuth } from '@/context/authContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login"); // redirect to login if not signed in
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
    <Stack>
          <Stack.Screen name="index" options={{headerShown: false}} />
          <Stack.Screen name="legal" options={{headerShown: false}} />
    </Stack>
  );
}
