import { useCallback, useEffect, useRef, useState } from "react";
import type { Attachment } from "@/domain/schemas/attachment";
import type { AttachmentParent } from "@/domain/attachments/paths";
import { maxBytesFor, maxCountFor } from "@/domain/attachments/limits";
import { AttachmentValidationError } from "@/domain/attachments/ops";
import { useDataStore } from "@/store/useDataStore";
import { useAppStore } from "@/store/useAppStore";
import { useToastStore } from "@/store/useToastStore";

/**
 * Conecta store + adapter para la sección de anexos (spec 042 T4243).
 * La UI no toca File System Access API (Principio VI).
 */
export function useAttachmentActions(parent: AttachmentParent | null) {
  const adapter = useAppStore((s) => s.adapter);
  const toast = useToastStore((s) => s.toast);
  const addAttachment = useDataStore((s) => s.addAttachment);
  const removeAttachment = useDataStore((s) => s.removeAttachment);
  const updateAttachmentMeta = useDataStore((s) => s.updateAttachmentMeta);

  const [busy, setBusy] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Attachment | null>(null);
  const objectUrls = useRef<Map<string, string>>(new Map());

  const adapterKind = adapter.kind;
  const maxBytes = maxBytesFor(adapterKind);
  const maxCount = maxCountFor(adapterKind);

  useEffect(() => {
    return () => {
      for (const url of objectUrls.current.values()) {
        URL.revokeObjectURL(url);
      }
      objectUrls.current.clear();
    };
  }, []);

  const thumbUrlFor = useCallback(
    async (att: Attachment): Promise<string | null> => {
      if (att.kind !== "image") return null;
      const cached = objectUrls.current.get(att.id);
      if (cached) return cached;
      try {
        const blob = await adapter.readBlob(att.relativePath);
        const url = URL.createObjectURL(blob);
        objectUrls.current.set(att.id, url);
        return url;
      } catch {
        return null;
      }
    },
    [adapter],
  );

  const addFiles = useCallback(
    async (files: File[]) => {
      if (!parent || files.length === 0) return;
      setBusy(true);
      let ok = 0;
      try {
        for (const file of files) {
          try {
            await addAttachment(parent, file);
            ok += 1;
          } catch (e) {
            const msg =
              e instanceof AttachmentValidationError
                ? e.message
                : e instanceof Error
                  ? e.message
                  : "No se pudo adjuntar el archivo.";
            toast.error(`${file.name}: ${msg}`);
          }
        }
        if (ok > 0) {
          toast.success(
            ok === 1 ? "Archivo adjuntado" : `${ok} archivos adjuntados`,
          );
        }
      } finally {
        setBusy(false);
      }
    },
    [parent, addAttachment, toast],
  );

  const confirmRemove = useCallback(async () => {
    if (!parent || !pendingDelete) return;
    const att = pendingDelete;
    setPendingDelete(null);
    setBusy(true);
    try {
      await removeAttachment(parent, att.id);
      const url = objectUrls.current.get(att.id);
      if (url) {
        URL.revokeObjectURL(url);
        objectUrls.current.delete(att.id);
      }
      toast.success(`«${att.name}» eliminado`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "No se pudo eliminar.";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }, [parent, pendingDelete, removeAttachment, toast]);

  const updateDescription = useCallback(
    async (id: string, description: string) => {
      if (!parent) return;
      try {
        await updateAttachmentMeta(parent, id, { description });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "No se pudo guardar la descripción.";
        toast.error(msg);
      }
    },
    [parent, updateAttachmentMeta, toast],
  );

  const download = useCallback(
    async (att: Attachment) => {
      try {
        const blob = await adapter.readBlob(att.relativePath);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = att.name;
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 30_000);
      } catch {
        toast.error(
          "Archivo no encontrado en disco. Si importaste el JSON, copiá también la carpeta attachments/.",
        );
      }
    },
    [adapter, toast],
  );

  return {
    adapterKind,
    maxBytes,
    maxCount,
    busy,
    pendingDelete,
    setPendingDelete,
    addFiles,
    confirmRemove,
    updateDescription,
    download,
    thumbUrlFor,
  };
}
