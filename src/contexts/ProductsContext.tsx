import { PRODUTOS_MOCK, type Produto } from "@/src/data/mockData";
import type { ProdutoFormData } from "@/src/schemas/produtoSchema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";

type ProductsState = {
  produtos: Produto[];
  isLoading: boolean;
};

type ProductsAction =
  | { type: "LOAD"; payload: Produto[] }
  | { type: "ADD"; payload: Produto }
  | { type: "UPDATE"; payload: Produto }
  | { type: "DELETE"; payload: string };

type ProductsContextType = {
  produtos: Produto[];
  isLoading: boolean;
  adicionarProduto: (data: ProdutoFormData) => Promise<void>;
  editarProduto: (id: string, data: ProdutoFormData) => Promise<void>;
  deletarProduto: (id: string) => Promise<void>;
  getProdutoById: (id: string) => Produto | undefined;
};

const STORAGE_KEY = "@proestoque:produtos";

function produtosReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case "LOAD":
      return { ...state, produtos: action.payload, isLoading: false };
    case "ADD":
      return { ...state, produtos: [action.payload, ...state.produtos] };
    case "UPDATE":
      return {
        ...state,
        produtos: state.produtos.map((produto) =>
          produto.id === action.payload.id ? action.payload : produto
        ),
      };
    case "DELETE":
      return {
        ...state,
        produtos: state.produtos.filter((produto) => produto.id !== action.payload),
      };
    default:
      return state;
  }
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(produtosReducer, {
    produtos: [],
    isLoading: true,
  });

  useEffect(() => {
    async function carregarProdutos() {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        const produtos = json ? (JSON.parse(json) as Produto[]) : PRODUTOS_MOCK;
        dispatch({ type: "LOAD", payload: produtos });
      } catch (error) {
        console.warn("Erro ao carregar produtos do armazenamento:", error);
        dispatch({ type: "LOAD", payload: PRODUTOS_MOCK });
      }
    }

    carregarProdutos();
  }, []);

  useEffect(() => {
    if (state.isLoading) {
      return;
    }

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.produtos)).catch((error) => {
      console.warn("Erro ao persistir produtos:", error);
    });
  }, [state.produtos, state.isLoading]);

  const adicionarProduto = useCallback(async (data: ProdutoFormData) => {
    const novoProduto: Produto = {
      id: `prod_${Date.now()}`,
      nome: data.nome,
      categoriaId: data.categoriaId,
      quantidade: data.quantidade,
      quantidadeMinima: data.quantidadeMinima,
      preco: data.preco,
      unidade: data.unidade,
      observacao: data.observacao,
      ultimaMovimentacao: new Date().toISOString(),
    };

    dispatch({ type: "ADD", payload: novoProduto });
  }, []);

  const editarProduto = useCallback(async (id: string, data: ProdutoFormData) => {
    const produtoAtualizado: Produto = {
      id,
      nome: data.nome,
      categoriaId: data.categoriaId,
      quantidade: data.quantidade,
      quantidadeMinima: data.quantidadeMinima,
      preco: data.preco,
      unidade: data.unidade,
      observacao: data.observacao,
      ultimaMovimentacao: new Date().toISOString(),
    };

    dispatch({ type: "UPDATE", payload: produtoAtualizado });
  }, []);

  const deletarProduto = useCallback(async (id: string) => {
    dispatch({ type: "DELETE", payload: id });
  }, []);

  const getProdutoById = useCallback(
    (id: string) => state.produtos.find((produto) => produto.id === id),
    [state.produtos]
  );

  const value = useMemo<ProductsContextType>(
    () => ({
      produtos: state.produtos,
      isLoading: state.isLoading,
      adicionarProduto,
      editarProduto,
      deletarProduto,
      getProdutoById,
    }),
    [adicionarProduto, editarProduto, deletarProduto, getProdutoById, state.isLoading, state.produtos]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error("useProducts deve ser usado dentro de ProductsProvider");
  }

  return context;
}
