import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onClick: () => void;
}

export function QuickAddButton({ onClick }: Props) {
  return (
    <Button
      onClick={onClick}
      size="icon"
      className="fixed bottom-6 right-6 z-40 size-14 rounded-full shadow-lg lg:bottom-8 lg:right-8"
      aria-label="Crear tarea rápida"
    >
      <Plus className="size-6" />
    </Button>
  );
}
