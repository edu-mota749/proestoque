import { Colors, Spacing, Typography } from "@/src/constants/theme";
import {
  CATEGORIAS_MOCK,
  PRODUTOS_MOCK,
  formatarPreco,
  getProdutosComEstoqueBaixo,
  getValorTotalEstoque,
  type Produto,
} from "@/src/data/mockData";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type CardResumo = {
  id: string;
  titulo: string;
  valor: string | number;
  icone: keyof typeof Ionicons.glyphMap;
  corIcone: string;
};

type StatusProduto = {
  label: "Normal" | "Baixo" | "Sem estoque";
  backgroundColor: string;
  textColor: string;
  borderColor: string;
};

function getStatusProduto(produto: Produto): StatusProduto {
  if (produto.quantidade === 0) {
    return {
      label: "Sem estoque",
      backgroundColor: Colors.danger.bg,
      textColor: Colors.danger.text,
      borderColor: Colors.danger.border,
    };
  }

  if (produto.quantidade < produto.quantidadeMinima) {
    return {
      label: "Baixo",
      backgroundColor: Colors.warning.bg,
      textColor: Colors.warning.text,
      borderColor: Colors.warning.border,
    };
  }

  return {
    label: "Normal",
    backgroundColor: Colors.success.bg,
    textColor: Colors.success.text,
    borderColor: Colors.success.border,
  };
}

function formatarDataHoje() {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const alertas = useMemo(() => getProdutosComEstoqueBaixo(), []);
  const valorTotal = useMemo(() => getValorTotalEstoque(), []);

  const produtosRecentes = useMemo(() => {
    return [...PRODUTOS_MOCK].sort(
      (a, b) => new Date(b.ultimaMovimentacao).getTime() - new Date(a.ultimaMovimentacao).getTime()
    );
  }, []);

  const cardsResumo: CardResumo[] = useMemo(
    () => [
      {
        id: "total",
        titulo: "Total",
        valor: PRODUTOS_MOCK.length,
        icone: "cube-outline",
        corIcone: Colors.primary[600],
      },
      {
        id: "alertas",
        titulo: "Alertas",
        valor: alertas.length,
        icone: "alert-circle-outline",
        corIcone: alertas.length > 0 ? Colors.danger.text : Colors.success.text,
      },
      {
        id: "categorias",
        titulo: "Categorias",
        valor: CATEGORIAS_MOCK.length,
        icone: "grid-outline",
        corIcone: Colors.info.text,
      },
      {
        id: "valor",
        titulo: "Valor",
        valor: formatarPreco(valorTotal),
        icone: "cash-outline",
        corIcone: Colors.success.text,
      },
    ],
    [alertas.length, valorTotal]
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1200);
  }, []);

  const DashboardHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.headerCard}>
        <View style={styles.greetingRow}>
          <Text style={styles.greeting}>Olá, Eduardo</Text>
        </View>

        <Text style={styles.subtitle}>Visão geral do estoque</Text>
        <Text style={styles.headerDate}>{formatarDataHoje()}</Text>
      </View>

      <View style={styles.cardsGrid}>
        {cardsResumo.map((card) => (
          <View key={card.id} style={styles.cardResumo}>
            <View style={styles.cardTopRow}>
              <Ionicons name={card.icone} size={18} color={card.corIcone} />
              <Text style={styles.cardDash}>-</Text>
              <Text style={styles.cardTitulo}>{card.titulo}</Text>
            </View>
            <Text style={styles.cardValor}>{card.valor}</Text>
          </View>
        ))}
      </View>

      {alertas.length > 0 && (
        <View style={styles.alertaBox}>
          <Text style={styles.alertaTitulo}>Estoque crítico ({alertas.length})</Text>
          {alertas.slice(0, 3).map((produto) => (
            <View key={produto.id} style={styles.alertaLinha}>
              <Text style={styles.alertaNome}>{produto.nome}</Text>
              <Text style={styles.alertaQtd}>
                {produto.quantidade}/{produto.quantidadeMinima} {produto.unidade}
              </Text>
            </View>
          ))}

          <TouchableOpacity style={styles.alertaAcao} onPress={() => router.push("/(tabs)/produtos")} activeOpacity={0.8}>
            <Text style={styles.alertaAcaoTexto}>Ver todos</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.danger.text} />
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.sectionTitle}>Produtos recentes</Text>
    </View>
  );

  const renderProduto = ({ item }: { item: Produto }) => {
    const categoria = CATEGORIAS_MOCK.find((cat) => cat.id === item.categoriaId);
    const status = getStatusProduto(item);

    return (
      <View style={styles.produtoCard}>
        <View style={styles.produtoMainInfo}>
          <Ionicons
            name={(categoria?.icone as keyof typeof Ionicons.glyphMap) ?? "cube-outline"}
            size={18}
            color={categoria?.cor ?? Colors.primary[600]}
          />
          <View style={styles.produtoTextos}>
            <Text style={styles.produtoNome}>{item.nome}</Text>
            <Text style={styles.produtoMeta}>
              {item.quantidade} {item.unidade} • Mín {item.quantidadeMinima}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: status.backgroundColor,
              borderColor: status.borderColor,
            },
          ]}
        >
          <Text style={[styles.statusBadgeText, { color: status.textColor }]}>{status.label}</Text>
        </View>
      </View>
    );
  };

  return (
    <FlatList<Produto>
      data={produtosRecentes}
      keyExtractor={(item) => item.id}
      renderItem={renderProduto}
      ListHeaderComponent={DashboardHeader}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary[600]} />}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[8],
    backgroundColor: Colors.background,
  },
  headerContent: {
    marginBottom: Spacing[4],
  },
  headerCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 22,
    padding: Spacing[4],
    alignItems: "center",
    marginBottom: Spacing[4],
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 5,
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: {
    fontSize: Typography.fontSize["3xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    lineHeight: 42,
    textAlign: "center",
  },
  greetingEmoji: {
    marginLeft: Spacing[2],
    fontSize: Typography.fontSize["2xl"],
  },
  subtitle: {
    marginTop: Spacing[1],
    marginBottom: Spacing[2],
    fontSize: Typography.fontSize.md,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  headerDate: {
    fontSize: Typography.fontSize.sm,
    color: Colors.neutral[500],
    textAlign: "center",
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -Spacing[1],
  },
  cardResumo: {
    width: "50%",
    marginBottom: Spacing[2],
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[3],
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing[2],
  },
  cardDash: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.base,
    marginHorizontal: Spacing[1],
  },
  cardTitulo: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    flexShrink: 1,
  },
  cardValor: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  alertaBox: {
    borderWidth: 1,
    borderColor: Colors.danger.border,
    backgroundColor: Colors.danger.bg,
    borderRadius: 20,
    padding: Spacing[4],
    marginTop: Spacing[2],
    marginBottom: Spacing[4],
  },
  alertaTitulo: {
    color: Colors.danger.text,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing[2],
  },
  alertaLinha: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing[1],
  },
  alertaNome: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.base,
    flex: 1,
    marginRight: Spacing[2],
  },
  alertaQtd: {
    color: Colors.danger.text,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  alertaAcao: {
    marginTop: Spacing[2],
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
  },
  alertaAcaoTexto: {
    color: Colors.danger.text,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    marginRight: Spacing[1],
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing[3],
  },
  produtoCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 18,
    padding: Spacing[4],
    marginBottom: Spacing[3],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  produtoMainInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: Spacing[2],
  },
  produtoTextos: {
    marginLeft: Spacing[2],
    flex: 1,
  },
  produtoNome: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing[1],
  },
  produtoMeta: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
  },
  statusBadgeText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
});
