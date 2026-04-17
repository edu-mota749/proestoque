import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { Colors, Spacing, Typography } from "@/src/constants/theme";

export default function SairScreen() {
  useEffect(() => {
    router.replace("/(auth)/login");
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Saindo...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background, padding: Spacing[5] },
  message: { fontSize: Typography.fontSize.lg, color: Colors.textPrimary, fontWeight: Typography.fontWeight.semibold },
});
