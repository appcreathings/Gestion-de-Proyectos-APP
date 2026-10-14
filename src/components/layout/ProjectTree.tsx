import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { GripVertical, ChevronDown, ChevronRight } from "lucide-react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
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
 * producto (spec 075: `settings.sidebarOrder`) y los productos entre sí
 * (spec 076: `settings.productOrder`).
 */
export function ProjectTree({ onNavigate, className }: ProjectTreeProps) {
  const products = useDataStore((s) => s.products);
  const projects = useDataStore((s) => s.projects);
  const sidebarOrder = useAppStore((s) => s.workspace?.settings.sidebarOrder);
  const productOrder = useAppStore((s) => s.workspace?.settings.productOrder);
  const { id: activeProjectId } = useParams();

  const { named, unassigned, groups } = useMemo(() => {
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
    const named = orderProjects(
      products
        .map((prod) => ({
          id: prod.id,
          name: prod.name,
          // Dentro del producto manda el orden guardado (spec 075 D17); sin
          // lista, el del store.
          projects: orderProjects(byProduct.get(prod.id) ?? [], sidebarOrder?.[groupKey(prod.id)]),
        }))
        .filter((g) => g.projects.length > 0),
      // Entre productos manda el orden guardado (spec 076 D5); sin lista, el
      // del store. Un id desconocido se salta; un producto fuera de la lista
      // queda al final.
      productOrder,
    );
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
    return { named, unassigned, groups: [...named, ...unassigned] };
  }, [products, projects, sidebarOrder, productOrder]);

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
   * trampa de design §10: `updateSettings` hace spread de primer nivel).
   * Devuelve false si no hay workspace: nada escrito ni anunciado. */
  function persistOrder(groupId: string, next: string[], movedId: string): boolean {
    const ws = useAppStore.getState().workspace;
    if (!ws) return false;
    void useAppStore.getState().updateSettings({
      sidebarOrder: { ...ws.settings.sidebarOrder, [groupId]: next },
    });
    const n = next.indexOf(movedId) + 1;
    const productName = groups.find((g) => g.id === groupId)?.name ?? "";
    setAnnouncement(
      n <= 1 ? `Quedó primero en ${productName}` : `Quedó en el puesto ${n} en ${productName}`,
    );
    return true;
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
    const next = reorderWithin(ids, projectId, overId);
    if (next) persistOrder(groupId, next, projectId);
  }

  // --- Productos entre sí (spec 076) ---

  const namedIds = useMemo(() => named.map((g) => g.id), [named]);

  const productSensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  );

  // Orden optimista durante el arrastre: el bloque sigue al puntero y los
  // vecinos se corren en vivo; el store se escribe recién al soltar (D5). El
  // estado local se conserva hasta que el orden guardado lo alcanza, para que
  // la escritura asincrónica de `updateSettings` no haga saltar la fila.
  const [dragOrder, setDragOrder] = useState<string[] | null>(null);

  const orderedNamed = useMemo(() => {
    if (!dragOrder) return named;
    const byId = new Map(named.map((g) => [g.id, g] as const));
    const shown = dragOrder.map((id) => byId.get(id)).filter((g): g is ProductGroup => Boolean(g));
    for (const g of named) if (!dragOrder.includes(g.id)) shown.push(g);
    return shown;
  }, [named, dragOrder]);

  const productIds = useMemo(() => orderedNamed.map((g) => g.id), [orderedNamed]);

  useEffect(() => {
    if (!dragOrder) return;
    if (dragOrder.length === namedIds.length && dragOrder.every((id, i) => id === namedIds[i])) {
      setDragOrder(null);
    }
  }, [dragOrder, namedIds]);

  /** Escribe solo `productOrder` (D5): el spread de `updateSettings` conserva
   * `sidebarOrder` y `boardViews`. Sin workspace no escribe ni anuncia. */
  function persistProductOrder(next: string[], movedId: string): boolean {
    const ws = useAppStore.getState().workspace;
    if (!ws) return false;
    void useAppStore.getState().updateSettings({ productOrder: next });
    const n = next.indexOf(movedId) + 1;
    const productName = named.find((g) => g.id === movedId)?.name ?? "";
    setAnnouncement(
      n <= 1 ? `${productName} quedó primero` : `${productName} quedó en el puesto ${n}`,
    );
    return true;
  }

  /** Flecha del asa de producto (D7): el vecino en la lista visible; en el
   * extremo, no-op y sin anuncio. */
  function moveProductByArrow(productId: string, direction: -1 | 1) {
    const from = productIds.indexOf(productId);
    const to = from + direction;
    if (from === -1 || to < 0 || to > productIds.length - 1) return;
    const overId = productIds[to];
    if (!overId) return;
    const next = reorderWithin(productIds, productId, overId);
    if (next) persistProductOrder(next, productId);
  }

  function handleProductDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const next = reorderWithin(productIds, String(active.id), String(over.id));
    if (next) setDragOrder(next);
  }

  function handleProductDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) {
      // Soltó fuera de la lista: vuelve al orden guardado.
      setDragOrder(null);
      return;
    }
    const final = dragOrder;
    if (!final) return; // soltó en el mismo puesto
    const unchanged =
      final.length === namedIds.length && final.every((id, i) => id === namedIds[i]);
    if (unchanged || !persistProductOrder(final, String(active.id))) setDragOrder(null);
    // Si escribió, el efecto deja el orden local hasta que el store lo alcance.
  }

  function handleProductDragCancel() {
    setDragOrder(null);
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
      {/* Productos entre sí: un DndContext exterior hace imposible que el
       * arrastre de un proyecto cruce de producto (spec 076 D8); los listeners
       * van solo en el asa de cada nivel. pointerWithin: el nodo medido es el
       * grupo abierto, y rectIntersection se queda en el mismo producto al
       * arrastrarlo hacia arriba. */}
      <DndContext
        sensors={productSensors}
        collisionDetection={pointerWithin}
        onDragOver={handleProductDragOver}
        onDragEnd={handleProductDragEnd}
        onDragCancel={handleProductDragCancel}
      >
        <SortableContext items={productIds} strategy={verticalListSortingStrategy}>
          {orderedNamed.map((g) => {
            const isOpen = expanded.has(g.id);
            return (
              <SortableItem key={g.id} id={g.id}>
                {({ setNodeRef, style, attributes, listeners, isDragging }) => (
                  <div
                    ref={setNodeRef}
                    style={style}
                    className={cn("relative", isDragging && "z-10 opacity-40")}
                  >
                    <div className="flex items-center">
                      <button
                        type="button"
                        aria-label={`Reordenar ${g.name}`}
                        className="flex h-6 w-3 shrink-0 cursor-grab touch-none items-center justify-center rounded text-muted-foreground/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing"
                        onKeyDown={(e) => {
                          if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                            e.preventDefault();
                            moveProductByArrow(g.id, e.key === "ArrowUp" ? -1 : 1);
                          }
                        }}
                        {...attributes}
                        {...listeners}
                      >
                        <GripVertical className="size-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggle(g.id)}
                        aria-expanded={isOpen}
                        className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                      >
                        {isOpen ? (
                          <ChevronDown className="size-3.5 shrink-0" />
                        ) : (
                          <ChevronRight className="size-3.5 shrink-0" />
                        )}
                        <span className="truncate">{g.name}</span>
                      </button>
                    </div>
                    {isOpen && (
                      <GroupProjects
                        group={g}
                        activeProjectId={activeProjectId}
                        onNavigate={onNavigate}
                        onReorder={persistOrder}
                        onMoveByArrow={moveByArrow}
                      />
                    )}
                  </div>
                )}
              </SortableItem>
            );
          })}
        </SortableContext>
      </DndContext>
      {unassigned.map((g) => {
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
                onReorder={persistOrder}
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
  onReorder: (groupId: string, next: string[], movedId: string) => boolean;
  onMoveByArrow: (groupId: string, projectId: string, direction: -1 | 1) => void;
}) {
  // Distancia corta para que el clic en el nombre siga ganando; en touch el
  // delay deja que el scroll de la barra gane si el dedo se mueve enseguida
  // (design §3).
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  );

  // Orden optimista durante el arrastre, igual que los productos: las filas
  // vecinas se corren en vivo y el store se escribe al soltar, sin salto.
  const [liveIds, setLiveIds] = useState<string[] | null>(null);
  const storedIds = useMemo(() => group.projects.map((p) => p.id), [group.projects]);
  const shown = useMemo(() => {
    if (!liveIds) return group.projects;
    const byId = new Map(group.projects.map((p) => [p.id, p] as const));
    const list = liveIds.map((id) => byId.get(id)).filter((p): p is Project => Boolean(p));
    for (const p of group.projects) if (!liveIds.includes(p.id)) list.push(p);
    return list;
  }, [group.projects, liveIds]);
  const ids = useMemo(() => shown.map((p) => p.id), [shown]);

  useEffect(() => {
    if (!liveIds) return;
    if (liveIds.length === storedIds.length && liveIds.every((id, i) => id === storedIds[i])) {
      setLiveIds(null);
    }
  }, [liveIds, storedIds]);

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const next = reorderWithin(ids, String(active.id), String(over.id));
    if (next) setLiveIds(next);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) {
      setLiveIds(null);
      return;
    }
    const final = liveIds;
    if (!final) return; // soltó en el mismo puesto
    const unchanged =
      final.length === storedIds.length && final.every((id, i) => id === storedIds[i]);
    if (unchanged || !onReorder(group.id, final, String(active.id))) setLiveIds(null);
  }

  function handleDragCancel() {
    setLiveIds(null);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="ml-2.5 space-y-0.5 border-l border-border/60 pl-2.5">
          {shown.map((p) => (
            <SortableItem key={p.id} id={p.id}>
              {({ setNodeRef, style, attributes, listeners, isDragging }) => (
                <div
                  ref={setNodeRef}
                  style={style}
                  className={cn("relative flex items-center", isDragging && "z-10 opacity-40")}
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
