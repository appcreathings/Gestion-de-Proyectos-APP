# Tasks 076 — Orden de productos en la barra

Fases en orden. B y C dependen de A y no se tocan entre sí: se pueden hacer en paralelo. D espera a las dos.

Después de A:

```
npx tsc --noEmit
npx vitest run --exclude ".worktrees/**" src/domain/migrations.test.ts src/ai/keys-never-exported.test.ts
```

Después de C, sumar `src/features/board/boardQuery.test.ts` a ese vitest. B no tiene test nuevo: reusa `orderProjects` y `reorderWithin`.

Al cerrar D, la suite entera con el mismo exclude.

TDD en A y en C: el test nuevo falla antes del código. Los tests que ya están verdes tienen que seguir verdes.

Rama: `feat/076-orden-productos-barra`. `SCHEMA_VERSION` **26**.
Snippets: `design.md`. Autoridad: `spec.md` D1–D14.

PowerShell: sin `&&`. Un comando por línea.

## Fase A — Esquema

- [x] A1 En `migrations.test.ts`, el caso que espera la versión actual pasa de 25 a 26. Agregar el describe workspace v25 → v26 de design §5. En `keys-never-exported.test.ts`, el pin pasa a 26. Deben **fallar**.
- [x] A2 `SCHEMA_VERSION = 26` en `common.ts`. `productOrder` en `SettingsSchema` (design §1).
- [x] A3 Paso `workspace` `{ to: 26 }` (design §1). No agregar pasos a projects ni reescribir el paso 25.
- [x] A4 En cada literal `Settings` del mapa de design §0, agregar `productOrder: []`. No usar el campo.
- [x] A5 A1 verde. `npx tsc --noEmit`.

## Fase B — Asa de producto

Deps: A.

- [x] B1 `ProjectTree` ordena los grupos con nombre con `orderProjects(..., productOrder)`. «Sin producto» sigue concatenado al final, sin asa. Cero grupos sigue en `null`.
- [x] B2 Un `DndContext` exterior. `SortableContext` con los ids visibles. El asa usa `SortableItem`; el botón del chevron no lleva listeners. Sensores de design §3. El `DndContext` de cada grupo abierto se queda.
- [x] B3 Flecha arriba y Flecha abajo en el asa del producto. `aria-live` con los textos de design §3. En el extremo, no-op y sin anuncio. El anuncio de un proyecto no se cambia.
- [x] B4 Al soltar o al usar la flecha, `updateSettings({ productOrder: next })` con la lista visible. No reescribir `sidebarOrder` en ese llamado. No tocar `expanded` ni el efecto de «Cerrar todos».
- [x] B5 `npx tsc --noEmit`.

## Fase C — Rango del tablero

Deps: A. No espera a B.

- [x] C1 En `boardQuery.test.ts`, el caso de design §4 (productOrder invierte el array, y el caso que además aplica `sidebarOrder` adentro del producto). Debe **fallar**. El caso que no pasa `productOrder` y espera el orden del array sigue igual.
- [x] C2 `boardProjectRank` recorre `orderProjects(products, productOrder)`. Default `[]`.
- [x] C3 `BoardPage` pasa `settings.productOrder ?? []`. No dejar el default como comportamiento de la página.
- [x] C4 C1 verde. `npx tsc --noEmit`.

## Fase D — Cierre

Deps: B y C.

- [x] D1 `npx tsc --noEmit`.
- [x] D2 `npx vitest run --exclude ".worktrees/**"`.
- [x] D3 `npx eslint src/components/layout/ProjectTree.tsx src/features/board/boardQuery.ts src/features/board/boardQuery.test.ts src/features/board/BoardPage.tsx src/domain/schemas/workspace.ts src/domain/schemas/common.ts src/domain/migrations.ts src/domain/migrations.test.ts src/ai/keys-never-exported.test.ts src/ai/gemini/systemPrompt.ts src/ai/gemini/systemPrompt.test.ts src/ai/tools/read/workspace.ts src/features/reports/statusReport.test.ts src/domain/health.test.ts src/features/projects/filterProjects.test.ts src/features/dashboard/portfolio.test.ts src/automations/temporal.test.ts`. Un error que ya estaba y no es de estos archivos no se «arregla» en esta spec.
- [x] D4 Smoke de `smoke.md`. Si no hay browser, anotar qué no se pudo clicar.
  - Recorrido completo en Chrome (dev server, modo demo, 1440×900 y cajón a 390×844). Todo clickeable; nada pendiente.
  - 1 ✓ Arrastre de Cobra arriba de Nimbus + recarga: queda primero y el orden interno de proyectos no cambió. 2 ✓ «Sin producto» último y sin asa (queda fuera del `DndContext` de productos). 3 ✓ Flecha abajo anuncia «Cobra quedó en el puesto 2»; en el último puesto no-op y sin anuncio; Flecha arriba anuncia «Cobra quedó primero» y en el primer puesto no-op. 4 ✓ «Abrir todos»/«Cerrar todos» intactos; con proyecto activo «Cerrar todos» cierra su grupo y no lo reabre solo; arrastrar un grupo cerrado no lo abre. 5 ✓ El asa de proyecto movió a Lanzamiento v1.0 dentro de Nimbus (anuncio «Quedó en el puesto 2 en Nimbus») sin tocar el orden de productos; recarga conserva ambos. 6 ✓ Barra minimizada: sin árbol ni otro control de orden; al expandir vuelve con el orden guardado. 7 ✓ Cajón móvil con el asa de producto; toque corto abre/cierra. No se simuló físicamente el dedo que scrollea: el sensor touch queda verificado por código (`delay: 200`, `tolerance: 8`). 8 ✓ Tablero: con Cobra primero, su tarjeta encabeza «Por hacer»; adentro de Nimbus manda el `sidebarOrder` (Growth Q3 antes que Lanzamiento v1.0); recarga del tablero no desordena. 9 ✓ `/app/products` y el dashboard «Por producto» siguen el orden del store (Nimbus primero) con Cobra primero en la barra.
- [x] D5 `graphify update .`.
- [x] D6 `spec.md` → estado **IMPLEMENTADO**, con la rama real.

### Commits sugeridos

Hacelos solo si en el chat pidieron commit. Si no, dejá el working tree y decilo.

1. `feat(workspace): persist product order in settings` — fase A
2. `feat(sidebar): reorder products in the project tree` — fase B
3. `feat(board): rank cards by the saved product order` — fase C

El refresco de `graphify-out` va en un commit aparte, `docs: refresh graphify-out`, después de los de código.
