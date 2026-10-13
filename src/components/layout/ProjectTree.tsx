import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { GripVertical, ChevronDown, ChevronRight } from "lucide-react";
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { useDataStore } from "@/store/useDataStore";
import { useAppStore } from "@/store/useAppStore";
import { ROUTES } from "@/routes/paths";
import { groupKey, orderProjects, reorderWithin } from "@/domain/sidebarOrder";
import type { Project } from "@/domain/schemas";
import { SortableItem } from "@/components/dnd/SortableItem";

interface ProjectTreeProps {
  /** Called after navigating (e.g. to close a mobile drawer). */
  onNavigate?: () => void;
  className?: string;
}

interface ProductGroup {
  id: string;
  name: string;
  projects: Project[];
}

/**
 * Collapsible Producto → Proyecto tree used in the global rail for quick
 * navigation between projects. El asa reordena proyectos dentro de su
 * producto (spec 075): el orden queda en `settings.sidebarOrder`.
 */
export function ProjectTree({ onNavigate, className }: ProjectTreeProps) {
  const products = useDataStore((s) => s.products);
  const projects = useDataStore((s) => s.projects);
  const sidebarOrder = useAppStore((s) => s.workspace?.settings.sidebarOrder);
  const { id: activeProjectId } = useParams();

  const groups = useMemo<ProductGroup[]>(() => {
    const byProduct = new Map<string, Project[]>();
    const orphans: Project[] = [];
    for (const p of projects) {
      if (!p.productId) {
        orphans.push(p);
        continue;
      }
      const list = byProduct.get(p.productId) ?? [];
      list.push(p);
      byProduct.set(p.productId, list);
    }
    const named = products
      .map((prod) => ({
        id: prod.id,
        name: prod.name,
        // El orden guardado manda (spec 075 D17); sin lista, el del store.
        projects: orderProjects(byProduct.get(prod.id) ?? [], sidebarOrder?.[groupKey(prod.id)]),
      }))
      .filter((g) => g.projects.length > 0);
    const unassigned =
      orphans.length > 0
        ? [
            {
              id: groupKey(null),
              name: "Sin producto",
              projects: orderProjects(orphans, sidebarOrder?.[groupKey(null)]),
            },
          ]
        : [];
    return [...named, ...unassigned];
  }, [products, projects, sidebarOrder]);

  const activeGroupId = useMemo(
    () => groups.find((g) => g.projects.some((p) => p.id === activeProjectId))?.id,
    [groups, activeProjectId],
  );

  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  /** Aviso de reorden (spec 075 D18): «Quedó primero en …» / «Quedó en el puesto n en …». */
  const [announcement, setAnnouncement] = useState("");

  // Grupo que «Cerrar todos» deja de reabrir (spec 073 D15): guarda el id del
  // grupo activo; el efecto no lo vuelve a abrir hasta cambiar de proyecto.
  const skipGroup = useRef<string | null>(null);

  // Keep the group containing the active project expanded (persists as you navigate,
  // since this component stays mounted across route changes).
  // Deps: solo `activeGroupId` (spec 073 D15). Si entrara `expanded` o
  // `groups`, «Cerrar todos» se reabriría solo.
  useEffect(() => {
    if (!activeGroupId) return;
    if (skipGroup.current === activeGroupId) return;
    skipGroup.current = null;
    setExpanded((s) => (s.has(activeGroupId) ? s : new Set(s).add(activeGroupId)));
  }, [activeGroupId]);

  /** Abrir todos los productos; el proyecto activo vuelve a comportarse normal. */
  function expandAll() {
    skipGroup.current = null;
    setExpanded(new Set(groups.map((g) => g.id)));
  }

  /** Cerrar todos, incluido el producto del proyecto activo (spec 073 D15). */
  function collapseAll() {
    skipGroup.current = activeGroupId ?? "";
    setExpanded(new Set());
  }

  function toggle(id: string) {
    setExpanded((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  /** Lista visible actual del grupo, con el orden guardado aplicado (D17). */
  function visibleIds(group: ProductGroup): string[] {
    const saved = useAppStore.getState().workspace?.settings.sidebarOrder?.[group.id];
    return orderProjects(group.projects, saved).map((p) => p.id);
  }

  /** Escribe el record completo con la clave del grupo reemplazada (D17 y
   * trampa de design §10: `updateSettings` hace spread de primer nivel). */
  function persistOrder(groupId: string, next: string[], movedId: string) {
    const ws = useAppStore.getState().workspace;
    if (!ws) return;
    void useAppStore.getState().updateSettings({
      sidebarOrder: { ...ws.settings.sidebarOrder, [groupId]: next },
    });
    const n = next.indexOf(movedId) + 1;
    const productName = groups.find((g) => g.id === groupId)?.name ?? "";
    setAnnouncement(
      n <= 1 ? `Quedó primero en ${productName}` : `Quedó en el puesto ${n} en ${productName}`,
    );
  }

  /** Soltar el asa o la flecha terminan acá: mueve dentro del grupo y persiste. */
  function applyReorder(groupId: string, activeId: string, overId: string) {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;
    const next = reorderWithin(visibleIds(group), activeId, overId);
    if (next) persistOrder(groupId, next, activeId);
  }

  /** Flecha del asa (D18): el vecino en la lista visible; en el extremo, no-op. */
  function moveByArrow(groupId: string, projectId: string, direction: -1 | 1) {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;
    const ids = visibleIds(group);
    const from = ids.indexOf(projectId);
    const to = from + direction;
    if (from === -1 || to < 0 || to > ids.length - 1) return;
    const overId = ids[to];
    if (!overId) return;
    applyReorder(groupId, projectId, overId);
  }

  if (groups.length === 0) return null;

  const allOpen = groups.every((g) => expanded.has(g.id));

  return (
    <div className={cn("space-y-0.5", className)}>
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-xs font-medium text-muted-foreground">Proyectos</span>
        <button
          type="button"
          onClick={allOpen ? collapseAll : expandAll}
          className="text-xs text-muted-foreground hover:text-foreground"
          aria-label={allOpen ? "Cerrar todos" : "Abrir todos"}
        >
          {allOpen ? "Cerrar todos" : "Abrir todos"}
        </button>
      </div>
      {groups.map((g) => {
        const isOpen = expanded.has(g.id);
        return (
          <div key={g.id}>
            <button
              type="button"
              onClick={() => toggle(g.id)}
              className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <ChevronDown className="size-3.5 shrink-0" />
              ) : (
                <ChevronRight className="size-3.5 shrink-0" />
              )}
              <span className="truncate">{g.name}</span>
            </button>
            {isOpen && (
              <GroupProjects
                group={g}
                activeProjectId={activeProjectId}
                onNavigate={onNavigate}
                onReorder={applyReorder}
                onMoveByArrow={moveByArrow}
              />
            )}
          </div>
        );
      })}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}

/** Filas de un grupo abierto: un DndContext propio hace imposible soltar en
 * otro producto (spec 075 D16). El NavLink no lleva listeners: el arrastre
 * nace del asa. */
function GroupProjects({
  group,
  activeProjectId,
  onNavigate,
  onReorder,
  onMoveByArrow,
}: {
  group: ProductGroup;
  activeProjectId: string | undefined;
  onNavigate?: () => void;
  onReorder: (groupId: string, activeId: string, overId: string) => void;
  onMoveByArrow: (groupId: string, projectId: string, direction: -1 | 1) => void;
}) {
  // Distancia corta para que el clic en el nombre siga ganando; en touch el
  // delay deja que el scroll de la barra gane si el dedo se mueve enseguida
  // (design §3).
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  );
  const ids = useMemo(() => group.projects.map((p) => p.id), [group.projects]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    onReorder(group.id, String(active.id), String(over.id));
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="ml-2.5 space-y-0.5 border-l border-border/60 pl-2.5">
          {group.projects.map((p) => (
            <SortableItem key={p.id} id={p.id}>
              {({ setNodeRef, attributes, listeners, isDragging }) => (
                <div
                  ref={setNodeRef}
                  className={cn("relative flex items-center", isDragging && "opacity-40")}
                >
                  <button
                    type="button"
                    aria-label={`Reordenar ${p.name}`}
                    className="flex h-6 w-3 shrink-0 cursor-grab touch-none items-center justify-center rounded text-muted-foreground/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                        e.preventDefault();
                        onMoveByArrow(group.id, p.id, e.key === "ArrowUp" ? -1 : 1);
                      }
                    }}
                    {...attributes}
                    {...listeners}
                  >
                    <GripVertical className="size-3" />
                  </button>
                  <NavLink
                    to={ROUTES.project(p.id)}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        "min-w-0 flex-1 truncate rounded-md px-1.5 py-1.5 text-xs transition-colors",
                        isActive
                          ? "bg-foreground/5 text-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )
                    }
                  >
                    <span className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "size-1 shrink-0 rounded-full bg-current",
                          p.id === activeProjectId ? "opacity-100" : "opacity-60",
                        )}
                      />
                      <span className="truncate">{p.name}</span>
                    </span>
                  </NavLink>
                </div>
              )}
            </SortableItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
