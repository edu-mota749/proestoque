import ProdutoForm from "@/src/components/ProdutoForm";
import { useLocalSearchParams } from "expo-router";

export default function EditarProdutoScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  return <ProdutoForm produtoId={id} />;
}
