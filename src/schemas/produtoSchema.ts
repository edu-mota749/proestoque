import { z } from "zod";

export const UNIDADES_PRODUTO = ["un", "kg", "cx", "L", "m"] as const;

export const produtoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(80, "Nome muito longo"),

  categoriaId: z.string().min(1, "Selecione uma categoria"),

  quantidade: z
    .number({ invalid_type_error: "Informe a quantidade" })
    .int("Quantidade deve ser um número inteiro")
    .min(0, "Quantidade não pode ser negativa"),

  quantidadeMinima: z
    .number({ invalid_type_error: "Informe a quantidade mínima" })
    .int("Deve ser um número inteiro")
    .min(0, "Não pode ser negativa"),

  preco: z.preprocess((valor) => {
    if (typeof valor === "string") {
      const normalizado = valor.trim().replace(/\s+/g, "").replace(",", ".");

      if (normalizado === "") {
        return undefined;
      }

      return Number(normalizado);
    }

    return valor;
  }, z.number({ invalid_type_error: "Informe o preço" }).positive("Preço deve ser maior que zero")),

  unidade: z.enum(UNIDADES_PRODUTO),

  observacao: z.preprocess(
    (valor) => (valor === "" ? undefined : valor),
    z.string().max(200, "Máximo 200 caracteres").optional()
  ),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;
export type UnidadeProduto = (typeof UNIDADES_PRODUTO)[number];
