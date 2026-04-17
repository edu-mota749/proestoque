import { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Input from "@/src/components/Input";
import Button from "@/src/components/Button";
import LogoProEstoque from "@/src/components/LogoProEstoque";
import { Colors, Spacing, Typography } from "@/src/constants/theme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <View style={styles.header}>
              <LogoProEstoque size="lg" variant="onPrimary" />
              <Text style={styles.headerText}>Bem-vindo de volta</Text>
            </View>

            <View style={styles.card}>
              <Input
                label="E-mail"
                leftIcon="mail-outline"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="next"
              />

              <Input
                label="Senha"
                leftIcon="lock-closed-outline"
                value={password}
                onChangeText={setPassword}
                isPassword
                autoCapitalize="none"
                autoComplete="password"
                returnKeyType="done"
                onSubmitEditing={() => router.replace("/(tabs)")}
              />

              <TouchableOpacity onPress={() => router.push("/(auth)/recuperar-senha")} activeOpacity={0.7} style={styles.forgotButton}>
                <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
              </TouchableOpacity>

              <Button label="Entrar" onPress={() => router.replace("/(tabs)")} fullWidth />

              <View style={styles.bottomRow}>
                <Text style={styles.caption}>Não tem conta?</Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/cadastro")} activeOpacity={0.7}>
                  <Text style={styles.link}>Cadastrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.primary[600] },
  flex: { flex: 1 },
  container: { flex: 1, padding: Spacing[5], justifyContent: "flex-end" },
  header: { alignItems: "center", marginBottom: Spacing[4] },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 24,
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
  brand: {
    fontSize: Typography.fontSize["3xl"],
    fontWeight: Typography.fontWeight.black,
    color: Colors.white,
    marginBottom: Spacing[2],
  },
  headerText: {
    fontSize: Typography.fontSize.md,
    color: Colors.white,
    opacity: 0.85,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 40,
    padding: Spacing[5],
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
  forgotButton: { alignSelf: "flex-end", marginBottom: Spacing[4] },
  forgotPassword: {
    color: Colors.primary[600],
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.sm,
  },
  bottomRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: Spacing[2], marginTop: Spacing[4] },
  caption: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm },
  link: { color: Colors.primary[600], fontWeight: Typography.fontWeight.semibold, textDecorationLine: "underline" },
});
