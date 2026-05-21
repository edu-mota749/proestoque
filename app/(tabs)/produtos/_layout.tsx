import { Colors } from "@/src/constants/theme";
import { Stack } from "expo-router";

export default function ProdutosLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.primary[600],
        headerTitleStyle: { fontWeight: "700" },
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Produtos" }} />
      <Stack.Screen name="novo" options={{ title: "Novo produto" }} />
      <Stack.Screen name="[id]" options={{ title: "Editar produto" }} />
    </Stack>
  );
}
