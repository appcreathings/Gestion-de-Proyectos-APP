import { useAppStore } from "@/store/useAppStore";
import { useToastStore } from "@/store/useToastStore";

/** Ejecuta `persist(nextState)`. Si rechaza: revierte el `set()` al `prevState`,
 *  emite un toast de error con el mensaje real, marca `lastWriteError` en
 *  useAppStore y **relanza** para que llamadores compuestos (p. ej.
 *  `createProject` → `persistProject` → `runAutomations`) aborten la cadena y
 *  no disparen efectos sobre un estado ya revertido (CA-01.5, R1). Si resuelve:
 *  limpia cualquier error previo. */
export async function withPersist<T>(
  prevState: T,
  nextState: T,
  applyState: (s: T) => void,
  persist: (s: T) => Promise<void>,
  options?: { alreadyTriggeredAutomations?: boolean },
): Promise<void> {
  applyState(nextState);
  useAppStore.getState().setWriting();
  try {
    await persist(nextState);
    useAppStore.getState().clearWriteError();
  } catch (e) {
    applyState(prevState);
    const message = e instanceof Error ? e.message : String(e);
    useAppStore.getState().setWriteError(message);

    if (options?.alreadyTriggeredAutomations) {
      useToastStore.getState().toast.error(
        `No se pudo guardar: ${message}. El flujo ya se ejecutó; el cambio en pantalla no se pudo guardar.`,
      );
    } else {
      useToastStore.getState().toast.error(`No se pudo guardar: ${message}`);
    }
    throw e;
  }
}