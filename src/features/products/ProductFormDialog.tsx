import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { PersonSelect } from "@/components/forms/PersonSelect";
import { RichTextField } from "@/components/forms/RichTextField";
import { fieldAria, useFieldErrors } from "@/lib/formErrors";
import { productStatusLabel } from "@/domain/labels";
import type { Product, ProductStatus } from "@/domain/schemas";
import { newProduct } from "@/domain/factories";
import { useDataStore } from "@/store/useDataStore";
import { AttachmentsSection } from "@/components/attachments/AttachmentsSection";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  product?: Product;
  onSubmit: (p: Product) => void | Promise<void>;
}

export function ProductFormDialog({ open, onOpenChange, product, onSubmit }: Props) {
  const people = useDataStore((s) => s.people);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [vision, setVision] = useState("");
  const [status, setStatus] = useState<ProductStatus>("active");
  const [ownerId, setOwnerId] = useState("");
  const [saving, setSaving] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const { errors, validate, clear } = useFieldErrors();

  useEffect(() => {
    if (open) {
      setName(product?.name ?? "");
      setDescription(product?.description ?? "");
      setVision(product?.vision ?? "");
      setStatus(product?.status ?? "active");
      setOwnerId(product?.ownerId ?? "");
      clear();
    }
  }, [open, product, clear]);

  async function submit() {
    const errs = validate(
      { name },
      [{ field: "name", message: "El nombre no puede estar vacío", test: (v) => v.name.trim().length > 0 }],
    );
    if (errs.length > 0) {
      nameRef.current?.focus();
      return;
    }
    // No pisar anexos añadidos en el diálogo (viven en el store).
    const live = product
      ? useDataStore.getState().products.find((p) => p.id === product.id)
      : undefined;
    const base = live ?? product ?? newProduct(name);
    setSaving(true);
    try {
      await onSubmit({
        ...base,
        name: name.trim(),
        description,
        vision,
        status,
        ownerId: ownerId || null,
        attachments: live?.attachments ?? base.attachments ?? [],
      });
      onOpenChange(false);
    } catch {
      // El error ya se anuncia por el toast de Fase B; dejamos el diálogo abierto.
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md" description="Completa los datos del producto: nombre, visión, estado y responsable.">
        <DialogHeader>
          <DialogTitle>{product ? "Editar producto" : "Nuevo producto"}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <div className="grid gap-2">
            <Label htmlFor="p-name">Nombre</Label>
            <Input
              id="p-name"
              ref={nameRef}
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Nombre del producto"
              {...fieldAria("name", errors)}
            />
            {errors.name && (
              <p id="name-err" role="alert" className="text-xs text-destructive">
                {errors.name}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="p-vision">Visión</Label>
            <Textarea
              id="p-vision"
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              placeholder="¿Qué busca lograr este producto?"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="p-desc">Descripción</Label>
            <RichTextField
              id="p-desc"
              value={description}
              onChange={setDescription}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="p-status">Estado</Label>
              <Select
                id="p-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ProductStatus)}
              >
                {Object.entries(productStatusLabel).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="p-owner">Responsable</Label>
              <PersonSelect
                id="p-owner"
                value={ownerId}
                onChange={setOwnerId}
                people={people}
              />
            </div>
          </div>
          {product && (
            <AttachmentsSection
              parent={{ type: "product", productId: product.id }}
              attachments={product.attachments ?? []}
            />
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={submit} pending={saving}>
            {product ? "Guardar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
