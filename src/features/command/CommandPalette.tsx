import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "cmdk";
import {
  Package,
  FolderKanban,
  LayoutGrid,
  CheckSquare,
  ListChecks,
  Library,
  Plus,
  Boxes,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useDataStore } from "@/store/useDataStore";
import { ROUTES } from "@/routes/paths";

/** Filas un poco más altas y con más aire horizontal en el panel ancho. */
const itemClass =
  "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm aria-selected:bg-accent hover:bg-accent";

// Re-export for AppLayout to mount
export function CommandPalette() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const products = useDataStore((s) => s.products);
  const projects = useDataStore((s) => s.projects);
  const projectTypes = useDataStore((s) => s.projectTypes);
  const checklistTemplates = useDataStore((s) => s.checklistTemplates);
  const processTemplates = useDataStore((s) => s.processTemplates);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    function down(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  function go(path: string) {
    navigate(path);
    setOpen(false);
  }

  const productMap = Object.fromEntries(products.map((p) => [p.id, p.name]));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        size="lg"
        descriptionless
        // Panel de trabajo: usa el alto de size lg; sin padding del form dialog.
        // min-h-0 en la cadena flex para que CommandList pueda scrollear al llenar.
        className="gap-0 overflow-hidden p-0 sm:min-h-[min(72vh,40rem)]"
      >
      {/* cmdk requires these inner primitives */}
      <Command
        className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border-0 bg-popover text-popover-foreground shadow-none sm:rounded-lg sm:border"
        shouldFilter
      >
        <CommandInput
          placeholder="Buscar o ejecutar acción… (Cmd+K)"
          className="flex h-12 w-full shrink-0 border-b bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        {/* Sin tope artificial de 400px: la lista llena el resto del diálogo. */}
        <CommandList className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-2 sm:max-h-[calc(min(72vh,40rem)-3rem)]">
          <CommandEmpty className="py-10 text-center text-sm text-muted-foreground">
            Sin resultados.
          </CommandEmpty>

          {/* ── Acciones rápidas ── */}
          <CommandGroup heading="Crear">
            <CommandItem
              value="nuevo producto"
              onSelect={() => go(ROUTES.products)}
              className={itemClass}
            >
              <Plus className="size-4 text-muted-foreground" />
              Nuevo producto
            </CommandItem>
            <CommandItem
              value="nuevo proyecto"
              onSelect={() => go(ROUTES.projects)}
              className={itemClass}
            >
              <Plus className="size-4 text-muted-foreground" />
              Nuevo proyecto
            </CommandItem>
            <CommandItem
              value="crear proyecto desde tipo"
              onSelect={() => go(ROUTES.projects)}
              className={itemClass}
            >
              <Boxes className="size-4 text-muted-foreground" />
              Crear proyecto desde tipo
            </CommandItem>
          </CommandGroup>

          <CommandSeparator className="my-1.5 h-px bg-border" />

          {/* ── Páginas ── */}
          <CommandGroup heading="Navegar">
            <CommandItem
              value="dashboard"
              onSelect={() => go(ROUTES.dashboard)}
              className={itemClass}
            >
              <LayoutGrid className="size-4 text-muted-foreground" />
              Dashboard
            </CommandItem>
            <CommandItem
              value="productos"
              onSelect={() => go(ROUTES.products)}
              className={itemClass}
            >
              <Package className="size-4 text-muted-foreground" />
              Productos
            </CommandItem>
            <CommandItem
              value="proyectos"
              onSelect={() => go(ROUTES.projects)}
              className={itemClass}
            >
              <FolderKanban className="size-4 text-muted-foreground" />
              Proyectos
            </CommandItem>
            <CommandItem
              value="biblioteca plantillas tipos"
              onSelect={() => go(ROUTES.library())}
              className={itemClass}
            >
              <Library className="size-4 text-muted-foreground" />
              Biblioteca
            </CommandItem>
          </CommandGroup>

          {projects.length > 0 && (
            <>
              <CommandSeparator className="my-1.5 h-px bg-border" />
              <CommandGroup heading="Proyectos">
                {projects.map((p) => (
                  <CommandItem
                    key={p.id}
                    value={`proyecto ${p.name} ${productMap[p.productId ?? ""] ?? ""}`}
                    onSelect={() => go(ROUTES.project(p.id))}
                    className={itemClass}
                  >
                    <FolderKanban className="size-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate">{p.name}</span>
                    {productMap[p.productId ?? ""] && (
                      <span className="max-w-[40%] shrink-0 truncate text-xs text-muted-foreground">
                        {productMap[p.productId ?? ""]}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {products.length > 0 && (
            <>
              <CommandSeparator className="my-1.5 h-px bg-border" />
              <CommandGroup heading="Productos">
                {products.map((p) => (
                  <CommandItem
                    key={p.id}
                    value={`producto ${p.name}`}
                    onSelect={() => go(ROUTES.projectsByProduct(p.id))}
                    className={itemClass}
                  >
                    <Package className="size-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate">{p.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      ver proyectos
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          {(projectTypes.length > 0 ||
            checklistTemplates.length > 0 ||
            processTemplates.length > 0) && (
            <>
              <CommandSeparator className="my-1.5 h-px bg-border" />
              <CommandGroup heading="Biblioteca">
                {projectTypes.map((t) => (
                  <CommandItem
                    key={t.id}
                    value={`tipo proyecto ${t.name}`}
                    onSelect={() => go(ROUTES.library("types"))}
                    className={itemClass}
                  >
                    <Boxes className="size-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate">{t.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">tipo</span>
                  </CommandItem>
                ))}
                {checklistTemplates.map((t) => (
                  <CommandItem
                    key={t.id}
                    value={`plantilla checklist ${t.name}`}
                    onSelect={() => go(ROUTES.library("checklists"))}
                    className={itemClass}
                  >
                    <CheckSquare className="size-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate">{t.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">checklist</span>
                  </CommandItem>
                ))}
                {processTemplates.map((t) => (
                  <CommandItem
                    key={t.id}
                    value={`plantilla proceso ${t.name}`}
                    onSelect={() => go(ROUTES.library("processes"))}
                    className={itemClass}
                  >
                    <ListChecks className="size-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate">{t.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">proceso</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
      </DialogContent>
    </Dialog>
  );
}
