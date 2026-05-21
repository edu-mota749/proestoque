import { Colors, Radius, Spacing, Typography } from "@/src/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

type ImagePickerFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function ImagePickerField({ value, onChange }: ImagePickerFieldProps) {
  const [loading, setLoading] = useState(false);

  const solicitarPermissao = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Permita o acesso à galeria para escolher a foto.");
      return false;
    }

    return true;
  };

  const abrirGaleria = async () => {
    if (!(await solicitarPermissao())) {
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.75,
      });

      if (!result.canceled) {
        onChange(result.assets[0].uri);
      }
    } finally {
      setLoading(false);
    }
  };

  const abrirCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Permita o acesso à câmera para tirar a foto.");
      return;
    }

    setLoading(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.75,
      });

      if (!result.canceled) {
        onChange(result.assets[0].uri);
      }
    } finally {
      setLoading(false);
    }
  };

  const abrirOpcoes = () => {
    Alert.alert("Foto do produto", "Escolha a origem da imagem", [
      { text: "Câmera", onPress: abrirCamera },
      { text: "Galeria", onPress: abrirGaleria },
      value ? { text: "Remover foto", style: "destructive", onPress: () => onChange("") } : null,
      { text: "Cancelar", style: "cancel" },
    ].filter(Boolean) as never[]);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Foto do produto</Text>

      <Pressable style={styles.container} onPress={abrirOpcoes} disabled={loading}>
        {value ? (
          <Image source={{ uri: value }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera-outline" size={28} color={Colors.neutral[400]} />
            <Text style={styles.placeholderText}>{loading ? "Carregando..." : "Adicionar foto"}</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing[4],
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral[700],
    marginBottom: Spacing[2],
  },
  container: {
    width: 120,
    height: 120,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
    overflow: "hidden",
    backgroundColor: Colors.neutral[50],
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[1],
  },
  placeholderText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral[500],
    fontWeight: Typography.fontWeight.medium,
  },
});