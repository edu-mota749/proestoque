import { Colors, Spacing, Typography } from "@/src/constants/theme";
import { CATEGORIAS_MOCK, PRODUTOS_MOCK, type Produto } from "@/src/data/mockData";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { FlatList, ScrollView, SectionList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type ModoVisualizacao = "simples" | "agrupado";
type LayoutLista = "lista" | "grade";

type SecaoProdutos = {
  title: string;
  categoriaId: string;
  icone: string;
  cor: string;
  data: Produto[];
};

function getNomeCategoria(categoria: { id: string; nome: string }) {
  if (categoria.id === "cat_4") return "Eletrônicos";
  return categoria.nome;
}

export default function ProdutosScreen() {
  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string | null>(null);
  const [modoVisualizacao, setModoVisualizacao] = useState<ModoVisualizacao>("simples");
  const [layoutLista, setLayoutLista] = useState<LayoutLista>("lista");

  const categoriasFiltro = useMemo(
    () => [
      { id: "todas", nome: "Todas", icone: "apps-outline", cor: Colors.primary[600] },
      ...CATEGORIAS_MOCK.map((categoria) => ({ ...categoria, nome: getNomeCategoria(categoria) })),
    ],
    []
  );

  const produtosFiltrados = useMemo(() => {
    return PRODUTOS_MOCK.filter((produto) => {
      const bateBusca = produto.nome.toLowerCase().includes(busca.toLowerCase().trim());
      const bateCategoria = categoriaAtiva ? produto.categoriaId === categoriaAtiva : true;
      return bateBusca && bateCategoria;
    }).sort(
      (a, b) =>
        new Date(b.ultimaMovimentacao).getTime() -
        new Date(a.ultimaMovimentacao).getTime()
    );
  }, [busca, categoriaAtiva]);

  const secoesAgrupadas = useMemo(() => {
    return CATEGORIAS_MOCK.map((categoria) => ({
      title: getNomeCategoria(categoria),
      categoriaId: categoria.id,
      icone: categoria.icone,
      cor: categoria.cor,
      data: produtosFiltrados.filter((produto) => produto.categoriaId === categoria.id),
    })).filter((secao) => secao.data.length > 0);
  }, [produtosFiltrados]);

  const renderProduto = ({ item }: { item: Produto }) => {
    const categoria = CATEGORIAS_MOCK.find((cat) => cat.id === item.categoriaId);
    const emGrade = layoutLista === "grade";

    return (
      <View style={[styles.produtoCard, emGrade && styles.produtoCardGrade]}>
        <View style={styles.produtoInfo}>
          <Ionicons
            name={(categoria?.icone as keyof typeof Ionicons.glyphMap) ?? "cube-outline"}
            size={18}
            color={categoria?.cor ?? Colors.primary[600]}
          />
          <View style={styles.produtoTextos}>
            <Text style={styles.produtoNome}>{item.nome}</Text>
            <Text style={styles.produtoMeta}>
              {categoria ? getNomeCategoria(categoria) : "Sem categoria"} • {item.quantidade} {item.unidade}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderProdutoSecao = ({ item }: { item: Produto }) => {
    const categoria = CATEGORIAS_MOCK.find((cat) => cat.id === item.categoriaId);

    return (
      <View style={styles.produtoCard}>
        <View style={styles.produtoInfo}>
          <Ionicons
            name={(categoria?.icone as keyof typeof Ionicons.glyphMap) ?? "cube-outline"}
            size={18}
            color={categoria?.cor ?? Colors.primary[600]}
          />
          <View style={styles.produtoTextos}>
            <Text style={styles.produtoNome}>{item.nome}</Text>
            <Text style={styles.produtoMeta}>
              {item.quantidade} {item.unidade}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-circle-outline" size={48} color={Colors.neutral[400]} />
      <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
      <Text style={styles.emptyText}>Tente ajustar a busca ou selecionar outra categoria.</Text>
    </View>
  );

  const Header = (
    <View style={styles.headerContainer}>
      <Text style={styles.title}>Produtos</Text>
      <Text style={styles.subtitle}>Busque e filtre por categoria</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={Colors.neutral[500]} />
        <TextInput
          style={styles.searchInput}
          value={busca}
          onChangeText={setBusca}
          placeholder="Buscar produto..."
          placeholderTextColor={Colors.textSecondary}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleButton, modoVisualizacao === "simples" && styles.toggleButtonAtivo]}
          onPress={() => setModoVisualizacao("simples")}
          activeOpacity={0.85}
        >
          <Ionicons
            name="list-outline"
            size={14}
            color={modoVisualizacao === "simples" ? Colors.primary[600] : Colors.textSecondary}
          />
          <Text style={[styles.toggleText, modoVisualizacao === "simples" && styles.toggleTextAtivo]}>Lista simples</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.toggleButton, modoVisualizacao === "agrupado" && styles.toggleButtonAtivo]}
          onPress={() => setModoVisualizacao("agrupado")}
          activeOpacity={0.85}
        >
          <Ionicons
            name="layers-outline"
            size={14}
            color={modoVisualizacao === "agrupado" ? Colors.primary[600] : Colors.textSecondary}
          />
          <Text style={[styles.toggleText, modoVisualizacao === "agrupado" && styles.toggleTextAtivo]}>Por categoria</Text>
        </TouchableOpacity>
      </View>

      {modoVisualizacao === "simples" && (
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleButton, layoutLista === "lista" && styles.toggleButtonAtivo]}
            onPress={() => setLayoutLista("lista")}
            activeOpacity={0.85}
          >
            <Ionicons
              name="reorder-three-outline"
              size={14}
              color={layoutLista === "lista" ? Colors.primary[600] : Colors.textSecondary}
            />
            <Text style={[styles.toggleText, layoutLista === "lista" && styles.toggleTextAtivo]}>Lista</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleButton, layoutLista === "grade" && styles.toggleButtonAtivo]}
            onPress={() => setLayoutLista("grade")}
            activeOpacity={0.85}
          >
            <Ionicons
              name="grid-outline"
              size={14}
              color={layoutLista === "grade" ? Colors.primary[600] : Colors.textSecondary}
            />
            <Text style={[styles.toggleText, layoutLista === "grade" && styles.toggleTextAtivo]}>Grade</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContainer}>
        {categoriasFiltro.map((item) => {
          const isTodas = item.id === "todas";
          const isAtivo = isTodas ? categoriaAtiva === null : categoriaAtiva === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.chip,
                isAtivo && styles.chipAtivo,
                isAtivo && !isTodas && { borderColor: item.cor, backgroundColor: Colors.white },
              ]}
              onPress={() => setCategoriaAtiva(isTodas ? null : item.id)}
              activeOpacity={0.85}
            >
              <Ionicons
                name={(item.icone as keyof typeof Ionicons.glyphMap) ?? "pricetag-outline"}
                size={14}
                color={isAtivo ? (isTodas ? Colors.primary[600] : item.cor) : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.chipText,
                  isAtivo && styles.chipTextAtivo,
                  isAtivo && !isTodas && { color: item.cor },
                ]}
              >
                {item.nome}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  if (modoVisualizacao === "agrupado") {
    return (
      <SectionList<Produto, SecaoProdutos>
        sections={secoesAgrupadas}
        keyExtractor={(item) => item.id}
        renderItem={renderProdutoSecao}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name={(section.icone as keyof typeof Ionicons.glyphMap) ?? "folder-outline"} size={16} color={section.cor} />
              <Text style={styles.sectionHeaderTitle}>{section.title}</Text>
            </View>
            <Text style={styles.sectionHeaderCount}>{section.data.length} itens</Text>
          </View>
        )}
        ListHeaderComponent={Header}
        ListEmptyComponent={ListEmpty}
        stickySectionHeadersEnabled
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    );
  }

  return (
    <FlatList<Produto>
      key={`flat-${layoutLista}`}
      data={produtosFiltrados}
      keyExtractor={(item) => item.id}
      renderItem={renderProduto}
      numColumns={layoutLista === "grade" ? 2 : 1}
      columnWrapperStyle={layoutLista === "grade" ? styles.columnWrapper : undefined}
      ListHeaderComponent={Header}
      ListEmptyComponent={ListEmpty}
      stickyHeaderIndices={[]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      removeClippedSubviews={false}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[8],
    backgroundColor: Colors.background,
    flexGrow: 1,
  },
  headerContainer: {
    marginBottom: Spacing[3],
  },
  title: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing[1],
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing[4],
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    marginBottom: Spacing[3],
    gap: Spacing[2],
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  chipsContainer: {
    paddingBottom: Spacing[2],
    gap: Spacing[2],
  },
  toggleRow: {
    flexDirection: "row",
    gap: Spacing[2],
    marginBottom: Spacing[2],
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[1],
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    borderRadius: 999,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
  },
  toggleButtonAtivo: {
    borderColor: Colors.primary[300],
    backgroundColor: Colors.primary[50],
  },
  toggleText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  toggleTextAtivo: {
    color: Colors.primary[600],
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    borderRadius: 999,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    gap: Spacing[1],
  },
  chipAtivo: {
    borderColor: Colors.primary[300],
    backgroundColor: Colors.primary[50],
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  chipTextAtivo: {
    color: Colors.primary[600],
  },
  produtoCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: Spacing[4],
    marginBottom: Spacing[3],
  },
  produtoCardGrade: {
    flex: 1,
    marginBottom: Spacing[2],
  },
  columnWrapper: {
    gap: Spacing[2],
  },
  produtoInfo: {
    flexDirection: "row",
    alignItems: "center",
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
  sectionHeader: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing[2],
    marginBottom: Spacing[2],
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionHeaderTitle: {
    marginLeft: Spacing[1],
    fontSize: Typography.fontSize.md,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  sectionHeaderCount: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Spacing[10],
    paddingHorizontal: Spacing[5],
  },
  emptyTitle: {
    marginTop: Spacing[3],
    marginBottom: Spacing[1],
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
