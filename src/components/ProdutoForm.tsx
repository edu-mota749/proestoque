import Button from "@/src/components/Button";
import Input from "@/src/components/Input";
import { Colors, Radius, Spacing, Typography } from "@/src/constants/theme";
import { useProducts } from "@/src/contexts/ProductsContext";
import { CATEGORIAS_MOCK } from "@/src/data/mockData";
import { produtoSchema, UNIDADES_PRODUTO, type ProdutoFormData } from "@/src/schemas/produtoSchema";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ProdutoFormProps = {
  produtoId?: string;
};

const defaultValues: ProdutoFormData = {
  nome: "",
  categoriaId: "",
  quantidade: 0,
  quantidadeMinima: 0,
  preco: 0,
  unidade: "un",
  observacao: "",
};

export default function ProdutoForm({ produtoId }: ProdutoFormProps) {
  const modoEdicao = !!produtoId;
  const { adicionarProduto, editarProduto, deletarProduto, getProdutoById } = useProducts();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues,
    mode: "onTouched",
  });

  useEffect(() => {
    if (!produtoId) {
      reset(defaultValues);
      return;
    }

    const produto = getProdutoById(produtoId);
    if (produto) {
      reset({
        nome: produto.nome,
        categoriaId: produto.categoriaId,
        quantidade: produto.quantidade,
        quantidadeMinima: produto.quantidadeMinima,
        preco: produto.preco,
        unidade: produto.unidade,
        observacao: produto.observacao ?? "",
      });
    }
  }, [getProdutoById, produtoId, reset]);

  const categorias = useMemo(() => CATEGORIAS_MOCK, []);
  const unidadeSelecionada = watch("unidade");

  const onSubmit = async (data: ProdutoFormData) => {
    if (modoEdicao && produtoId) {
      await editarProduto(produtoId, data);
    } else {
      await adicionarProduto(data);
    }

    router.back();
  };

  const handleExcluir = () => {
    if (!produtoId) {
      return;
    }

    Alert.alert("Excluir produto", "Esta ação não pode ser desfeita. Deseja continuar?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await deletarProduto(produtoId);
          router.back();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.heroCard}>
        <Text style={styles.titulo}>{modoEdicao ? "Editar produto" : "Novo produto"}</Text>
        <Text style={styles.subtitulo}>
          {modoEdicao
            ? "Atualize as informações e salve para refletir na lista."
            : "Preencha os campos para cadastrar um novo item no estoque."}
        </Text>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionTitle}>Informações básicas</Text>

        <Controller
          control={control}
          name="nome"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label="Nome do produto *"
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.nome?.message}
              autoCapitalize="sentences"
              returnKeyType="next"
              placeholder="Ex.: Arroz branco 5kg"
            />
          )}
        />

        <Text style={styles.fieldLabel}>Categoria *</Text>
        <Controller
          control={control}
          name="categoriaId"
          render={({ field: { value, onChange } }) => (
            <View style={styles.chipsWrap}>
              {categorias.map((categoria) => (
                <TouchableOpacity
                  key={categoria.id}
                  style={[
                    styles.categoriaChip,
                    value === categoria.id && styles.categoriaChipAtivo,
                    value === categoria.id && { borderColor: categoria.cor, backgroundColor: Colors.white },
                  ]}
                  onPress={() => onChange(categoria.id)}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name={(categoria.icone as keyof typeof Ionicons.glyphMap) ?? "pricetag-outline"}
                    size={14}
                    color={value === categoria.id ? categoria.cor : Colors.textSecondary}
                  />
                  <Text style={[styles.categoriaTexto, value === categoria.id && { color: categoria.cor }]}>
                    {categoria.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
        {errors.categoriaId?.message ? <Text style={styles.errorText}>{errors.categoriaId.message}</Text> : null}

        <View style={styles.grid2}>
          <Controller
            control={control}
            name="quantidade"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Quantidade em estoque *"
                value={value === 0 ? "" : String(value)}
                onChangeText={(text) => onChange(text === "" ? 0 : Number(text))}
                onBlur={onBlur}
                error={errors.quantidade?.message}
                keyboardType="numeric"
                placeholder="0"
              />
            )}
          />

          <Controller
            control={control}
            name="quantidadeMinima"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Quantidade mínima *"
                value={value === 0 ? "" : String(value)}
                onChangeText={(text) => onChange(text === "" ? 0 : Number(text))}
                onBlur={onBlur}
                error={errors.quantidadeMinima?.message}
                keyboardType="numeric"
                placeholder="0"
              />
            )}
          />
        </View>

        <Controller
          control={control}
          name="preco"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label="Preço (R$) *"
              value={value === 0 ? "" : String(value)}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.preco?.message}
              keyboardType="decimal-pad"
              placeholder="0,00"
            />
          )}
        />

        <Text style={styles.fieldLabel}>Unidade *</Text>
        <Controller
          control={control}
          name="unidade"
          render={() => (
            <View style={styles.chipsWrap}>
              {UNIDADES_PRODUTO.map((unidade) => (
                <TouchableOpacity
                  key={unidade}
                  style={[
                    styles.chip,
                    unidadeSelecionada === unidade && styles.chipAtivo,
                    unidadeSelecionada === unidade && { borderColor: Colors.primary[600], backgroundColor: Colors.white },
                  ]}
                  onPress={() => setValue("unidade", unidade, { shouldDirty: true, shouldTouch: true, shouldValidate: true })}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.chipText, unidadeSelecionada === unidade && styles.chipTextAtivo, unidadeSelecionada === unidade && { color: Colors.primary[600] }]}>
                    {unidade}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
        {errors.unidade?.message ? <Text style={styles.errorText}>{errors.unidade.message}</Text> : null}

        <Controller
          control={control}
          name="observacao"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label="Observação"
              value={value ?? ""}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.observacao?.message}
              placeholder="Ex.: Conferir validade no próximo lote"
              returnKeyType="done"
              multiline
              numberOfLines={4}
              style={styles.textArea}
            />
          )}
        />
      </View>

      <View style={styles.actions}>
        <Button
          label={modoEdicao ? "Salvar alterações" : "Cadastrar produto"}
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          fullWidth
        />

        {modoEdicao ? <Button label="Excluir produto" onPress={handleExcluir} variant="danger" fullWidth /> : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: Spacing[5],
    paddingBottom: Spacing[10],
    gap: Spacing[4],
  },
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing[4],
  },
  titulo: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing[1],
  },
  subtitulo: {
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing[4],
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing[3],
  },
  fieldLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.neutral[700],
    marginBottom: Spacing[2],
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing[2],
    marginBottom: Spacing[3],
  },
  categoriaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1],
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.neutral[50],
  },
  categoriaChipAtivo: {
    backgroundColor: Colors.white,
  },
  categoriaTexto: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  chip: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.neutral[50],
  },
  chipAtivo: {
    backgroundColor: Colors.white,
  },
  chipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  chipTextAtivo: {
    fontWeight: Typography.fontWeight.semibold,
  },
  grid2: {
    flexDirection: "row",
    gap: Spacing[3],
  },
  textArea: {
    minHeight: 96,
    textAlignVertical: "top",
    paddingTop: Spacing[3],
  },
  actions: {
    gap: Spacing[3],
  },
  errorText: {
    marginTop: -Spacing[2],
    marginBottom: Spacing[3],
    fontSize: Typography.fontSize.sm,
    color: Colors.danger.text,
  },
});
