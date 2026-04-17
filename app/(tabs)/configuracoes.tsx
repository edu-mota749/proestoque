import { StyleSheet, Text, View } from "react-native";
import { Colors, Spacing, Typography } from "@/src/constants/theme";

export default function ConfiguracoesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Configurações</Text>
      <Text style={styles.subtitle}>Em breve você poderá ajustar preferências e avisos.</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Acesso rápido</Text>
        <Text style={styles.cardDescription}>Configurações serão adicionadas na próxima etapa do projeto.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing[5] },
  greeting: { fontSize: Typography.fontSize["2xl"], fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing[2] },
  subtitle: { fontSize: Typography.fontSize.md, color: Colors.textSecondary, marginBottom: Spacing[4] },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Spacing[4],
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 6,
  },
  cardTitle: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing[2] },
  cardDescription: { fontSize: Typography.fontSize.md, color: Colors.textSecondary, lineHeight: Typography.fontSize.lg * 1.4 },
});
