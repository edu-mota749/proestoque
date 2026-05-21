import LogoProEstoque from "@/src/components/LogoProEstoque";
import { Colors, Radius, Spacing, Typography } from "@/src/constants/theme";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

type SplashScreenProps = {
  message?: string;
};

export default function SplashScreen({ message = "Verificando sessão..." }: SplashScreenProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, [progress]);

  const fillWidth = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, trackWidth],
        extrapolate: "clamp",
      }),
    [progress, trackWidth]
  );

  return (
    <View style={styles.container}>
      <View style={styles.backgroundAccentTop} />
      <View style={styles.backgroundAccentBottom} />

      <View style={styles.card}>
        <LogoProEstoque size="lg" variant="default" />
        <Text style={styles.title}>ProEstoque</Text>
        <Text style={styles.subtitle}>Organizando seu estoque com mais controle e velocidade.</Text>

        <View style={styles.track} onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}>
          <Animated.View style={[styles.fill, { width: fillWidth }]} />
        </View>

        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing[5],
  },
  backgroundAccentTop: {
    position: "absolute",
    top: -80,
    right: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.primary[100],
    opacity: 0.75,
  },
  backgroundAccentBottom: {
    position: "absolute",
    bottom: -90,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.primary[50],
    opacity: 0.95,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: Colors.surface,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: Spacing[8],
    paddingHorizontal: Spacing[5],
    alignItems: "center",
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.08,
    shadowRadius: 28,
    elevation: 12,
  },
  title: {
    marginTop: Spacing[4],
    color: Colors.textPrimary,
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.black,
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: Spacing[1],
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.md,
    textAlign: "center",
    lineHeight: 22,
  },
  track: {
    width: "100%",
    height: 12,
    borderRadius: Radius.full,
    backgroundColor: Colors.neutral[100],
    overflow: "hidden",
    marginTop: Spacing[6],
  },
  fill: {
    height: "100%",
    borderRadius: Radius.full,
    backgroundColor: Colors.primary[600],
  },
  message: {
    marginTop: Spacing[3],
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
});
