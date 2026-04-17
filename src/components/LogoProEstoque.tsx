import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Typography, Spacing, Radius } from "@/src/constants/theme";

type LogoSize = "sm" | "md" | "lg";

type LogoVariant = "default" | "onPrimary";

const SIZES = {
  sm: { icon: 26, font: Typography.fontSize.lg, gap: Spacing[3], padding: Spacing[3] },
  md: { icon: 32, font: Typography.fontSize["2xl"], gap: Spacing[4], padding: Spacing[4] },
  lg: { icon: 40, font: Typography.fontSize["3xl"], gap: Spacing[4], padding: Spacing[4] },
};

interface LogoProEstoqueProps {
  size?: LogoSize;
  variant?: LogoVariant;
}

export default function LogoProEstoque({ size = "md", variant = "default" }: LogoProEstoqueProps) {
  const current = SIZES[size];
  const isOnPrimary = variant === "onPrimary";
  const textColor = isOnPrimary ? Colors.white : Colors.primary[900];
  const highlightColor = isOnPrimary ? Colors.primary[100] : Colors.primary[700];

  return (
    <View style={[styles.container, { padding: current.padding, gap: current.gap }]}>      
      <View style={styles.iconBox}>
        <Ionicons name="cube-outline" size={current.icon} color={Colors.primary[600]} />
      </View>
      <Text style={[styles.text, { fontSize: current.font, color: textColor }]}>Pro<Text style={[styles.textHighlight, { color: highlightColor }]}>Estoque</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: Radius.xl,
    backgroundColor: Colors.primary[50],
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 6,
  },
  text: {
    fontWeight: Typography.fontWeight.black,
    color: Colors.primary[900],
  },
  textHighlight: {
    color: Colors.primary[700],
  },
});
