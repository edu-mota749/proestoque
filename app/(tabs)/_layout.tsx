import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/src/constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary[600],
        tabBarInactiveTintColor: Colors.neutral[500],
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house" color={color} />,
        }}
      />
      <Tabs.Screen
        name="produtos"
        options={{
          title: "Produtos",
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="shippingbox.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="configuracoes"
        options={{
          title: "Configurações",
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="settings" color={color} />,
        }}
      />
      <Tabs.Screen
        name="sair"
        options={{
          title: "Sair",
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="logout" color={color} />,
        }}
      />
    </Tabs>
  );
}
