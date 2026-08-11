# Prompt de ejecución — Spec 046

> Pegar esto como primer mensaje en una conversación **nueva**, sobre este mismo repo.

---

Vas a **implementar** la spec 046 de este proyecto: `specs/046-sidebar-scroll-y-minimizar/`.

Es una feature ya planificada de UX/UI pura: (1) darle scroll interno al sidebar de
navegación (el `<nav>` scrollea, el header y el pie quedan fijos) y (2) agregar un botón
para minimizar el sidebar de escritorio a un rail de solo íconos, con el estado persistido
en `localStorage`. **No re-diseñes ni re-preguntes el alcance**: ejecutá lo que `spec.md`,
`design.md` y `tasks.md` ya fijaron. Si algo es ambiguo en el borde de una decisión ya
documentada, elegí la opción alineada a las "Decisiones fijadas" del spec y seguí; solo
preguntá si chocás con un invariante real o un bug bloqueante no previsto.

## Orden de lectura obligatorio (antes de tocar código)

1. `CLAUDE.md` del proyecto (raíz) y `.claude/CLAUDE.md` — reglas graphify. Este repo tiene
   grafo en `graphify-out/`: usá `graphify query "..."` / `graphify explain "..."` antes de
   leer archivos fuente a ciegas, y `graphify update .` al terminar.
2. `specs/046-sidebar-scroll-y-minimizar/spec.md` — contexto, **root cause confirmado** de
   por qué el sidebar no scrollea hoy (cadena de altura rota: `h-full` sin `html`/`body` con
   `height: 100%`), objetivo, decisiones D1–D12, HU-01 a HU-04 con sus CA, fuera de alcance.
3. `specs/046-sidebar-scroll-y-minimizar/design.md` — snippets exactos de cada cambio,
   sección por sección (§1 fix de altura, §2 scroll del nav, §3 estado+persistencia, §4
   ancho del aside, §5 rail de íconos completo, §6 `WorkspaceStatus` colapsado, §7
   accesibilidad, §8 orden sugerido, §9 alternativas descartadas y por qué).
4. `specs/046-sidebar-scroll-y-minimizar/tasks.md` — fases A→G.
5. Código de referencia ya existente (leerlo, no asumirlo):
   - `src/components/layout/AppLayout.tsx` (archivo principal a modificar — `AppLayout()`,
     `SidebarContent()`, `MobileBottomNav()` no cambia)
   - `src/components/layout/WorkspaceStatus.tsx` (gana prop `collapsed`)
   - `src/components/layout/ProjectTree.tsx` (**no se toca** — solo se deja de renderizar
     condicionalmente desde `AppLayout.tsx`)
   - `src/features/projects/components/TasksTab.tsx` líneas ~90-113 — precedente exacto del
     patrón de persistencia en `localStorage` con initializer lazy + try/catch que hay que
     replicar (mismo estilo, sin crear un hook genérico nuevo)
   - `src/index.css` — confirmar (ya se confirmó en el spec, pero releé antes de tocar nada)
     que efectivamente no hay `height: 100%` en `html`/`body`, para entender por qué el fix
     es `h-dvh` en `AppLayout.tsx` y no tocar este archivo

## Baseline a verificar al empezar

```bash
npm run typecheck
npm test
npm run lint
```

Anotá el número de tests. **Solo puede subir** (o mantenerse si una fase no añade tests —
es esperable que esta spec agregue pocos o ningún test unitario nuevo, ver spec.md §5).
`SCHEMA_VERSION` no cambia — sin migración.

## Cómo ejecutar

Seguí `tasks.md` en este orden (ya secuenciado por dependencias en `design.md` §8):

1. **Fase A** — Fix de altura (`h-full`→`h-dvh` en el div raíz de `AppLayout`). Es un
   cambio de una línea pero con impacto potencial en **toda** la app (pasa de "scrollea la
   página completa" a "scrollea `<main>` internamente"). Hacé el smoke de A2 **inmediatamente**
   después de este cambio, antes de seguir con el resto — si algo se ve mal acá, es más
   barato detectarlo ahora que después de construir el rail de íconos encima.
2. **Fase B** — Scroll del `<nav>` (`overflow-y-auto min-h-0`). Verificá con DevTools, no
   solo a ojo, que el `min-h-0` esté haciendo efecto (`scrollHeight > clientHeight`) — es un
   bug clásico de flexbox que no tira ningún error si falta.
3. **Fase C** — Estado de colapso + persistencia en `localStorage`.
4. **Fase D** — Rail de íconos completo (ancho del `<aside>`, header, botón de toggle,
   buscador, nav, `ProjectTree` oculto, Asistente). Es la fase más grande — seguí el orden
   D1→D9 tal cual está en `tasks.md`, cada paso depende del anterior.
5. **Fase E** — `WorkspaceStatus` colapsado: 4 variantes (error/escribiendo/sincronizado/
   navegador), cada una con su propio ícono/color/`title` (tabla en `design.md` §6).
6. **Fase F** — Smoke manual **obligatorio** (11 puntos, `npm run dev`, sin RTL en el repo
   para esto). No lo saltees ni lo des por hecho sin abrir el navegador de verdad.
7. **Fase G** — typecheck/tests/lint/build, marcar spec **IMPLEMENTADO**, `graphify update .`.

Después de **cada fase**: `npm run typecheck` + `npm test` (+ lint) limpios antes de la
siguiente.

Marcá casillas en `tasks.md` al completar. Actualizá el estado del `spec.md` a
**IMPLEMENTADO** al final.

## Decisiones ya fijadas — no re-preguntar

1. Fix de altura: `h-full` → `h-dvh` en el div raíz de `AppLayout.tsx`, **no** tocar
   `index.css`/`index.html`. `h-dvh` ya está disponible (Tailwind 3.4.19).
2. Scroll solo en el `<nav>` (destinos + `ProjectTree`) — header y pie del sidebar (logo,
   buscador, Asistente, `WorkspaceStatus`) quedan siempre fijos, fuera del contenedor
   scrolleable.
3. El fix de scroll aplica igual a escritorio y al drawer móvil (mismo componente
   `SidebarContent`), sin lógica condicional por breakpoint para esa parte.
4. Colapsado = rail de íconos (`w-16`), no ocultar del todo. Tooltips con `title` nativo del
   navegador — **no** agregar una librería de Tooltip (no existe hoy en el repo).
5. `ProjectTree` se oculta por completo en colapsado — no hay un modo intermedio.
6. El modo colapsado es **solo de escritorio** — el drawer móvil no gana este botón.
7. Persistencia en `localStorage`, clave `hito:sidebar-collapsed`, valores `"1"`/`"0"`
   (string), lectura con initializer lazy de `useState`, mismo patrón que `TasksTab.tsx`.
8. Íconos del toggle: `PanelLeftClose`/`PanelLeftOpen` de `lucide-react` (ya confirmados
   existentes como export del paquete instalado). Botón propio, no anidado dentro del
   `<Link>` del logo.
9. El badge de no-leídas en colapsado se reduce a un punto de 8px sin número (en expandido
   sigue con número, sin cambios).
10. `WorkspaceStatus` colapsado: solo ícono + color + `title` con el texto completo; sin los
    botones de acción (Reintentar/Conectar carpeta/Exportar) — hay que expandir para actuar,
    y el `title` de la rama de error/sin-sincronizar debe decirlo explícitamente.
11. Sin atajo de teclado nuevo para el toggle. Sin dependencias npm nuevas. Sin cambios de
    schema/migración.
12. Transición del ancho del `<aside>`: `transition-[width] duration-200 ease-in-out` (mismo
    timing que ya usa el drawer móvil en el propio archivo).

## Invariantes (no romper)

- No tocar `src/domain/`, `src/storage/`, ni ningún schema/migración.
- No tocar `src/index.css` ni `index.html` — el fix de altura es local a `AppLayout.tsx`.
- No modificar `ProjectTree.tsx` — solo dejar de renderizarlo condicionalmente desde
  `AppLayout.tsx` cuando `collapsed` es `true`.
- No agregar dependencias npm (ni Tooltip, ni un hook genérico de `localStorage`).
- El comportamiento existente de `<main>`, `DemoBanner`, `MobileBottomNav`, `CommandPalette`,
  `AssistantPanel`, `KeyboardShortcutsModal`, `QuickAddTask`, `Toaster` no cambia — el fix de
  altura (Fase A) es el único cambio con blast radius potencial fuera del sidebar mismo, y
  por eso lleva su propio smoke inmediato (A2) antes de seguir.
- Accesibilidad: el botón de toggle necesita `type="button"`, `aria-label` dinámico,
  `aria-pressed`; los `NavLink`/botones colapsados necesitan `title` con el nombre completo
  de la sección.

## Definición de hecho

- Fases A–G de `tasks.md` hechas.
- CA de HU-01, HU-02, HU-03, HU-04 del `spec.md` cubiertos.
- `npm run typecheck`, `npm test`, `npm run lint`, `npm run build` OK.
- Smoke manual de la Fase F hecho de verdad en el navegador (no solo marcado) — en
  particular F1/F2 (scroll real, no solo "no se ve roto") y F8 (persistencia sin parpadeo).
- Spec marcada **IMPLEMENTADO**.
- `graphify update .` al final.

## Arranque

Empezá por **A1** (`AppLayout.tsx`: cambiar `h-full` por `h-dvh` en el div raíz) seguido
inmediatamente de **A2** (smoke de esa sola línea antes de construir nada encima). No
escribas un plan paralelo: usá `tasks.md` como checklist y reportá al cerrar cada fase qué
quedó verde y qué falta.

---
