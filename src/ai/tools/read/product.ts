import { z } from "zod";
import { ProductStatus } from "@/domain/schemas";
import { productView } from "../serializers";
import { defineTool, type AiTool, type ToolContext } from "../types";

export function createProductReadTools(ctx: ToolContext): AiTool[] {
  const { getData } = ctx;
  return [
    defineTool({
      name: "list_products",
      description: "Lista los productos del workspace, con filtro opcional por estado.",
      mode: "read",
      input: z.object({ status: ProductStatus.optional() }),
      execute: ({ status }) =>
        getData()
          .products.filter((p) => !status || p.status === status)
          .map(productView),
    }),
  ];
}
