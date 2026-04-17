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
import { router } from "expo-router";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import LogoProEstoque from "@/src/components/LogoProEstoque";
import { Colors, Typography, Spacing } from "@/src/constants/theme";

type FormFields = {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
};

export default function CadastroScreen() {
  const [form, setForm] = useState<FormFields>({ nome: "", email: "", senha: "", confirmarSenha: "" });
  const [errors, setErrors] = useState<Partial<FormFields>>({});
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof FormFields, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = () => {
    const nextErrors: Partial<FormFields> = {};

    if (!form.nome.trim()) nextErrors.nome = "Nome é obrigatório";
    if (!form.email.includes("@") || !form.email.includes(".")) nextErrors.email = "Informe um e-mail válido";
    if (form.senha.length < 6) nextErrors.senha = "A senha deve ter pelo menos 6 caracteres";
    if (form.senha !== form.confirmarSenha) nextErrors.confirmarSenha = "As senhas não coincidem";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCreateAccount = () => {
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <LogoProEstoque size="lg" />
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.description}>Preencha seus dados para começar a usar o ProEstoque.</Text>
          </View>

          <View style={styles.card}>
            <Input
              label="Nome completo"
              value={form.nome}
              onChangeText={(value) => updateField("nome", value)}
              error={errors.nome}
              autoCapitalize="words"
              returnKeyType="next"
            />
            <Input
              label="E-mail"
              value={form.email}
              onChangeText={(value) => updateField("email", value)}
              error={errors.email}
              leftIcon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
            <Input
              label="Senha"
              value={form.senha}
              onChangeText={(value) => updateField("senha", value)}
              error={errors.senha}
              leftIcon="lock-closed-outline"
              isPassword
              returnKeyType="next"
            />
            <Input
              label="Confirmar senha"
              value={form.confirmarSenha}
              onChangeText={(value) => updateField("confirmarSenha", value)}
              error={errors.confirmarSenha}
              leftIcon="lock-closed-outline"
              isPassword
              returnKeyType="done"
              onSubmitEditing={handleCreateAccount}
            />
            <Button label="Criar Conta" onPress={handleCreateAccount} loading={loading} fullWidth />
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.caption}>Já tem conta?</Text>
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
              <Text style={styles.link}>Já tenho conta</Text>
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
  header: { alignItems: "center", marginBottom: Spacing[5] },
  iconWrapper: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing[4],
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 10,
  },
  title: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
  },
  description: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: Typography.fontSize.lg * 1.4,
  },
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
  bottomRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: Spacing[2], marginTop: Spacing[5] },
  caption: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm },
  link: { color: Colors.primary[600], fontWeight: Typography.fontWeight.semibold, textDecorationLine: "underline" },
});
