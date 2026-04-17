import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TextInputProps, View, Text, Pressable } from "react-native";
import { Colors, Typography, Spacing, Radius } from "@/src/constants/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ComponentProps<typeof Ionicons>["name"];
  isPassword?: boolean;
}

export default function Input({
  label,
  error,
  hint,
  leftIcon,
  isPassword = false,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const hasError = !!error;

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={[styles.inputContainer, focused && styles.focused, hasError && styles.errorBorder]}>
        {leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={18}
            color={focused ? Colors.primary[600] : Colors.neutral[400]}
            style={styles.leftIcon}
          />
        ) : null}

        <TextInput
          style={styles.input}
          placeholderTextColor={Colors.neutral[400]}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />

        {isPassword ? (
          <Pressable onPress={() => setShowPassword((value) => !value)} style={styles.rightIcon} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={18}
              color={Colors.neutral[400]}
            />
          </Pressable>
        ) : null}
      </View>

      {hasError ? <Text style={styles.errorText}>{error}</Text> : hint ? <Text style={styles.hintText}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: Spacing[4] },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral[700],
    marginBottom: Spacing[1],
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing[3],
  },
  focused: { borderColor: Colors.primary[600] },
  errorBorder: { borderColor: Colors.danger.border },
  input: {
    flex: 1,
    paddingVertical: Spacing[3],
    fontSize: Typography.fontSize.md,
    color: Colors.textPrimary,
  },
  leftIcon: { marginRight: Spacing[2] },
  rightIcon: { padding: Spacing[1] },
  errorText: {
    marginTop: Spacing[1],
    fontSize: Typography.fontSize.sm,
    color: Colors.danger.text,
  },
  hintText: {
    marginTop: Spacing[1],
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
  },
});
