import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import LogoProEstoque from "@/src/components/LogoProEstoque";
import { Colors, Typography, Spacing } from "@/src/constants/theme";

export default function RecuperarSenhaScreen() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.wrapper}>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backAction}>
              <Ionicons name="chevron-back" size={22} color={Colors.primary[600]} />
              <Text style={styles.backText}>Voltar</Text>
            </TouchableOpacity>

            <View style={styles.header}>
              <LogoProEstoque size="md" />
              <Text style={styles.title}>Recuperar senha</Text>
              <Text style={styles.description}>Informe seu e-mail e enviaremos um link de recuperação.</Text>
            </View>

            <View style={styles.card}>
              {!submitted ? (
                <>
                  <Input
                    label="E-mail"
                    leftIcon="mail-outline"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    returnKeyType="send"
                  />
                  <Button label="Enviar" onPress={() => setSubmitted(true)} fullWidth />
                </>
              ) : (
                <View style={styles.successCard}>
                  <Ionicons name="mail-open-outline" size={32} color={Colors.primary[600]} style={styles.successIcon} />
                  <Text style={styles.successTitle}>E-mail enviado!</Text>
                  <Text style={styles.successText}>Verifique sua caixa de entrada.</Text>
                </View>
              )}
            </View>

            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backButton}>
              <Text style={styles.link}>Voltar ao Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, padding: Spacing[5], justifyContent: "center" },
  wrapper: { flex: 1 },
  backAction: { flexDirection: "row", alignItems: "center", gap: Spacing[2], marginBottom: Spacing[3] },
  backText: { color: Colors.primary[600], fontSize: Typography.fontSize.md, fontWeight: Typography.fontWeight.semibold },
  header: { alignItems: "center", marginBottom: Spacing[4] },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing[4],
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  title: { fontSize: Typography.fontSize["2xl"], fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing[2] },
  description: { fontSize: Typography.fontSize.md, color: Colors.textSecondary, textAlign: "center", lineHeight: Typography.fontSize.lg * 1.4 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 32,
    padding: Spacing[5],
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },
  successCard: { alignItems: "center" },
  successIcon: { marginBottom: Spacing[4] },
  successTitle: { fontSize: Typography.fontSize.lg, fontWeight: Typography.fontWeight.semibold, color: Colors.textPrimary, marginBottom: Spacing[2] },
  successText: { fontSize: Typography.fontSize.md, color: Colors.textSecondary, textAlign: "center", lineHeight: Typography.fontSize.lg * 1.4 },
  backButton: { marginTop: Spacing[5], alignSelf: "center" },
  link: { color: Colors.primary[600], fontWeight: Typography.fontWeight.semibold, textDecorationLine: "underline" },
});
