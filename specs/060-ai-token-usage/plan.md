# AI Token Usage (spec 060) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every assistant `streamTurn` and RAG embedding auditable with real (or estimated) tokens, count one request per round, skip embeddings when RAG is stale, send a screen-focused workspace index when RAG is fresh, and show usage on an assistant chip plus a Settings card.

**Architecture:** Pure modules under `src/ai/usage/` (parse, prune, aggregate, format) and `src/ai/chat/` (ragPolicy, workspaceIndex, toolResultCompact) feed `runAgentTurn` + `useChatStore.send()`. A Zustand store (`useAiUsageStore`) persists events to IndexedDB key `aiUsage:events`. UI reads the store; `RateLimitStatus` stays and starts using real token counts from `recordRequest`.

**Tech Stack:** Vite + React + Zustand + Vitest + IndexedDB (`idbGet`/`idbSet` in `src/storage/idb.ts`) + existing Gemini / OpenAI-compatible providers. No new npm dependencies. No `SCHEMA_VERSION` bump.

**Spec:** `specs/060-ai-token-usage/spec.md` and `specs/060-ai-token-usage/design.md`. Executors must read both before Task 1.

## Global Constraints

- No new npm dependencies.
- No `SCHEMA_VERSION` bump; usage lives in IndexedDB (`aiUsage:events`), never in `workspace.json`.
- Do not filter the tool catalog (spec D10). Do not change `MAX_ROUNDS = 8` or `AGENT_HISTORY_WINDOW = 12`.
- Do not audit `improve.ts` or `generate-transform.ts`.
- Do not persist the query-embedding LRU to IDB.
- Fail-open: usage/RAG helper failures must not fail the chat turn (spec D17, CA-07.*).
- Copy in Spanish as specified in the spec. Commit messages: `feat(ai): … (spec 060)` (Spanish body, same style as spec 050).
- Tests: `npx vitest run <file>`. Typecheck at checkpoints: `npm run typecheck`.
- Windows / PowerShell: no `&&` chaining in the shell tool; sequential steps are separate commands. In the plan, `git add` then `git commit` may be written as one block for the executor.

---

## File structure (lock this)

| File | Responsibility |
|------|----------------|
| `src/ai/usage/types.ts` | `TokenUsage`, `UsageEvent`, `TurnUsageView`, skip-reason unions |
| `src/ai/usage/parseUsage.ts` | Gemini/OpenAI parse + char estimate |
| `src/ai/usage/prune.ts` | 14-day / 500-event ring buffer |
| `src/ai/usage/aggregate.ts` | Day / turn / by-model totals |
| `src/ai/usage/format.ts` | Chip label `N req · 4.2k tok` |
| `src/ai/usage/idb.ts` | Load/save `aiUsage:events` |
| `src/ai/chat/ragPolicy.ts` | `shouldAutoRag`, `shouldFocusIndex` |
| `src/ai/chat/workspaceIndex.ts` | `selectWorkspaceIndex` |
| `src/ai/chat/toolResultCompact.ts` | Truncate `role:"tool"` results for the *next* send |
| `src/ai/rag/queryCache.ts` | In-memory LRU 50 |
| `src/store/useAiUsageStore.ts` | Session totals, `lastTurn`, persist |
| `src/features/settings/AiUsageCard.tsx` | Settings `#uso` |
| `src/features/assistant/TurnUsageChip.tsx` | Header chip + Popover |
| Modify `src/ai/providers/types.ts` | `StreamTurnResult.usage?` |
| Modify `src/ai/providers/gemini/streamTurn.ts` | Last `usageMetadata` |
| Modify `src/ai/providers/openai-compatible/mapping.ts` | Parse `usage` from SSE JSON |
| Modify `src/ai/providers/openai-compatible/index.ts` | `stream_options.include_usage` + 400 retry |
| Modify `src/ai/agent/runAgentTurn.ts` | `recordRequest` per successful round; return `rounds` + `usages` |
| Modify `src/ai/gemini/systemPrompt.ts` | Evidence block; omit empty index sections when focused |
| Modify `src/ai/rag/search.ts` | Cache around `embedText` |
| Modify `src/store/useChatStore.ts` | Orchestrate turnId, policy, compact, record |
| Modify `src/features/settings/SettingsPage.tsx` | Mount card under RAG |
| Modify `src/features/settings/RagSettingsCard.tsx` | Partial hint (CA-02.7) |
| Modify `src/features/assistant/AssistantPanel.tsx` | Mount chip |

---

### Task 1: TokenUsage types + parseUsage

**Files:**
- Create: `src/ai/usage/types.ts`
- Create: `src/ai/usage/parseUsage.ts`
- Test: `src/ai/usage/parseUsage.test.ts`

**Interfaces:**
- Consumes: nothing
- Produces:
  - `export type UsageSource = "provider" | "estimated"`
  - `export type UsageKind = "chat" | "embedding"`
  - `export type RagSkipReason = "continuation" | "slash" | "stale" | "disabled" | "cache-hit" | "error" | "no-key"`
  - `export interface TokenUsage { inputTokens: number; outputTokens: number; totalTokens: number; source: UsageSource }`
  - `export function parseGeminiUsage(meta: unknown): TokenUsage | null`
  - `export function parseOpenAiUsage(usage: unknown): TokenUsage | null`
  - `export function estimateTokensFromChars(chars: number): number` → `Math.max(1, Math.ceil(chars / 4))`
  - `export function estimateTurnUsage(input: { systemInstruction: string; historyJson: string; userMessage: string; outputText: string }): TokenUsage`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import {
  parseGeminiUsage,
  parseOpenAiUsage,
  estimateTokensFromChars,
  estimateTurnUsage,
} from "./parseUsage";

describe("parseGeminiUsage", () => {
  it("maps prompt/candidates/total (CA-01.1)", () => {
    expect(
      parseGeminiUsage({
        promptTokenCount: 100,
        candidatesTokenCount: 20,
        totalTokenCount: 120,
      }),
    ).toEqual({
      inputTokens: 100,
      outputTokens: 20,
      totalTokens: 120,
      source: "provider",
    });
  });

  it("sums in+out when total is missing", () => {
    expect(
      parseGeminiUsage({ promptTokenCount: 10, candidatesTokenCount: 5 }),
    ).toMatchObject({ totalTokens: 15, source: "provider" });
  });

  it("accepts legitimate 0/0/0", () => {
    expect(
      parseGeminiUsage({
        promptTokenCount: 0,
        candidatesTokenCount: 0,
        totalTokenCount: 0,
      }),
    ).toMatchObject({ totalTokens: 0, source: "provider" });
  });

  it("returns null for garbage", () => {
    expect(parseGeminiUsage(null)).toBeNull();
    expect(parseGeminiUsage({ promptTokenCount: "x" })).toBeNull();
  });
});

describe("parseOpenAiUsage", () => {
  it("maps prompt_tokens / completion_tokens (CA-01.2)", () => {
    expect(
      parseOpenAiUsage({
        prompt_tokens: 80,
        completion_tokens: 12,
        total_tokens: 92,
      }),
    ).toEqual({
      inputTokens: 80,
      outputTokens: 12,
      totalTokens: 92,
      source: "provider",
    });
  });

  it("returns null when usage is missing", () => {
    expect(parseOpenAiUsage(undefined)).toBeNull();
  });
});

describe("estimateTokensFromChars", () => {
  it("ceil chars/4 with min 1 (CA-01.3)", () => {
    expect(estimateTokensFromChars(0)).toBe(1);
    expect(estimateTokensFromChars(4)).toBe(1);
    expect(estimateTokensFromChars(5)).toBe(2);
  });
});

describe("estimateTurnUsage", () => {
  it("marks source estimated and splits in/out", () => {
    const u = estimateTurnUsage({
      systemInstruction: "aaaa",
      historyJson: "bbbb",
      userMessage: "cccc",
      outputText: "dddd",
    });
    expect(u.source).toBe("estimated");
    expect(u.inputTokens).toBe(estimateTokensFromChars(12));
    expect(u.outputTokens).toBe(estimateTokensFromChars(4));
    expect(u.totalTokens).toBe(u.inputTokens + u.outputTokens);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/ai/usage/parseUsage.test.ts`

Expected: FAIL — module not found.

- [ ] **Step 3: Write minimal implementation**

`types.ts`: export the unions and `TokenUsage` as in design.md §1 (also export empty `UsageEvent` / `TurnUsageView` now so later tasks do not reshape them):

```ts
export type UsageSource = "provider" | "estimated";
export type UsageKind = "chat" | "embedding";
export type RagSkipReason =
  | "continuation"
  | "slash"
  | "stale"
  | "disabled"
  | "cache-hit"
  | "error"
  | "no-key";

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  source: UsageSource;
}

export interface UsageEvent {
  id: string;
  ts: string;
  turnId: string;
  kind: UsageKind;
  provider: string;
  modelId: string;
  requests: number;
  rounds?: number;
  usage: TokenUsage;
  rag?: {
    attempted: boolean;
    injected: boolean;
    skipReason?: RagSkipReason;
    indexFocused: boolean;
    hits: number;
  };
}

export interface TurnUsageView {
  turnId: string;
  requests: number;
  rounds: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimated: boolean;
  rag?: UsageEvent["rag"];
}
```

`parseUsage.ts`: a local `asFiniteNumber(v)` helper; Gemini reads `promptTokenCount` / `candidatesTokenCount` / `totalTokenCount`; OpenAI reads `prompt_tokens` / `completion_tokens` / `total_tokens`. Missing total → in+out. Non-numeric or non-object → `null`. `estimateTurnUsage` concatenates `systemInstruction + historyJson + userMessage` for input chars.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/ai/usage/parseUsage.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```
git add src/ai/usage/types.ts src/ai/usage/parseUsage.ts src/ai/usage/parseUsage.test.ts
git commit -m "feat(ai): parseo de usage Gemini y OpenAI (spec 060)"
```

---

### Task 2: OpenAI SSE — capture `usage` on usage-only chunks

**Files:**
- Modify: `src/ai/providers/openai-compatible/mapping.ts`
- Modify: `src/ai/providers/openai-compatible/mapping.test.ts`
- Consumes: `parseOpenAiUsage` from Task 1
- Produces:
  - `export function parseOpenAiUsageField(raw: string): unknown | null` — JSON.parse, return `json.usage` if present
  - Existing `parseOpenAiChunk` **must keep current behavior** (delta-only; usage-only events still return `null` for delta)

Today `parseOpenAiChunk` returns `null` when `choices[0].delta` is missing, so the OpenAI usage trailer is dropped. Do not change that return; add a sibling parser.

- [ ] **Step 1: Write the failing test** (append to `mapping.test.ts`)

```ts
import { parseOpenAiUsageField } from "./mapping";

describe("parseOpenAiUsageField (spec 060)", () => {
  it("reads usage on a trailer chunk with empty choices", () => {
    const raw = JSON.stringify({
      choices: [],
      usage: { prompt_tokens: 11, completion_tokens: 2, total_tokens: 13 },
    });
    expect(parseOpenAiUsageField(raw)).toEqual({
      prompt_tokens: 11,
      completion_tokens: 2,
      total_tokens: 13,
    });
  });

  it("returns null when usage is absent or JSON is broken", () => {
    expect(parseOpenAiUsageField("{\"choices\":[{}]}")).toBeNull();
    expect(parseOpenAiUsageField("not-json")).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/ai/providers/openai-compatible/mapping.test.ts`

Expected: FAIL — `parseOpenAiUsageField` is not exported.

- [ ] **Step 3: Write minimal implementation**

```ts
export function parseOpenAiUsageField(raw: string): unknown | null {
  try {
    const json = JSON.parse(raw) as { usage?: unknown };
    return json.usage ?? null;
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/ai/providers/openai-compatible/mapping.test.ts`

Expected: PASS (existing `toOpenAiMessages` / `parseOpenAiChunk` tests still green).

- [ ] **Step 5: Commit**

```
git add src/ai/providers/openai-compatible/mapping.ts src/ai/providers/openai-compatible/mapping.test.ts
git commit -m "feat(ai): extrae usage del SSE OpenAI-compatible (spec 060)"
```

---

### Task 3: StreamTurnResult.usage + Gemini + OpenAI adapters

**Files:**
- Modify: `src/ai/providers/types.ts` — add `usage?: TokenUsage` to `StreamTurnResult`
- Modify: `src/ai/providers/gemini/streamTurn.ts` — keep last `chunk.usageMetadata`, set `usage: parseGeminiUsage(meta) ?? undefined`
- Modify: `src/ai/providers/openai-compatible/index.ts` — add `stream_options: { include_usage: true }`; on each SSE data, `parseOpenAiUsage(parseOpenAiUsageField(data))`; attach to result
- Modify: `src/ai/providers/openai-compatible/index.ts` — if POST returns 400 and body matches `/stream_options/i`, retry **once** without `stream_options` and leave `usage` undefined
- Test: `src/ai/providers/openai-compatible/index.usage.test.ts` (mock `fetch` + `consumeSseStream` is heavy; instead unit-test a extracted `buildChatCompletionsBody(includeUsage: boolean)` **or** test the 400 retry via a small exported helper)

Keep this testable without the Gemini SDK: extract body builder.

**Interfaces:**
- Consumes: `TokenUsage`, `parseGeminiUsage`, `parseOpenAiUsage`, `parseOpenAiUsageField`
- Produces: `StreamTurnResult.usage?: TokenUsage`
- Produces: `export function buildOpenAiChatBody(input: { model: string; messages: unknown; tools?: unknown; includeUsage: boolean }): Record<string, unknown>`

- [ ] **Step 1: Write the failing test**

Create `src/ai/providers/openai-compatible/body.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildOpenAiChatBody } from "./index";

describe("buildOpenAiChatBody (spec 060 D23)", () => {
  it("includes stream_options.include_usage when asked", () => {
    const body = buildOpenAiChatBody({
      model: "gpt-x",
      messages: [],
      includeUsage: true,
    });
    expect(body.stream).toBe(true);
    expect(body.stream_options).toEqual({ include_usage: true });
  });

  it("omits stream_options when includeUsage is false (retry path)", () => {
    const body = buildOpenAiChatBody({
      model: "gpt-x",
      messages: [],
      includeUsage: false,
    });
    expect(body.stream_options).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/ai/providers/openai-compatible/body.test.ts`

Expected: FAIL — `buildOpenAiChatBody` not exported.

- [ ] **Step 3: Write minimal implementation**

1. Add `usage?: TokenUsage` to `StreamTurnResult` in `types.ts` (import type from `@/ai/usage/types`).
2. Export `buildOpenAiChatBody` from `index.ts` and use it in `streamTurn`. First POST uses `includeUsage: true`. On `!res.ok && res.status === 400`, read text; if `/stream_options/i.test(text)`, POST again with `includeUsage: false`. Parse SSE as today plus usage field.
3. In `geminiStreamTurn`, `let lastMeta: unknown`; inside the loop `if (chunk.usageMetadata) lastMeta = chunk.usageMetadata`; return `{ text, toolCalls, usage: parseGeminiUsage(lastMeta) ?? undefined }`.

Also add a helper used by the 400 path:

```ts
export function shouldRetryWithoutStreamOptions(status: number, bodyText: string): boolean {
  return status === 400 && /stream_options/i.test(bodyText);
}
```

Add one test for that helper in `body.test.ts`.

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/ai/providers/openai-compatible/body.test.ts src/ai/providers/openai-compatible/mapping.test.ts src/ai/providers/gemini/streamTurn.split.test.ts`

Expected: PASS. Existing fake providers in `runAgentTurn.test.ts` that return `{ text, toolCalls }` remain valid because `usage` is optional.

- [ ] **Step 5: Commit**

```
git add src/ai/providers/types.ts src/ai/providers/gemini/streamTurn.ts src/ai/providers/openai-compatible/index.ts src/ai/providers/openai-compatible/body.test.ts
git commit -m "feat(ai): usage en StreamTurnResult Gemini y OpenAI (spec 060)"
```

---

### Task 4: runAgentTurn — one recordRequest per successful round

**Files:**
- Modify: `src/ai/agent/runAgentTurn.ts`
- Modify: `src/ai/agent/runAgentTurn.test.ts`
- Consumes: `estimateTurnUsage`, `TokenUsage`, `StreamTurnResult.usage`
- Produces: `AgentTurnResult` gains `rounds: number` and `usages: TokenUsage[]`
- Early returns (no-model-selected, all-models-exhausted **before** any ok stream) set `rounds: 0`, `usages: []`
- Remove `recordRequest` from the two terminal returns (current lines ~151 and ~199)
- After a successful `provider.streamTurn` inside `attemptTurn`: compute `usage = result.usage ?? estimateTurnUsage({ systemInstruction: opts.systemInstruction, historyJson: JSON.stringify(history), userMessage: opts.userMessage, outputText: result.text })` then `rateLimiter.recordRequest(qualifiedModelId, usage.totalTokens)`; push usage; increment a `successfulRounds` counter in the outer closure
- Do **not** `recordRequest` on thrown `streamTurn` (rate-limit / quota). `markSaturated` stays as today.

**Interfaces:**
- Produces: `AgentTurnResult { history, roundsExceeded, error?, rawMessage?, modelSwitch?, rounds: number, usages: TokenUsage[] }`

- [ ] **Step 1: Write the failing test** (append to `runAgentTurn.test.ts`)

```ts
describe("runAgentTurn — accounting por ronda (spec 060 D4 / CA-01.4)", () => {
  it("registra 2 recordRequest en 1 tool-round + 1 texto final", async () => {
    const { provider } = makeFakeProvider([
      {
        kind: "ok-tools",
        toolCalls: [{ id: "c1", name: "list_projects", args: {} }],
      },
      { kind: "ok-text", text: "listo" },
    ]);
    const before = rateLimiter.getStatus("gemini:gemini-2.5-flash").rpmUsed;
    const result = await runAgentTurn(
      baseOpts(provider, {
        tools: [
          {
            name: "list_projects",
            mode: "read",
            description: "",
            input: { safeParse: () => ({ success: true, data: {} }) },
            execute: async () => ({ ok: true }),
          } as never,
        ],
      }),
    );
    expect(result.error).toBeUndefined();
    expect(result.rounds).toBe(2);
    expect(result.usages.length).toBe(2);
    expect(rateLimiter.getStatus("gemini:gemini-2.5-flash").rpmUsed).toBe(before + 2);
  });

  it("no incrementa rpmUsed cuando todos los streamTurn lanzan rate-limit", async () => {
    const { provider } = makeFakeProvider([
      { kind: "rate-limit" },
      { kind: "rate-limit" },
      { kind: "rate-limit" },
      { kind: "rate-limit" },
    ]);
    const before = rateLimiter.getStatus("gemini:gemini-2.5-flash").rpmUsed;
    const result = await runAgentTurn(baseOpts(provider));
    expect(result.error).toBe("all-models-exhausted");
    expect(result.rounds).toBe(0);
    expect(rateLimiter.getStatus("gemini:gemini-2.5-flash").rpmUsed).toBe(before);
  });
});
```

Look at how existing tests declare tools — if `callTool` needs a real `AiTool`, copy the pattern from this file or from `tools.test.ts`. If the first new test is awkward because `executeCall` needs a full tool, simplify: mock `ok-tools` with `tools: []` will return an error result to the model and still do a second round if the fake sequence has `ok-text`. Empty tools + ok-tools still increments two successful streamTurns. **Prefer that** to avoid inventing a tool:

```ts
const { provider } = makeFakeProvider([
  { kind: "ok-tools", toolCalls: [{ id: "c1", name: "missing", args: {} }] },
  { kind: "ok-text", text: "listo" },
]);
```

Unknown tool still appends a tool message and loops. Two successful streams.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/ai/agent/runAgentTurn.test.ts`

Expected: FAIL — `result.rounds` is undefined and rpmUsed increases by 1 (old single `recordRequest`).

- [ ] **Step 3: Write minimal implementation**

In `runAgentTurn.ts`:
- `let successfulRounds = 0; const usages: TokenUsage[] = [];`
- In `attemptTurn` success path, after `streamTurn` returns, estimate if needed, `recordRequest`, push, `successfulRounds++`.
- Delete the two terminal `rateLimiter.recordRequest(...)` calls.
- Every `return { history, ... }` includes `rounds: successfulRounds, usages`.

Fake provider in tests can optionally return `usage: { inputTokens: 10, outputTokens: 2, totalTokens: 12, source: "provider" }` on ok results — then assert `result.usages[0].source === "provider"` in one extra `it`. Add that `it` in the same describe.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/ai/agent/runAgentTurn.test.ts`

Expected: PASS, including T3123 fallback tests.

- [ ] **Step 5: Commit**

```
git add src/ai/agent/runAgentTurn.ts src/ai/agent/runAgentTurn.test.ts
git commit -m "feat(ai): una request por ronda ReAct en el rate limiter (spec 060)"
```

---

### Task 5: prune, aggregate, format (pure)

**Files:**
- Create: `src/ai/usage/prune.ts`
- Create: `src/ai/usage/aggregate.ts`
- Create: `src/ai/usage/format.ts`
- Test: `src/ai/usage/prune.test.ts`, `src/ai/usage/aggregate.test.ts`, `src/ai/usage/format.test.ts`

**Interfaces:**
- Consumes: `UsageEvent`, `TurnUsageView`
- Produces:
  - `export const USAGE_MAX_EVENTS = 500`
  - `export const USAGE_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000`
  - `export function pruneEvents(events: UsageEvent[], now?: number): UsageEvent[]`
  - `export function localDateKey(d: Date): string` // local YYYY-MM-DD
  - `export function aggregateTurn(events: UsageEvent[], turnId: string): TurnUsageView | null`
  - `export function aggregateDay(events: UsageEvent[], day: string, includeEstimated: boolean): { requests: number; inputTokens: number; outputTokens: number; byModel: Record<string, { requests: number; inputTokens: number; outputTokens: number }> }`
  - `export function formatTokenCount(n: number): string`
  - `export function formatTurnChip(input: { requests: number; tokens: number; estimated: boolean }): { label: string; ariaLabel: string }`

- [ ] **Step 1: Write the failing tests**

`format.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { formatTokenCount, formatTurnChip } from "./format";

describe("formatTurnChip (CA-05.1, CA-05.2, CA-05.5)", () => {
  it("formats thousands with k", () => {
    expect(formatTokenCount(850)).toBe("850");
    expect(formatTokenCount(4200)).toBe("4.2k");
    expect(formatTokenCount(12000)).toBe("12k");
  });

  it("tilde only when estimated", () => {
    expect(formatTurnChip({ requests: 2, tokens: 4200, estimated: false })).toEqual({
      label: "2 req · 4.2k tok",
      ariaLabel: "Este turno: 2 requests, 4200 tokens",
    });
    expect(formatTurnChip({ requests: 2, tokens: 4200, estimated: true }).label).toBe(
      "2 req · ~4.2k tok",
    );
  });
});
```

`prune.test.ts`: build 3 events dated now, 15 days ago, and 501 recent ones; expect drop of the 15-day event; expect length 500 keeping the newest.

`aggregate.test.ts`: two events same `turnId` (chat `rounds: 2` requests 2 + embedding requests 1) → `aggregateTurn` requests 3, `rounds: 2`, estimated true if either is estimated; `aggregateDay` ignores other days and estimated when `includeEstimated` is false.

Helper for events:

```ts
function ev(over: Partial<UsageEvent> & Pick<UsageEvent, "id" | "turnId" | "kind">): UsageEvent {
  return {
    ts: new Date().toISOString(),
    provider: "gemini",
    modelId: "gemini:gemini-2.5-flash",
    requests: 1,
    usage: { inputTokens: 10, outputTokens: 2, totalTokens: 12, source: "provider" },
    ...over,
  };
}
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/ai/usage/format.test.ts src/ai/usage/prune.test.ts src/ai/usage/aggregate.test.ts`

Expected: FAIL — modules missing.

- [ ] **Step 3: Write minimal implementation**

`pruneEvents`: filter `Date.parse(e.ts) >= now - USAGE_MAX_AGE_MS`; sort ascending by ts; `slice(-USAGE_MAX_EVENTS)`.

`aggregateTurn`: filter by turnId; if empty return null; sum requests and tokens; `estimated = some(e => e.usage.source === "estimated")`; `rounds` from the chat event's `rounds ?? 0`; `rag` from the `kind === "chat"` event if any.

`aggregateDay`: filter `localDateKey(new Date(e.ts)) === day`; if `!includeEstimated` drop `source === "estimated"`; reduce totals and `byModel[modelId]`.

`formatTokenCount`: `< 1000` integer string; else `(n/1000)` with 1 decimal if `< 10k` else 0 decimals, strip trailing `.0`, suffix `k`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/ai/usage`

Expected: PASS (includes Task 1 tests).

- [ ] **Step 5: Commit**

```
git add src/ai/usage
git commit -m "feat(ai): prune, agregados y formato de uso (spec 060)"
```

---

### Task 6: IndexedDB + useAiUsageStore

**Files:**
- Create: `src/ai/usage/idb.ts`
- Create: `src/store/useAiUsageStore.ts`
- Test: `src/ai/usage/idb.test.ts` (prune-on-save, using mocked `idbGet`/`idbSet`)
- Test: `src/store/useAiUsageStore.test.ts`

**Interfaces:**
- Consumes: `UsageEvent`, `TurnUsageView`, `pruneEvents`, `aggregateTurn`
- Produces:
  - `export const IDB_USAGE_EVENTS = "aiUsage:events"`
  - `export async function loadEvents(): Promise<UsageEvent[]>`
  - `export async function saveEvents(events: UsageEvent[]): Promise<void>` — prune then `idbSet`
  - Store:

```ts
export interface UsageSession {
  requests: number;
  inputTokens: number;
  outputTokens: number;
}

interface AiUsageState {
  events: UsageEvent[];
  session: UsageSession;
  lastTurn: TurnUsageView | null;
  includeEstimated: boolean;
  loaded: boolean;
  hydrate: () => Promise<void>;
  record: (event: UsageEvent) => Promise<void>;
  clear: () => Promise<void>;
  setIncludeEstimated: (v: boolean) => void;
  exportEvents: () => UsageEvent[];
}
```

- `includeEstimated` key: `localStorage` `hito:aiUsage:includeEstimated`, default `true`.
- `record`: append → prune → set `events`; add event's requests/tokens to `session` **even if later IDB write throws**; recompute `lastTurn = aggregateTurn(events, event.turnId)`; `saveEvents` in try/catch (swallow).
- `clear`: `idbDel(IDB_USAGE_EVENTS)` (or `saveEvents([])`); `events = []`; `lastTurn = null`; **do not** zero `session`.
- `exportEvents`: return `events` as-is (no keys, no chat text — events already have only metadata).

- [ ] **Step 1: Write the failing tests**

Mock `@/storage/idb` with an in-memory Map in both test files (same pattern as `useChatStore.ragFallback.test.ts`).

`useAiUsageStore.test.ts` cases:
1. `record` two events same turnId → `lastTurn.requests` is the sum; `session.requests` is the sum.
2. `saveEvents` mock rejects → `record` still updates `session` and `events` in memory (CA-07.1).
3. `clear` empties `events` and `lastTurn` but leaves `session.requests` unchanged (CA-06.6).
4. `setIncludeEstimated(false)` persists to localStorage (read the key).

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/store/useAiUsageStore.test.ts`

Expected: FAIL — store not found.

- [ ] **Step 3: Write minimal implementation**

`idb.ts` uses `idbGet`/`idbSet`/`idbDel` from `@/storage/idb`. `loadEvents` returns `[]` if missing/corrupt (try/catch, fail-open).

Store created with `create(...)`. `hydrate` is idempotent (`if (loaded) return` after first success; still OK to re-read). Default `session: { requests: 0, inputTokens: 0, outputTokens: 0 }`.

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/store/useAiUsageStore.test.ts src/ai/usage/idb.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```
git add src/ai/usage/idb.ts src/ai/usage/idb.test.ts src/store/useAiUsageStore.ts src/store/useAiUsageStore.test.ts
git commit -m "feat(ai): store e IndexedDB de uso de tokens (spec 060)"
```

---

### Task 7: ragPolicy (pure)

**Files:**
- Create: `src/ai/chat/ragPolicy.ts`
- Test: `src/ai/chat/ragPolicy.test.ts`

**Interfaces:**
- Consumes: `RagStatus` from `@/ai/rag/types`, `RagSkipReason` from `@/ai/usage/types`
- Produces:

```ts
export function shouldFocusIndex(input: {
  ragEnabled: boolean;
  status: RagStatus;
  entityCount: number;
}): boolean;

export function shouldAutoRag(input: {
  ragEnabled: boolean;
  status: RagStatus;
  entityCount: number;
  skip: false | "slash" | "continuation";
  hasGeminiKey: boolean;
}): { auto: boolean; skipReason?: RagSkipReason };
```

Rules (spec D6–D9, D8 includes `indexing`):
- `shouldFocusIndex` true iff `ragEnabled && status === "up-to-date" && entityCount > 0`
- `shouldAutoRag`: if `skip` is `"slash"` / `"continuation"` → `{ auto: false, skipReason: skip }`; else if `!ragEnabled` → `disabled`; else if `!hasGeminiKey` → `no-key`; else if `status !== "up-to-date" || entityCount <= 0` → `stale` (covers partial/idle/error/indexing); else `{ auto: true }`

- [ ] **Step 1: Write the failing test** — table-driven `it.each` covering: fresh+no skip → auto true, focus true; fresh+slash → auto false skipReason slash, focus still true (focus is a separate function); partial → auto false stale, focus false; ragEnabled false → disabled, focus false; indexing → stale; entityCount 0 → stale/focus false; no key → no-key.

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/ai/chat/ragPolicy.test.ts`

Expected: FAIL — module missing.

- [ ] **Step 3: Write minimal implementation** (exact bodies from design.md §5, with `skip` replacing the boolean+caller split).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/ai/chat/ragPolicy.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```
git add src/ai/chat/ragPolicy.ts src/ai/chat/ragPolicy.test.ts
git commit -m "feat(ai): política RAG fresco vs stale (spec 060)"
```

---

### Task 8: selectWorkspaceIndex + systemPrompt evidence / omit empty

**Files:**
- Create: `src/ai/chat/workspaceIndex.ts`
- Test: `src/ai/chat/workspaceIndex.test.ts`
- Modify: `src/ai/gemini/systemPrompt.ts`
- Modify: `src/ai/gemini/systemPrompt.test.ts`

**Interfaces:**
- Consumes: `WorkspaceIndex` from `@/domain/schemas`, `UiContext` from `@/ai/chat/uiContext`
- Produces: `export function selectWorkspaceIndex(index: WorkspaceIndex, uiCtx: UiContext): WorkspaceIndex`
- Produces: `buildSystemPrompt(workspace, ragContext, today, screenContextBlock, options?: { omitEmptyIndexSections?: boolean })`
- Evidence block (verbatim from design.md §6) inserted after `ragContext` and before `## Estilo` **only when `ragContext` is non-empty**.
- When `omitEmptyIndexSections === true`, skip a section whose joined lines are empty (no header, no `(ninguno)` / `(ninguna)`). When `workspace === null` or flag false, keep current `(ninguno)` placeholders (CA-03.6).

Index table (spec §5):

| uiCtx | keep |
|-------|------|
| `task` / `project` | that project row + parent product if `productId` matches `index.products` |
| `section: products` | products only |
| `section: projects` | projects only |
| `section: library` | types + templates + processTemplates |
| `dashboard` / `my-tasks` / `daily` / `none` | projects + products |
| any other section | projects + products |

Omitted collections are **empty arrays** (do not mutate the input object; return a new index).

- [ ] **Step 1: Write the failing tests**

`workspaceIndex.test.ts`: fixture `emptyWorkspace().index` plus two projects `Alpha`/`Beta`, one product `Prod`, templates. `kind: "project"` for Alpha → result.projects names `["Alpha"]` only, products `[Prod]` if productId set, templates `[]`. Dashboard → both projects, templates `[]`.

`systemPrompt.test.ts` add:
- with non-empty ragContext, prompt contains `## Prioridad de evidencia` and it sits before `## Estilo`
- with empty ragContext, prompt does **not** contain `Prioridad de evidencia`
- `omitEmptyIndexSections: true` and index with empty templates: prompt does **not** contain `Plantillas de checklist`
- `buildSystemPrompt(null, ...)` still contains `(ninguno)` (existing test must remain green)

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/ai/chat/workspaceIndex.test.ts src/ai/gemini/systemPrompt.test.ts`

Expected: FAIL on new cases; existing systemPrompt tests still define current behavior.

- [ ] **Step 3: Write minimal implementation**

Do not copy the input index; always return a fresh `WorkspaceIndex` with empty defaults from `emptyWorkspace().index` then fill kept arrays.

Refactor the index markdown in `buildSystemPrompt` into a small `renderSection(title, body, emptyPlaceholder, omitEmpty)` so CA-03.6 is one flag.

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/ai/chat/workspaceIndex.test.ts src/ai/gemini/systemPrompt.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```
git add src/ai/chat/workspaceIndex.ts src/ai/chat/workspaceIndex.test.ts src/ai/gemini/systemPrompt.ts src/ai/gemini/systemPrompt.test.ts
git commit -m "feat(ai): índice de workspace recortado al foco (spec 060)"
```

---

### Task 9: query embedding LRU + semanticSearch

**Files:**
- Create: `src/ai/rag/queryCache.ts`
- Test: `src/ai/rag/queryCache.test.ts`
- Modify: `src/ai/rag/search.ts`
- Modify: `src/ai/rag/search.test.ts`

**Interfaces:**
- Produces:
  - `export function getCachedEmbedding(query: string): number[] | undefined`
  - `export function setCachedEmbedding(query: string, vector: number[]): void`
  - `export function resetQueryCacheForTests(): void` — clears the Map (tests only)
  - `export async function semanticSearchDetailed(query: string, apiKey: string, topK?: number): Promise<{ results: SearchResult[]; fromCache: boolean }>`
  - Keep `semanticSearch(...)` as `return (await semanticSearchDetailed(...)).results` so the `semantic_search` tool does not change.

Normalize: `query.trim().toLowerCase().replace(/\s+/g, " ")`. LRU: `Map` insertion order; on get, delete+re-set to refresh recency; on set over 50, delete `map.keys().next().value`.

`embedText` is unchanged. `semanticSearchDetailed` checks cache first; on hit skip `embedText` and `fromCache: true`; on miss call `embedText`, `setCachedEmbedding`, `fromCache: false`.

- [ ] **Step 1: Write the failing tests**

`queryCache.test.ts`: set `"Hola  Mundo"`, get `"hola mundo"` hits; 51st distinct key evicts the oldest; `resetQueryCacheForTests` then miss.

`search.test.ts`: spy `embedText` if it is exported — it is. After first `semanticSearchDetailed("q", "k")`, second call with `"q"` does not call `embedText` again. Use existing search tests' embedding fixtures.

If `embedText` is hard to spy because it hits Gemini, mock `createClient` as current `search.test.ts` already does. Read `search.test.ts` and extend it rather than inventing a new mock style.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/ai/rag/queryCache.test.ts src/ai/rag/search.test.ts`

Expected: FAIL on new cases.

- [ ] **Step 3: Write minimal implementation**

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/ai/rag/queryCache.test.ts src/ai/rag/search.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```
git add src/ai/rag/queryCache.ts src/ai/rag/queryCache.test.ts src/ai/rag/search.ts src/ai/rag/search.test.ts
git commit -m "feat(ai): cache LRU de embeddings de query (spec 060)"
```

---

### Task 10: compactToolResults

**Files:**
- Create: `src/ai/chat/toolResultCompact.ts`
- Test: `src/ai/chat/toolResultCompact.test.ts`

**Interfaces:**
- Consumes: `AiMessage` from `@/ai/providers/types`
- Produces:
  - `export const TOOL_RESULT_MAX_CHARS = 4000`
  - `export function compactToolResults(history: AiMessage[], maxChars?: number): AiMessage[]`

If no tool message exceeds `maxChars`, return the **same array reference** (like `trimAgentHistory`). Over-size `role === "tool"` becomes `{ ...msg, result: { truncated: true, name: msg.name, preview: raw.slice(0, maxChars) } }`. User/assistant messages copied by identity (same object refs).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import type { AiMessage } from "@/ai/providers/types";
import { compactToolResults } from "./toolResultCompact";

describe("compactToolResults (CA-04)", () => {
  it("returns the same array when nothing exceeds the cap", () => {
    const history: AiMessage[] = [
      { role: "user", content: "x" },
      { role: "tool", toolCallId: "c1", name: "list_projects", result: { ok: true } },
    ];
    expect(compactToolResults(history, 4000)).toBe(history);
  });

  it("truncates large tool results and leaves user/assistant intact", () => {
    const big = "a".repeat(50);
    const history: AiMessage[] = [
      { role: "user", content: "x" },
      { role: "assistant", content: "y" },
      { role: "tool", toolCallId: "c1", name: "get_project", result: { blob: big } },
    ];
    const out = compactToolResults(history, 20);
    expect(out).not.toBe(history);
    expect(out[0]).toBe(history[0]);
    expect(out[1]).toBe(history[1]);
    expect(out[2]).toMatchObject({
      role: "tool",
      result: { truncated: true, name: "get_project" },
    });
    const preview = (out[2] as { result: { preview: string } }).result.preview;
    expect(preview.length).toBe(20);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/ai/chat/toolResultCompact.test.ts`

Expected: FAIL — module missing.

- [ ] **Step 3: Write minimal implementation** using `JSON.stringify(result ?? null)`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/ai/chat/toolResultCompact.test.ts src/ai/chat/historyWindow.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```
git add src/ai/chat/toolResultCompact.ts src/ai/chat/toolResultCompact.test.ts
git commit -m "feat(ai): compacta resultados de tools en el historial enviado (spec 060)"
```

---

### Task 11: Wire `send()` — policy, focused index, cache, usage events

**Files:**
- Modify: `src/store/useChatStore.ts`
- Modify: `src/ai/gemini/systemPrompt.ts` — add `buildRagContextDetailed` that returns `{ block: string; hits: number; fromCache: boolean }` (keep `buildRagContext` as `return (await detailed).block` so existing mocks that replace `buildRagContext` still work)
- Modify: `src/store/useChatStore.ragFallback.test.ts`
- Modify: `src/store/useChatStore.regenerate.test.ts`
- Modify: `src/store/useChatStore.approveAll.test.ts`
- Create: `src/store/useChatStore.tokenUsage.test.ts` (new cases for stale / fresh / skip / CA-07.4)

**`send()` order (lock, design §10):**

1. Existing guards (trim, streaming, apiKey).
2. `const turnId = uuid()`.
3. Resolve uiCtx, expandSlash, `shouldSkipRag` as today.
4. `const skipKind: false | "slash" | "continuation" = (expanded.skipRag || opts?.skipRag) ? "slash" : (shouldSkipRag(trimmed) ? "continuation" : false)` — if `shouldSkipRag` is true because of explicit flag, prefer `"slash"`; if only the continuation set, `"continuation"`.
5. If `config.ragEnabled`: `await useRagStore.getState().checkStale().catch(() => {})`. If `checkStale` threw, treat status as `"error"` for the policy input (CA-07.2).
6. Read `status` + `meta.entityCount` from `useRagStore.getState()`.
7. `focus = shouldFocusIndex({ ragEnabled: config.ragEnabled, status, entityCount })`.
8. `auto = shouldAutoRag({ ..., skip: skipKind, hasGeminiKey: Boolean(gKey) })`.
9. RAG: if `auto.auto && gKey`, `const detailed = await buildRagContextDetailed(trimmed, gKey).catch(() => null)`. If `null`, ragContext `""`, hits 0, skipReason `"error"`, **still focus index if `focus`**. If detailed and `!fromCache`, `record` embedding event (`kind: "embedding"`, `requests: 1`, `modelId` the embedding model actually used — if unknown, `gemini:gemini-embedding-001`; `turnId`; usage estimated via `estimateTokensFromChars(trimmed.length)` unless search starts returning usage later — v1 estimated is OK for embeddings, `source: "estimated"`). If `fromCache`, do **not** record embedding (CA-02.5).
10. Workspace: `const ws = useAppStore.getState().workspace`; `const index = ws && focus ? selectWorkspaceIndex(ws.index, uiCtx) : ws?.index`; pass `{ ...ws, index }` or `ws` into `buildSystemPrompt(..., { omitEmptyIndexSections: focus })`.
11. `history: compactToolResults(trimAgentHistory(agentHistory))`.
12. `runAgentTurn` as today. After return:
    - Sum `result.usages` (if missing because old mock, treat as `rounds: result.rounds ?? 0`, usages `[]`).
    - If `result.error` and `(result.rounds ?? 0) === 0`, still `record` chat event with `requests: 1`, usage `{0,0,0, estimated}` (CA-07.4). Do **not** call `rateLimiter.recordRequest` here.
    - Else chat event `requests: result.rounds`, usage summed (if all usages `source === "provider"` then provider else estimated), `rounds: result.rounds`, rag snapshot.
13. `record` is `useAiUsageStore.getState().record(event)` — never throw out of `send` (already fail-open inside record).

Embedding `recordRequest` already happens inside `embedText` today — leave it. Cache hit must not call `embedText`.

**Test mock for `useRagStore` (copy into the three existing send test files AND the new file):**

```ts
const ragState = vi.hoisted(() => ({
  status: "up-to-date" as string,
  meta: { entityCount: 10, lastIndexedAt: "2026-08-20T00:00:00.000Z" },
  checkStale: vi.fn(async () => {}),
}));

vi.mock("@/store/useRagStore", () => ({
  useRagStore: Object.assign(() => ragState, { getState: () => ragState }),
}));
```

Existing `ragEnabled=true → buildRagContext called` tests **break** unless status is `up-to-date`. Set that in `beforeEach`. The regenerate test “texto libre largo SÍ llama a buildRagContext” needs the same.

New `useChatStore.tokenUsage.test.ts`:
- `status: "partial"` + long text → `buildRagContext` **not** called; `runAgentTurn` still called (CA-02.3).
- `up-to-date` + `"sí"` → not called (050 + D9).
- `up-to-date` + long text → called.
- `checkStale` rejects → not called (treat as not-fresh) but agent still runs (CA-07.2).
- Agent mock returns `{ error: "unknown", rounds: 0, usages: [], history: [] }` → `useAiUsageStore.getState().events` has a chat event with `requests: 1` (may need real usage store; mock idb).

Also assert `runAgentTurn` received history that is the compact+trim pipeline: pass a large tool result in module-level history if the test can reach `agentHistory`. If `agentHistory` is not exported, skip that assertion here — Task 10 unit-tests compact itself; wiring is `compactToolResults(trimAgentHistory(agentHistory))` in the `runAgentTurn({ history: ...})` call. A store test can spy `runAgentTurn` and inspect `args[0].history`.

- [ ] **Step 1: Write the new failing store tests and update mocks in the three existing files so current tests still describe 050 behavior under `up-to-date`.**

- [ ] **Step 2: Run tests to verify new cases fail and old ones (with mocks) pass or fail only on missing wiring**

Run: `npx vitest run src/store/useChatStore.ragFallback.test.ts src/store/useChatStore.regenerate.test.ts src/store/useChatStore.approveAll.test.ts src/store/useChatStore.tokenUsage.test.ts`

Expected: new stale case FAIL until send() is wired.

- [ ] **Step 3: Implement send() wiring + `buildRagContextDetailed`**

`buildRagContextDetailed` should use `semanticSearchDetailed` so `fromCache` is accurate. Count `hits = results.length`. Format the block with the existing markdown in `buildRagContext` (extract a `formatRagBlock(query, results)` helper in `systemPrompt.ts` to avoid duplication).

When `auto.auto` is false, do not call `buildRagContext` / `buildRagContextDetailed` at all.

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/store/useChatStore.ragFallback.test.ts src/store/useChatStore.regenerate.test.ts src/store/useChatStore.approveAll.test.ts src/store/useChatStore.tokenUsage.test.ts src/ai/gemini/systemPrompt.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```
git add src/store/useChatStore.ts src/store/useChatStore.ragFallback.test.ts src/store/useChatStore.regenerate.test.ts src/store/useChatStore.approveAll.test.ts src/store/useChatStore.tokenUsage.test.ts src/ai/gemini/systemPrompt.ts src/ai/gemini/systemPrompt.test.ts
git commit -m "feat(ai): send() recorta índice y saltea RAG stale (spec 060)"
```

---

### Task 12: TurnUsageChip + AssistantPanel

**Files:**
- Create: `src/features/assistant/TurnUsageChip.tsx`
- Modify: `src/features/assistant/AssistantPanel.tsx`
- No RTL component test (design §13: `format` + `aggregate` are the unit surface).

**UI (spec HU-05):**
- Import `{ Popover, PopoverTrigger, PopoverContent }` from `@/components/ui/popover`.
- Visible only when `lastTurn` is non-null **and** `status === "idle"` (hide during `streaming` and `awaiting-confirmation`) (CA-05.3).
- Place in the header of `AssistantPanel` after the screen-context badges, before the model badge.
- Hydrate usage store on panel mount next to the existing chat `hydrateFromIdb` effect: `void useAiUsageStore.getState().hydrate()`.
- `RateLimitStatus` remains behind its current button (CA-05.6).

- [ ] **Step 1: Implement the chip**

```tsx
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatTurnChip } from "@/ai/usage/format";
import type { TurnUsageView } from "@/ai/usage/types";

export function TurnUsageChip({ turn }: { turn: TurnUsageView }) {
  const { label, ariaLabel } = formatTurnChip({
    requests: turn.requests,
    tokens: turn.totalTokens,
    estimated: turn.estimated,
  });
  const ragLine = turn.rag?.injected
    ? "RAG inyectado"
    : turn.rag?.skipReason
      ? `skip: ${turn.rag.skipReason}`
      : "RAG off";
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={ariaLabel}
          className="inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground"
        >
          {label}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 text-xs">
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
          <dt>Requests</dt><dd>{turn.requests}</dd>
          <dt>Rondas</dt><dd>{turn.rounds}</dd>
          <dt>Input</dt><dd>{turn.inputTokens}</dd>
          <dt>Output</dt><dd>{turn.outputTokens}</dd>
          <dt>Fuente</dt><dd>{turn.estimated ? "Estimado" : "Proveedor"}</dd>
          <dt>RAG</dt><dd>{ragLine}</dd>
          <dt>Índice</dt><dd>{turn.rag?.indexFocused ? "recortado" : "completo"}</dd>
        </dl>
      </PopoverContent>
    </Popover>
  );
}
```

- [ ] **Step 2: Wire AssistantPanel** — `const lastTurn = useAiUsageStore((s) => s.lastTurn);` then `{status === "idle" && lastTurn ? <TurnUsageChip turn={lastTurn} /> : null}`.

- [ ] **Step 3: Run**

Run: `npx vitest run src/ai/usage/aggregate.test.ts src/ai/usage/format.test.ts`
Run: `npm run typecheck`

Expected: PASS / clean.

- [ ] **Step 4: Commit**

```
git add src/features/assistant/TurnUsageChip.tsx src/features/assistant/AssistantPanel.tsx
git commit -m "feat(ai): chip de consumo del turno en el asistente (spec 060)"
```

---

### Task 13: AiUsageCard + Settings + RagSettings copy

**Files:**
- Create: `src/features/settings/AiUsageCard.tsx`
- Modify: `src/features/settings/SettingsPage.tsx` — render `<AiUsageCard />` immediately after `<RagSettingsCard />` (today line 269)
- Modify: `src/features/settings/RagSettingsCard.tsx` — in the `status === "partial"` hint, append: `El asistente no embebe la pregunta hasta reindexar (ahorra 1 request) y usa el índice completo del workspace.` (CA-02.7)
- Test: `src/ai/usage/aggregate.test.ts` already covers day/session math. Optional: extract `buildExportPayload(events)` in `src/ai/usage/export.ts` and test it.

**Card (spec HU-06):**
- `<Card id="uso" className="scroll-mt-6">` (Settings already scrolls to `location.hash`).
- Header icon `BarChart3` (lucide, already used in `RateLimitStatus`).
- Title: `Uso de IA`. Description: privacy copy CA-06.5: `El desglose queda en este dispositivo (IndexedDB). No se envía a ningún servidor de Hito.`
- On mount: `hydrate()`.
- **Hoy**: `aggregateDay(events, localDateKey(new Date()), includeEstimated)` — show requests, tokens in, tokens out; per-model rows using `getModelDef(id)?.label ?? id`.
- **Sesión**: `session` from the store (not filtered by includeEstimated — session is raw; acceptable). Spec CA-06.3 is session totals of the tab.
- Last 20 events (not turns): newest first; columns time (`toLocaleTimeString("es-ES", { timeStyle: "short" })`), kind (`chat`/`embedding`), short model (`splitQualified(modelId).modelId`), req, tokens, RAG mark if `rag.injected`.
- Toggle: existing `Checkbox` + `Label` “Incluir estimados” bound to `includeEstimated` / `setIncludeEstimated` (CA-06.7). When off, day totals and the list omit estimated events.
- Empty: `Todavía no hay consumo registrado. Se empieza a contar en el próximo mensaje.` (CA-06.8). Show the card even without an API key (CA-06.9).
- Export: build `{ exportedAt: new Date().toISOString(), events: exportEvents() }`, download `hito-uso-${localDateKey(new Date())}.json` via object URL (copy the pattern in `SettingsPage.onExport`).
- Clear: local `useState` + existing `ConfirmDialog` (already imported in SettingsPage — import it in the card from `@/components/ConfirmDialog`). Confirm then `clear()`.

Extract for test:

```ts
// src/ai/usage/export.ts
export function buildExportPayload(events: UsageEvent[], exportedAt: string) {
  return { exportedAt, events };
}
```

Test: payload has no field named `apiKey`; events equal input.

- [ ] **Step 1: Write `export.test.ts` failing.**

- [ ] **Step 2: Implement export helper + card + Settings mount + RAG copy.**

- [ ] **Step 3: Run**

Run: `npx vitest run src/ai/usage/export.test.ts`
Run: `npm run typecheck`

Expected: PASS / no new errors.

- [ ] **Step 4: Commit**

```
git add src/ai/usage/export.ts src/ai/usage/export.test.ts src/features/settings/AiUsageCard.tsx src/features/settings/SettingsPage.tsx src/features/settings/RagSettingsCard.tsx
git commit -m "feat(ai): card de uso en Configuración (spec 060)"
```

---

### Task 14: Smoke, spec status, graphify

**Files:**
- Create: `specs/060-ai-token-usage/smoke.md`
- Modify: `specs/060-ai-token-usage/spec.md` — header Estado → **IMPLEMENTADO**; add `plan.md` and `smoke.md` to §11
- Modify: `specs/060-ai-token-usage/design.md` only if an implemented signature drifted (keep in sync)

- [ ] **Step 1: Write `smoke.md` with this exact checklist**

```md
# Smoke 060 — uso de tokens y RAG fresco

Requisitos: API key Gemini válida, workspace con ≥2 proyectos, RAG indexado (estado Actualizado).

- [ ] Settings `#uso`: empty state o totales del día; copy de privacidad visible.
- [ ] Chat en un proyecto (URL `/app/projects/:id`): enviar “resumí este proyecto”. Chip aparece al terminar (`N req · X tok`). Popover muestra rondas e “índice recortado” + RAG inyectado.
- [ ] Mismo texto otra vez en la misma pestaña: el popover marca skip cache-hit **o** no aparece un evento embedding nuevo en la card.
- [ ] Editar una tarea (dirty RAG → Parcial). Enviar una pregunta larga: Network no llama `embedContent`; chip/popover dice skip stale; la respuesta sigue saliendo.
- [ ] Continuación “sí”: no hay embedding (050 + 060).
- [ ] RateLimitStatus TPM se mueve en miles si el proveedor mandó usage (no saltos de 500). Diario (RPD) sube ~1 por ronda, no 1 por send.
- [ ] Settings card: Hoy / por modelo / últimos eventos / export JSON abre un archivo sin apiKey / vaciar pide confirmación y deja la sesión de la pestaña.
- [ ] Deep-link `/app/settings#uso` hace scroll a la card.
```

- [ ] **Step 2: Run full verification**

Run: `npx vitest run src/ai/usage src/ai/chat/ragPolicy.test.ts src/ai/chat/workspaceIndex.test.ts src/ai/chat/toolResultCompact.test.ts src/ai/rag/queryCache.test.ts src/ai/rag/search.test.ts src/ai/agent/runAgentTurn.test.ts src/ai/gemini/systemPrompt.test.ts src/store/useChatStore.ragFallback.test.ts src/store/useChatStore.regenerate.test.ts src/store/useChatStore.approveAll.test.ts src/store/useChatStore.tokenUsage.test.ts src/store/useAiUsageStore.test.ts src/ai/providers/openai-compatible/mapping.test.ts src/ai/providers/openai-compatible/body.test.ts`
Run: `npm run typecheck`
Run: `npm run lint`
Run: `graphify update .`

Expected: tests green, typecheck clean, graph updated.

- [ ] **Step 3: Mark spec IMPLEMENTADO and list plan.md / smoke.md in §11.**

- [ ] **Step 4: Commit**

```
git add specs/060-ai-token-usage
git commit -m "docs(ai): spec 060 implementado y smoke (spec 060)"
```

---

## Spec coverage (self-review)

| Requirement | Task |
|-------------|------|
| CA-01.1 Gemini usage | T1, T3 |
| CA-01.2 OpenAI usage | T1, T2, T3 |
| CA-01.3 estimated + `~` | T1, T5, T12 |
| CA-01.4 1 request per round | T4 |
| CA-01.5 embedding event | T11 |
| CA-01.6 recordRequest real tokens | T4 |
| CA-02.1 checkStale on send | T11 |
| CA-02.2 fresh inject + focused index | T8, T11 |
| CA-02.3 stale no embed, full index | T7, T11 |
| CA-02.4 skipRag slash vs continuation | T7, T11 |
| CA-02.5 cache hit | T9, T11 |
| CA-02.6 embed fail keeps focused index | T11 |
| CA-02.7 RagSettings copy | T13 |
| CA-03.1–03.6 index table + evidence + omit empty | T8 |
| CA-04.* compact tools | T10, T11 |
| CA-05.* chip | T5, T12 |
| CA-06.* settings card | T6, T13 |
| CA-07.1 IDB fail-open | T6 |
| CA-07.2 checkStale throw | T11 |
| CA-07.3 abort completed rounds only | T4 (only successful streamTurns increment rounds) |
| CA-07.4 failed send still logs 1 estimated request | T11 |
| D10 tools untouched | no task changes `createBoundTools` |
| D19–D21 windows/topK/MAX_ROUNDS untouched | no task changes those constants |

Out of scope (intentionally no task): tool routing, improve/transform audit, charts, persisted LRU, dashboard top-N, schema bump.
