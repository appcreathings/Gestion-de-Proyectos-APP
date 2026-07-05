import { z } from "zod";
import { newProduct } from "@/domain/factories";
import { ProductStatus } from "@/domain/schemas";
import { productView } from "../serializers";
import { defineTool, type AiTool, type ToolContext } from "../types";
import { productName } from "../glossary";

export function createProductWriteTools(ctx: ToolContext): AiTool[] {
  const { getData, actions } = ctx;

  return [
    defineTool({
      name: "create_product",
      description: "Crea un producto (contenedor de proyectos).",
      mode: "write",
      input: z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        vision: z.string().optional(),
      }),
      describeCall: (a) => `Crear producto "${a.name}"`,
      execute: async (a) => {
        const product = newProduct(a.name);
        if (a.description) product.description = a.description;
        if (a.vision) product.vision = a.vision;
        await actions.createProduct(product);
        return { ok: true, product: { id: product.id, name: product.name } };
      },
    }),

    defineTool({
      name: "update_product",
      description: "Actualiza campos de un producto (nombre, descripción, visión, estado).",
      mode: "write",
      input: z.object({
        productId: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        vision: z.string().optional(),
        status: ProductStatus.optional(),
      }),
      describeCall: (a) => {
        const changes = [a.name && `nombre → "${a.name}"`, a.status && `estado → ${a.status}`]
          .filter(Boolean)
          .join(", ");
        return `Actualizar producto "${productName(ctx, a.productId)}" (${changes || "cambios"})`;
      },
      execute: async (a) => {
        const product = getData().products.find((x) => x.id === a.productId);
        if (!product) throw new Error(`Producto no encontrado: ${a.productId}`);
        const next = {
          ...product,
          ...(a.name !== undefined && { name: a.name }),
          ...(a.description !== undefined && { description: a.description }),
          ...(a.vision !== undefined && { vision: a.vision }),
          ...(a.status !== undefined && { status: a.status }),
        };
        await actions.updateProduct(next);
        return productView(next);
      },
    }),

    defineTool({
      name: "delete_product",
      description:
        "Elimina un producto. Los proyectos asociados no se eliminan, quedan sin producto asignado. Requiere confirmación.",
      mode: "write",
      input: z.object({ productId: z.string() }),
      describeCall: (a) =>
        `Eliminar el producto "${productName(ctx, a.productId)}" (los proyectos asociados quedarán sin producto)`,
      execute: async (a) => {
        if (!getData().products.find((x) => x.id === a.productId))
          throw new Error(`Producto no encontrado: ${a.productId}`);
        await actions.deleteProduct(a.productId);
        return { ok: true };
      },
    }),
  ];
}
