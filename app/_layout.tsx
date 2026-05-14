import LogoProEstoque from "@/src/components/LogoProEstoque";
import { Colors } from "@/src/constants/theme";
import { AuthProvider, useAuth } from "@/src/contexts/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import "react-native-reanimated";

export const unstable_settings = {
  initialRouteName: "(auth)/login",
};

function NavigationGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const estaNoGrupoAuth = segments[0] === "(auth)";

    if (!isAuthenticated && !estaNoGrupoAuth) {
      router.replace("/(auth)/login");
      return;
    }

    if (isAuthenticated && estaNoGrupoAuth) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, router, segments]);

  if (!isLoading) {
    return null;
  }

  return (
    <View style={styles.loadingOverlay}>
      <LogoProEstoque size="md" />
      <ActivityIndicator size="large" color={Colors.primary[600]} />
      <Text style={styles.loadingText}>Verificando sessão...</Text>
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <NavigationGuard />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
