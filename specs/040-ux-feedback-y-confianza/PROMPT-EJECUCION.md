# Prompt de ejecución — Spec 040

> Pegar esto como primer mensaje en una conversación **nueva**, sobre este mismo repo.

---

Vas a implementar la spec 040 de este proyecto: `specs/040-ux-feedback-y-confianza/`. Es una
auditoría UX/UI ya cerrada — **no re-audites ni re-preguntes el alcance**, ejecutá lo que los
documentos ya definieron.

## Orden de lectura obligatorio, antes de tocar código

1. `.specify/memory/constitution.md` — los seis principios que rigen el proyecto. Si algo en
   `tasks.md` pareciera contradecirlos, la constitución gana; avisá antes de proceder.
2. `specs/040-ux-feedback-y-confianza/spec.md` — los 8 defectos auditados, el objetivo, las
   decisiones ya fijadas (§3) y lo explícitamente fuera de alcance (§5).
3. `specs/040-ux-feedback-y-confianza/design.md` — las decisiones técnicas, con líneas de archivo
   verificadas y snippets de referencia.
4. `specs/040-ux-feedback-y-confianza/tasks.md` — el plan de ejecución fase por fase, con
   checkpoints.
5. `specs/040-ux-feedback-y-confianza/smoke.md` — el guion de verificación manual final.

## Regla de exploración del repo

Este proyecto tiene un grafo de conocimiento en `graphify-out/`. Seguí la regla de
`CLAUDE.md` del proyecto: `graphify query "<pregunta>"` antes de leer código fuente que no esté ya
referenciado con archivo:línea en `design.md` — la mayoría de lo que necesitás ya está anclado
ahí, pero cualquier archivo adicional que abras primero pasalo por `graphify query` o
`graphify explain`. Al terminar cada fase, corré `graphify update .` (AST-only, sin costo de API)
para que el grafo quede al día.

## Baseline a respetar

**823 tests en 75 archivos, `tsc --noEmit` limpio, `vite build` OK** al empezar. Verificalo antes
de tocar nada:

```
npx vitest run
npx tsc --noEmit
npm run build
```

El número de tests **solo puede subir** durante esta spec — a diferencia de 039, ninguna fase
borra código con tests propios. Si algo baja, es una señal de que se rompió algo, no de que "ya
no aplica".

## Cómo ejecutar

Seguí `tasks.md` fase por fase, en la secuencia sugerida al final del documento:
`A → (B ∥ C ∥ D) → E → F → G`. Cada fase tiene:

- Tareas numeradas `T40NN`, cada una con su ancla a una sección de `design.md` y a los
  `CA-NN.N` de `spec.md` que resuelve.
- Un **checkpoint** al final: no pases a la siguiente fase sin verificar el checkpoint contra el
  `smoke.md` correspondiente. Marcá las casillas de `smoke.md` a medida que las confirmás.

Después de cada fase: `tsc --noEmit` + `npx vitest run` + `npm run build` + `npm run lint`, todos
limpios, antes de seguir.

## Lo intocable (invariantes, ver `tasks.md` final)

- `flows/`, `applyMapping`, y todo el editor de flujos resuelto en specs 036-039 — esta spec no
  los reabre.
- El asa de arrastre de `TaskCard` (`TaskCard.tsx:136-142`) — ya es accesible por teclado vía
  dnd-kit, no se toca.
- `index.css:84-87` (el anillo de foco) — se reutiliza, no se redefine.
- `schemaVersion` — sin cambios de schema en toda la spec.
- `StorageAdapter`/`FileSystemAdapter` — se usan desde `withPersist`, no se modifican sus
  contratos.

## Decisiones ya fijadas — no re-preguntar

1. **Toaster propio** (Zustand + `aria-live`), no una librería externa como `sonner`. Ya
   justificado en `spec.md` §3 contra la constitución (stack ratificado + Principio V).
2. **El toast no reemplaza el error de campo de un formulario.** Un campo vacío se corrige en el
   campo (foco + `aria-invalid` + mensaje); el toast es para lo que pasa fuera del formulario que
   el usuario tiene enfrente.
3. **Verificación por lógica pura + `smoke.md` manual**, no jsdom/Testing Library. El proyecto
   corre `vitest` en `environment: "node"` y así se queda; lo que tenga lógica se extrae a una
   función pura testeable, lo visual se confirma a mano.

Si durante la ejecución aparece una ambigüedad real que estos tres puntos no cubren, preguntá — no
asumas. Pero no reabras estos tres.

## Formato de commit

Uno por fase completada (o el que tenga sentido si una fase es chica), en español, siguiendo el
estilo del repo:

```
feat(ux): <resumen de la fase>

<opcional: 1-2 líneas de contexto>
```

Ejemplos de commits recientes del repo para calibrar el tono: `feat(flows): datos legibles del
evento y una sola forma de elegir variables (spec 039)`, `feat(flows): verdad en el canvas,
deshacer y simulación visible (spec 038)`.

## Al terminar

- Todas las fases con checkpoint verificado y marcado en `smoke.md`.
- `tsc --noEmit`, `vitest run`, `vite build`, `lint` limpios.
- `graphify update .` corrido una última vez.
- Un resumen del delta de tests (cuántos se añadieron, en qué área) contra el baseline de 823.
