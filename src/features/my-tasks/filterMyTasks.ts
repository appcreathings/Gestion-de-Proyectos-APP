import type { Priority, TaskStatus } from "@/domain/schemas";

export const MY_TASKS_PRIORITY_ORDER: readonly Priority[] = [
  "critical",
  "high",
  "medium",
  "low",
];

export type MyTasksDateFilter = "overdue" | "due-soon" | "this-week";
export type MyTasksView = "priority" | "project";

export type MyTasksQuery = {
  personId: string | null;
  status: TaskStatus | null;
  priority: Priority | null;
  date: MyTasksDateFilter | null;
  projectId: string | null;
  showDone: boolean;
  view: MyTasksView;
};

const TASK_STATUSES: readonly TaskStatus[] = ["todo", "doing", "blocked", "done"];
const DATE_FILTERS: readonly MyTasksDateFilter[] = ["overdue", "due-soon", "this-week"];

function isTaskStatus(v: string | null): v is TaskStatus {
  return v !== null && (TASK_STATUSES as readonly string[]).includes(v);
}
function isPriority(v: string | null): v is Priority {
  return v !== null && (MY_TASKS_PRIORITY_ORDER as readonly string[]).includes(v);
}
function isDateFilter(v: string | null): v is MyTasksDateFilter {
  return v !== null && (DATE_FILTERS as readonly string[]).includes(v);
}

export function parseMyTasksQuery(params: URLSearchParams): MyTasksQuery {
  const statusRaw = params.get("status");
  const priorityRaw = params.get("priority");
  const dateRaw = params.get("date");
  return {
    personId: params.get("person"),
    status: isTaskStatus(statusRaw) ? statusRaw : null,
    priority: isPriority(priorityRaw) ? priorityRaw : null,
    date: isDateFilter(dateRaw) ? dateRaw : null,
    projectId: params.get("project"),
    showDone: params.get("done") === "1",
    view: params.get("view") === "project" ? "project" : "priority",
  };
}

export function applyShowDone(params: URLSearchParams, show: boolean): URLSearchParams {
  const next = new URLSearchParams(params);
  if (show) {
    next.set("done", "1");
  } else {
    next.delete("done");
    if (next.get("status") === "done") next.delete("status");
  }
  return next;
}

export function applyStatus(params: URLSearchParams, status: string | null): URLSearchParams {
  const next = new URLSearchParams(params);
  if (!status) {
    next.delete("status");
  } else {
    next.set("status", status);
    if (status === "done") next.set("done", "1");
  }
  return next;
}

export function applyFilter(
  params: URLSearchParams,
  key: "priority" | "date" | "project" | "person" | "view",
  value: string | null,
): URLSearchParams {
  const next = new URLSearchParams(params);
  if (!value) next.delete(key);
  else next.set(key, value);
  return next;
}

export function clearMyTaskFilters(params: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(params);
  next.delete("status");
  next.delete("priority");
  next.delete("date");
  next.delete("project");
  return next;
}
