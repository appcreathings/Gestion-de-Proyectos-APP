import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  STAGE_COLORS,
  stageDotClass,
  type KanbanStage,
  type StageColor,
} from "@/domain/kanbanStages";

/** Acciones de etapa (spec 073 §5.2). Los diálogos (renombrar, eliminar) los
 * hostea TasksTab, que es quien tiene `project.stages` para validar. */
export interface StageMenu {
  canMoveLeft: boolean;
  canMoveRight: boolean;
  canDelete: boolean;
  onRename: () => void;
  onRecolor: (color: StageColor) => void;
  onMove: (direction: -1 | 1) => void;
  onDelete: () => void;
}

interface Props {
  stage: KanbanStage;
  /** Columna fantasma de un status desconocido: sin menú, sin WIP (spec 073 §5.1). */
  ghost: boolean;
  count: number;
  wipLimit?: number | null;
  /** Ids of the visible tasks in this column, in display order (for intra-column sorting). */
  taskIds: string[];
  /** Alta de tarea. Un ghost no lo recibe: no se crean tareas en un status que el proyecto ya no tiene. */
  onAdd?: () => void;
  /** Botón «Archivar N» — solo la columna cuyo id es `done` (spec 073 §5.5). */
  archiveAction?: { label: string; onOpen: () => void };
  /** Menú de etapa — undefined en un ghost. */
  stageMenu?: StageMenu;
  /** Selection mode (spec 017 HU-13). */
  selectionMode?: boolean;
  /** Tri-state selection: "none" | "some" | "all" (spec 017 HU-13). */
  columnSelectionState?: "none" | "some" | "all";
  /** Toggle column selection (spec 017 HU-13). */
  onToggleColumnSelection?: () => void;
  children: React.ReactNode;
}

/** Droppable Kanban column with sortable cards; highlights while a card hovers over it. */
export function KanbanColumn({
  stage,
  ghost,
  count,
  wipLimit,
  taskIds,
  onAdd,
  archiveAction,
  stageMenu,
  selectionMode,
  columnSelectionState,
  onToggleColumnSelection,
  children,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
    disabled: ghost,
    data: { type: "column", status: stage.id },
  });
  // Controlado para poder cerrar el menú al elegir un color (spec 073 §5.2):
  // una muestra es un botón propio, no un DropdownMenuItem.
  const [menuOpen, setMenuOpen] = useState(false);

  const isEmpty = taskIds.length === 0;
  const isOverLimit = wipLimit !== null && wipLimit !== undefined && count > wipLimit;
  // Un ghost no muestra menú, ni archivar, ni WIP, aunque el caller los pase
  // por descuido (spec 073 §5.1).
  const menu = ghost ? undefined : stageMenu;
  const archive = ghost ? undefined : archiveAction;
  const limit = ghost ? null : wipLimit;

  return (
    <div
      ref={setNodeRef}
      id={`kanban-col-${stage.id}`}
      data-kanban-status={stage.id}
      className={cn(
        // < sm: diapositiva pareja del carrusel (spec 054). Desde sm crece
        // hasta 22rem; 16rem es el piso para que las cuatro etapas quepan
        // en la fila con la barra lateral abierta, y las demás se desplacen.
        "flex w-[85vw] min-w-[85vw] max-w-[85vw] shrink-0 snap-start flex-col rounded-xl border-2 border-transparent bg-background p-3 transition-colors sm:w-auto sm:min-w-[16rem] sm:max-w-[22rem] sm:flex-[1_0_16rem] sm:border-border/70",
        !ghost && isOver && "border-foreground/40 bg-foreground/[0.06]",
        // Lavado pastel de WIP excedido con token (spec 065 E5): es un aviso
        // de columna, no de tarjeta — el conteo grande lleva el peso.
        // Solo columnas base con límite: una etapa custom no lo muestra (073 §10).
        isOverLimit && "bg-warning-soft",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-1 px-0.5">
        <div className="flex min-w-0 items-center gap-1.5">
          {selectionMode && (
            <input
              type="checkbox"
              checked={columnSelectionState === "all"}
              ref={(el) => {
                if (el) el.indeterminate = columnSelectionState === "some";
              }}
              onChange={(e) => {
                e.stopPropagation();
                onToggleColumnSelection?.();
              }}
              onClick={(e) => e.stopPropagation()}
              className="size-4 cursor-pointer shrink-0 mr-2"
            />
          )}
          <span
            className={cn("size-2 shrink-0 rounded-full", stageDotClass(stage.color))}
            aria-hidden="true"
          />
          <span className="truncate font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {stage.name}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {archive && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-1.5 text-[11px] font-normal"
              onClick={archive.onOpen}
            >
              {archive.label}
            </Button>
          )}
          <Badge
            variant={isOverLimit ? "destructive" : "outline"}
            className="font-mono text-[11px] px-1.5 py-0.5"
          >
            {count}
            {limit !== null && limit !== undefined ? `/${limit}` : ""}
          </Badge>
          {menu && (
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  aria-label={`Opciones de ${stage.name}`}
                >
                  <MoreHorizontal className="size-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onSelect={menu.onRename}>Renombrar</DropdownMenuItem>
                <div
                  role="group"
                  aria-label={`Color de ${stage.name}`}
                  className="flex items-center gap-1.5 px-2.5 py-2"
                >
                  {STAGE_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={color}
                      aria-pressed={color === stage.color}
                      className={cn(
                        "size-5 rounded-full transition-transform hover:scale-110",
                        stageDotClass(color),
                        color === stage.color && "ring-2 ring-foreground ring-offset-2",
                      )}
                      onClick={() => {
                        menu.onRecolor(color);
                        setMenuOpen(false);
                      }}
                    />
                  ))}
                </div>
                {(menu.canMoveLeft || menu.canMoveRight) && (
                  <DropdownMenuSeparator />
                )}
                {menu.canMoveLeft && (
                  <DropdownMenuItem onSelect={() => menu.onMove(-1)}>
                    Mover a la izquierda
                  </DropdownMenuItem>
                )}
                {menu.canMoveRight && (
                  <DropdownMenuItem onSelect={() => menu.onMove(1)}>
                    Mover a la derecha
                  </DropdownMenuItem>
                )}
                {menu.canDelete && <DropdownMenuSeparator />}
                {menu.canDelete && (
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onSelect={menu.onDelete}
                  >
                    Eliminar
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <div className="flex-1 space-y-2.5">
        {/* Fixed min-height wrapper: the empty-state hint is absolutely positioned inside it and
            only fades in/out, so a column never mounts/unmounts this box — that mount/unmount is
            what caused the layout to jump while a live drag preview empties/fills a column. */}
        <div className="relative min-h-[110px]">
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2.5">{children}</div>
          </SortableContext>
          {!ghost && (
            <div
              aria-hidden={!isEmpty}
              className={cn(
                "pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg border-2 border-dashed text-xs transition-colors",
                isEmpty ? "opacity-100" : "opacity-0",
                isOver ? "border-primary/50 bg-primary/5 text-primary" : "border-border/50 text-muted-foreground",
              )}
            >
              Arrastra tareas aquí
            </div>
          )}
        </div>
        {onAdd && (
          <button
            type="button"
            className="w-full rounded-lg border border-dashed border-border/70 py-2.5 text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
            onClick={onAdd}
          >
            + Añadir
          </button>
        )}
      </div>
    </div>
  );
}
