import { describe, it, expect } from "vitest";
import { nodeConfigDialogSize } from "./nodeConfigDialog";
import type { FlowNodeKind } from "@/flows/graph";
import type { DialogSize } from "@/components/ui/dialog";

describe("nodeConfigDialogSize", () => {
  const cases: Array<{ kind: FlowNodeKind; size: DialogSize }> = [
    { kind: "condition", size: "md" },
    { kind: "trigger", size: "xl" },
    { kind: "transform", size: "xl" },
    { kind: "action", size: "xl" },
  ];

  it.each(cases)("kind $kind → size $size", ({ kind, size }) => {
    expect(nodeConfigDialogSize(kind)).toBe(size);
  });
});
