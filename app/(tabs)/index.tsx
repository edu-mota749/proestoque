import { StyleSheet, Text, View } from "react-native";
import { Colors, Spacing, Typography } from "@/src/constants/theme";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, Eduardo 👋</Text>
        <Text style={styles.subtitle}>Visão geral do seu estoque</Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsLabel}>Total em produtos</Text>
        <Text style={styles.statsValue}>247</Text>
      </View>

      <View style={styles.metricsRow}>
        <View style={[styles.metricCard, styles.metricLeft]}>
          <Text style={styles.metricLabel}>Categorias</Text>
          <Text style={styles.metricValue}>12</Text>
        </View>
        <View style={[styles.metricCard, styles.metricRight]}>
          <Text style={styles.metricLabel}>Alertas</Text>
          <Text style={[styles.metricValue, styles.alertValue]}>5</Text>
        </View>
      </View>

      <Text style={styles.footerText}>– preenchido na próxima aula –</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing[5] },
  header: { marginBottom: Spacing[5] },
  greeting: { fontSize: Typography.fontSize["2xl"], fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing[1] },
  subtitle: { fontSize: Typography.fontSize.md, color: Colors.textSecondary },
  statsCard: {
    backgroundColor: Colors.primary[600],
    borderRadius: 28,
    padding: Spacing[5],
    marginBottom: Spacing[4],
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  statsLabel: { color: Colors.white, fontSize: Typography.fontSize.sm, marginBottom: Spacing[2] },
  statsValue: { color: Colors.white, fontSize: Typography.fontSize["3xl"], fontWeight: Typography.fontWeight.black },
  metricsRow: { flexDirection: "row", gap: Spacing[3], marginBottom: Spacing[4] },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: Spacing[4],
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 6,
  },
  metricLeft: { marginRight: Spacing[1] },
  metricRight: { marginLeft: Spacing[1] },
  metricLabel: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm, marginBottom: Spacing[2] },
  metricValue: { color: Colors.textPrimary, fontSize: Typography.fontSize["2xl"], fontWeight: Typography.fontWeight.bold },
  alertValue: { color: Colors.primary[600] },
  footerText: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm, textAlign: "center" },
});
