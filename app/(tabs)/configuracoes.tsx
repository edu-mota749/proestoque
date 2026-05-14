import Button from "@/src/components/Button";
import { Colors, Spacing, Typography } from "@/src/constants/theme";
import { useAuth } from "@/src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function ConfiguracoesScreen() {
  const { user, logout } = useAuth();
  const inicialNome = user?.nome?.trim()?.charAt(0)?.toUpperCase() || "U";

  const handleLogout = () => {
    Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error("Erro ao fazer logout:", error);
            Alert.alert("Erro", "Falha ao sair da conta. Tente novamente.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.greeting}>Configurações</Text>
        <Text style={styles.subtitle}>Gerencie seus dados e preferências da conta.</Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{inicialNome}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.nome}>{user?.nome || "Usuário"}</Text>
            <Text style={styles.email}>{user?.email || "email@exemplo.com"}</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Pressable style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="notifications-outline" size={20} color={Colors.primary[600]} />
              <Text style={styles.menuLabel}>Notificações</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.neutral[400]} />
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="help-circle-outline" size={20} color={Colors.primary[600]} />
              <Text style={styles.menuLabel}>Ajuda e suporte</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.neutral[400]} />
          </Pressable>
        </View>

        <View style={styles.logoutArea}>
          <Button label="Sair da conta" onPress={handleLogout} variant="danger" fullWidth />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing[5] },
  greeting: { fontSize: Typography.fontSize["2xl"], fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing[2] },
  subtitle: { fontSize: Typography.fontSize.md, color: Colors.textSecondary, marginBottom: Spacing[4] },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing[4],
    gap: Spacing[3],
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary[600],
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: Colors.white,
    fontWeight: Typography.fontWeight.bold,
    fontSize: Typography.fontSize.lg,
  },
  profileInfo: {
    flex: 1,
  },
  nome: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing[1],
  },
  email: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
  },
  menuSection: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },
  menuLabel: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.medium,
  },
  logoutArea: {
    marginTop: "auto",
    paddingTop: Spacing[6],
  },
});
