/** Preferencia de UI: última pestaña de detalle de proyecto (spec 048 HU-01). */
export const LAST_TAB_KEY = "hito:last-project-tab";

export const VALID_TABS = [
  "overview",
  "areas",
  "tasks",
  "automations",
  "activity",
] as const;

export type ProjectTab = (typeof VALID_TABS)[number];

export function isValidTab(v: string | null): v is ProjectTab {
  return v !== null && (VALID_TABS as readonly string[]).includes(v);
}

export function readLastTab(): ProjectTab {
  try {
    const saved = localStorage.getItem(LAST_TAB_KEY);
    return isValidTab(saved) ? saved : "overview";
  } catch {
    return "overview";
  }
}

export function writeLastTab(tab: ProjectTab): void {
  try {
    localStorage.setItem(LAST_TAB_KEY, tab);
  } catch {
    // Ignore localStorage errors
  }
}
