import { Colors, Spacing, Typography } from "@/src/constants/theme";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type LoadingViewProps = {
  mensagem?: string;
};

export function LoadingView({ mensagem = "Carregando..." }: LoadingViewProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary[600]} />
      <Text style={styles.texto}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[3],
    padding: Spacing[5],
  },
  texto: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.md,
    textAlign: "center",
  },
});