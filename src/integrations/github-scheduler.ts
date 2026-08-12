import { getGitHubLinks, getNextGitHubSyncAt, type GitHubLink } from "./github-sync";

export type GitHubSyncHandler = (link: GitHubLink) => Promise<void>;

/** Local-only scheduler. It never runs while the document is hidden and catches
 * up once when the app returns to the foreground. */
export class GitHubScheduler {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private running = false;
  private handler: GitHubSyncHandler | null = null;

  start(handler: GitHubSyncHandler): void {
    this.handler = handler;
    this.scheduleNext();
  }

  stop(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
    this.handler = null;
  }

  async runDueNow(): Promise<void> {
    if (this.running || document.visibilityState !== "visible" || !this.handler) return;
    this.running = true;
    try {
      const now = Date.now();
      const links = await getGitHubLinks();
      for (const link of links) {
        if (link.status !== "active" || !link.nextSyncAt || Date.parse(link.nextSyncAt) > now) continue;
        await this.handler(link);
      }
    } finally {
      this.running = false;
      this.scheduleNext();
    }
  }

  private scheduleNext(): void {
    if (this.timer || !this.handler || document.visibilityState !== "visible") return;
    this.timer = setTimeout(async () => {
      this.timer = null;
      await this.runDueNow();
    }, 60_000);
  }

  static nextFor(link: GitHubLink, from = Date.now()): string | null {
    return getNextGitHubSyncAt(link.schedule, from);
  }
}

export const githubScheduler = new GitHubScheduler();
