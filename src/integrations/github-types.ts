export interface GitHubRepository {
  id: number;
  /** GraphQL node id (para vincular Project a un repo privado). */
  nodeId?: string;
  owner: string;
  name: string;
  fullName: string;
  private: boolean;
  defaultBranch: string;
  description?: string | null;
}
