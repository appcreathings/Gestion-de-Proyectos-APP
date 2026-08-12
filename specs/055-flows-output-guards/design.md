# Design 055 — Guardas por salida

Anclado a `engine.ts` loop de outputs (~352+) y `OutputSchema` discriminatedUnion.
Bump real: **SCHEMA_VERSION 19 → 20** (identidad), salvo que otra spec (051/056) lo
introduzca primero en la misma tanda.

---

## 1. Schema

Añadir a **cada** miembro del union (vía `.extend` o helper):

```ts
export const OutputWhenSchema = z.object({
  conditions: z.array(FlowConditionSchema).default([]),
  conditionMode: z.enum(["all", "any"]).optional(), // ausente = "all"
});
export type OutputWhen = z.infer<typeof OutputWhenSchema>;

// En cada *OutputSchema:
when: OutputWhenSchema.optional(),
```

Helper recomendado para no repetir 9 veces a mano:

```ts
function withOutputWhen<T extends z.ZodRawShape>(shape: T) {
  return z.object({ ...shape, when: OutputWhenSchema.optional() });
}
// Cuidado: discriminatedUnion necesita z.object con `type` literal en cada variante.
// Patrón seguro: CreateTaskOutputSchema.extend({ when: OutputWhenSchema.optional() })
```

Migración: `{ to: 20, up: (d) => d }` en `flows` (+ kinds que compartan el número global).

`defaultOutputForType` / factories: no setear `when` (undefined).

`compileGraphToRule` / `buildGraphFromRule`: el `when` viaja dentro de `output` en node data —
verificar que el grafo no lo strippee al serializar (hoy `data.output` es el output completo).

---

## 2. Motor

En el loop, **antes** del bloque retry/`executeOutput`:

```ts
const when = output.when;
if (when && when.conditions.length > 0) {
  const mode = when.conditionMode ?? "all";
  const { passed, details } = evaluateConditionsDetailed(when.conditions, transformed, mode);
  if (!passed) {
    recordTrace?.outputs.push({
      type: output.type,
      outcome: "skipped",
      reason: "Omitido — guarda del paso no cumplida",
      mutatedProjectIds: [],
      // opcional: guardDetails: details para debugger
    });
    continue;
  }
}
```

- Evaluar sobre **`transformed`** (post-mapping/transform), igual que condiciones globales usan el record post-map en su etapa — coherente con campos disponibles en acciones.
- Condiciones globales ya corrieron; si fallaron, este código no se alcanza.
- `describeOutputs` / dry-run: mismo camino (skipped sin efecto).

**No** contar skip de guarda como error de flujo (`result.errors`).

Exportar o reutilizar `evaluateConditionsDetailed` si hoy es private — ya es function en el módulo; los tests del engine cubren el comportamiento vía `runFlowEngine`.

---

## 3. UI

### 3.1 `ActionConfigFields`

Al final del panel (todos los `case` del switch, o wrapper común **después** del switch):

```tsx
<OutputWhenEditor
  when={output.when}
  onChange={(when) => onChange({ when })}
  variables={...} // mismos campos que condiciones del canvas
/>
```

`OutputWhenEditor`: disclosure “Solo ejecutar si…”, lista de `ConditionConfigFields`, toggle all/any copiado del modo global (027).

### 3.2 Resumen del nodo

`meta.ts` / action summary: si `output.when?.conditions?.length`, sufijo “ · con guarda” o icono Filter.

### 3.3 Traza

`FlowRunTraceView` ya pinta `skipped`+`reason` — verificar string; si hay i18n hardcode, unificar.

---

## 4. Tests

| Caso | Esperado |
|------|----------|
| output con when que no pasa | skipped, sin mutaciones |
| output con when que pasa | executed |
| sin when | executed (retrocompat) |
| when.conditions [] | executed |
| conditionMode any: una de dos true | executed |
| global conditions fail | ningún output (como hoy) |
| onErrorPolicy stop + skip guarda | no detiene (solo errores) |
| parse flow viejo sin when | ok schema v20 identidad |

---

## 5. Riesgos

| Riesgo | Mitigación |
|--------|------------|
| Olvidar `.extend` en un output type | typecheck + test union exhaustivo |
| Evaluar sobre record pre-transform | documentar: post-transform |
| UI duplica editor de condiciones con bugs | reusar `ConditionConfigFields` |
