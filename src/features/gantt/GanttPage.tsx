import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { GanttChart } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import * as ops from "@/domain/projectOps";
import type { Project, Task } from "@/domain/schemas";
import { boardProjectRank } from "@/features/board/boardQuery";
import { TaskDetailDrawer } from "@/features/projects/components/kanban/TaskDetailDrawer";
import { parseDayKey, todayKey } from "@/lib/dates";
import { useAppStore } from "@/store/useAppStore";
import { useDataStore } from "@/store/useDataStore";
import { GanttFilters, type GanttOption } from "./GanttFilters";
import { GanttGrid } from "./GanttGrid";
import { buildGanttRows, ganttWindow, shiftAnchor } from "./ganttModel";
import {
  canonicalGanttSearch,
  clearGanttFilters,
  parseGanttQuery,
  readGanttMemory,
  restoreGanttSearch,
  writeGanttMemory,
  type GanttQuery,
  type KnownGanttRefs,
} from "./ganttQuery";

/** Página Gantt de proyectos (spec 077). Vista de lectura (D2): lo único que
 * edita es el drawer de la tarea. */

/** El acceso a `localStorage` mismo puede lanzar (foco 4). */
function safeStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const RANGE_FORMATTER = new Intl.DateTimeFormat("es", { month: "short", year: "numeric" });

export function GanttPage() {
  const projects = useDataStore((s) => s.projects);
  const products = useDataStore((s) => s.products);
  const people = useDataStore((s) => s.people);
  const mutateProject = useDataStore((s) => s.mutateProject);
  const sidebarOrder = useAppStore((s) => s.workspace?.settings.sidebarOrder);
  const productOrder = useAppStore((s) => s.workspace?.settings.productOrder);
  const [searchParams, setSearchParams] = useSearchParams();

  // D14b / D18: ids válidos = proyectos no archivados (incluye `done`) y todos los productos.
  const known = useMemo<KnownGanttRefs>(
    () => ({
      productIds: new Set(products.map((p) => p.id)),
      projectIds: new Set(projects.filter((p) => p.status !== "archived").map((p) => p.id)),
    }),
    [products, projects],
  );
  const query = useMemo(() => parseGanttQuery(searchParams, known), [searchParams, known]);

  // D19: al entrar sin params, una sola vez por montaje, se restaura la memoria.
  const didRestore = useRef(false);
  useEffect(() => {
    if (didRestore.current) return;
    didRestore.current = true;
    const storage = safeStorage();
    const next = restoreGanttSearch(searchParams, storage ? readGanttMemory(storage) : null);
    if (next !== null) setSearchParams(new URLSearchParams(next), { replace: true });
  }, [searchParams, setSearchParams]);

  // D18 + nota 1 del controlador: la URL siempre queda canónica; ids
  // desconocidos o valores inválidos (también de una memoria vieja) se caen.
  useEffect(() => {
    const canonical = canonicalGanttSearch(query);
    if (canonical.toString() !== searchParams.toString()) {
      setSearchParams(canonical, { replace: true });
    }
  }, [query, searchParams, setSearchParams]);

  function commit(next: GanttQuery) {
    const search = canonicalGanttSearch(next);
    setSearchParams(search, { replace: true });
    const storage = safeStorage();
    if (storage) writeGanttMemory(storage, search.toString());
  }

  const today = todayKey();
  const anchor = query.at ?? today; // D17: sin `at`, la ventana se centra en hoy.
  const win = useMemo(() => ganttWindow(query.scale, anchor), [query.scale, anchor]);

  const rows = useMemo(
    () =>
      buildGanttRows({
        projects,
        products,
        sidebarOrder: sidebarOrder ?? {},
        productOrder: productOrder ?? [],
        query,
        window: win,
        today,
      }),
    [projects, products, sidebarOrder, productOrder, query, win, today],
  );

  // Opciones de «+ Proyecto» en el orden de la barra; los `done` en «Cerrados» (D14, D14b).
  const { openOptions, doneOptions } = useMemo(() => {
    const rank = boardProjectRank(products, projects, sidebarOrder ?? {}, productOrder ?? [], {
      includeDone: true,
    });
    const rankOf = (id: string) => rank.get(id) ?? Number.MAX_SAFE_INTEGER;
    const toOption = (p: (typeof projects)[number]): GanttOption => ({
      id: p.id,
      label: p.productId
        ? `${p.name} · ${products.find((prod) => prod.id === p.productId)?.name ?? ""}`
        : p.name,
    });
    const eligible = projects
      .filter((p) => p.status !== "archived" && !query.projectIds.includes(p.id))
      .sort((a, b) => rankOf(a.id) - rankOf(b.id));
    return {
      openOptions: eligible.filter((p) => p.status !== "done").map(toOption),
      doneOptions: eligible.filter((p) => p.status === "done").map(toOption),
    };
  }, [projects, products, sidebarOrder, productOrder, query.projectIds]);

  const nameById = (id: string) =>
    products.find((p) => p.id === id)?.name ?? projects.find((p) => p.id === id)?.name ?? id;
  const hasFilters = query.productIds.length > 0 || query.projectIds.length > 0;

  // D15: el despliegue es de la sesión, no va a la URL.
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  function toggle(projectId: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
      return next;
    });
  }

  // Drawer (D2, D16): mismo cableado que el Tablero (075).
  const [detailTask, setDetailTask] = useState<Task | null>(null);
  const [detailProject, setDetailProject] = useState<Project | null>(null);

  function openTask(projectId: string, taskId: string) {
    const project = projects.find((p) => p.id === projectId) ?? null;
    const task = project?.tasks.find((t) => t.id === taskId) ?? null;
    setDetailProject(task ? project : null);
    setDetailTask(task);
  }

  function closeDetail() {
    setDetailTask(null);
    setDetailProject(null);
  }

  function handleUpdateTask(updated: Task) {
    if (!detailProject) return;
    void mutateProject(detailProject.id, (p) => ops.updateTask(p, updated));
    setDetailTask(updated);
  }

  const rangeLabel = `${RANGE_FORMATTER.format(parseDayKey(win.start))} – ${RANGE_FORMATTER.format(parseDayKey(win.end))}`;

  return (
    <div>
      <PageHeader
        label="Gantt"
        title="Lo hecho y lo que viene"
        description="Una fila por proyecto: lo que cerraste hacia atrás y lo que vence hacia adelante. Toca un proyecto para ver sus tareas."
      />

      <GanttFilters
        productOptions={products
          .filter((p) => !query.productIds.includes(p.id))
          .map((p) => ({ id: p.id, label: p.name }))}
        openProjectOptions={openOptions}
        doneProjectOptions={doneOptions}
        productChips={query.productIds.map((id) => ({ id, label: nameById(id) }))}
        projectChips={query.projectIds.map((id) => ({ id, label: nameById(id) }))}
        hasFilters={hasFilters}
        scale={query.scale}
        rangeLabel={rangeLabel}
        onAddProduct={(id) => commit({ ...query, productIds: [...query.productIds, id] })}
        onRemoveProduct={(id) =>
          commit({ ...query, productIds: query.productIds.filter((x) => x !== id) })
        }
        onAddProject={(id) => commit({ ...query, projectIds: [...query.projectIds, id] })}
        onRemoveProject={(id) =>
          commit({ ...query, projectIds: query.projectIds.filter((x) => x !== id) })
        }
        onClear={() => commit(clearGanttFilters(query))}
        onShift={(delta) => commit({ ...query, at: shiftAnchor(query.scale, anchor, delta) })}
        onToday={() => commit({ ...query, at: null })}
        onScale={(scale) => commit({ ...query, scale })}
      />

      {rows.length === 0 ? (
        // D24: el vacío guía a la acción que corresponde.
        <EmptyState
          icon={GanttChart}
          title="No hay proyectos con fechas ni tareas en este período."
          action={
            hasFilters ? (
              <Button type="button" size="sm" variant="outline" onClick={() => commit(clearGanttFilters(query))}>
                Limpiar filtros
              </Button>
            ) : (
              <Button type="button" size="sm" variant="outline" onClick={() => commit({ ...query, at: null })}>
                Ir a hoy
              </Button>
            )
          }
        />
      ) : (
        <GanttGrid
          rows={rows}
          win={win}
          today={today}
          expanded={expanded}
          onToggle={toggle}
          onOpenTask={openTask}
        />
      )}

      {detailTask && detailProject && (
        <TaskDetailDrawer
          task={detailTask}
          projectId={detailProject.id}
          areas={detailProject.areas}
          people={people}
          sprints={detailProject.sprints}
          stages={detailProject.stages}
          onUpdate={handleUpdateTask}
          onClose={closeDetail}
        />
      )}
    </div>
  );
}
