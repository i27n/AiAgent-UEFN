import { Octokit } from "octokit";

export interface GitHubConfig {
  token?: string;
  username?: string;
  password?: string;
}

export class GitHubService {
  private octokit: Octokit | null = null;
  private authenticated = false;

  constructor(private config?: GitHubConfig) {
    if (config?.token) {
      this.authenticateWithToken(config.token);
    } else if (config?.username && config?.password) {
      this.authenticateWithCredentials(config.username, config.password);
    }
  }

  public isAuthenticated(): boolean {
    return this.authenticated;
  }

  public async authenticateWithToken(token: string): Promise<boolean> {
    try {
      this.octokit = new Octokit({ auth: token });
      await this.validateAuthentication();
      this.authenticated = true;
      return true;
    } catch (error) {
      console.error("GitHub authentication failed:", error);
      this.authenticated = false;
      return false;
    }
  }

  public async authenticateWithCredentials(
    username: string,
    password: string,
  ): Promise<boolean> {
    try {
      // Basic authentication is deprecated by GitHub, but we'll include it for completeness
      // In a production app, you would use OAuth or Personal Access Token instead
      const auth = Buffer.from(`${username}:${password}`).toString("base64");
      this.octokit = new Octokit({
        auth: auth,
        authStrategy: (auth) => {
          return {
            headers: {
              authorization: `Basic ${auth}`,
            },
          };
        },
      });
      await this.validateAuthentication();
      this.authenticated = true;
      return true;
    } catch (error) {
      console.error("GitHub authentication failed:", error);
      this.authenticated = false;
      return false;
    }
  }

  private async validateAuthentication(): Promise<void> {
    if (!this.octokit) throw new Error("Octokit not initialized");

    // Test the authentication by getting the authenticated user
    await this.octokit.rest.users.getAuthenticated();
  }

  public async createRepository(
    name: string,
    description: string,
    isPrivate: boolean = false,
  ): Promise<string> {
    if (!this.octokit || !this.authenticated) {
      throw new Error("Not authenticated with GitHub");
    }

    try {
      const response = await this.octokit.rest.repos.createForAuthenticatedUser(
        {
          name,
          description,
          private: isPrivate,
          auto_init: true,
        },
      );

      return response.data.html_url;
    } catch (error) {
      console.error("Failed to create repository:", error);
      throw new Error(
        `Failed to create repository: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  public async pushFile(
    repoName: string,
    path: string,
    content: string,
    message: string = "Add Verse script",
  ): Promise<void> {
    if (!this.octokit || !this.authenticated) {
      throw new Error("Not authenticated with GitHub");
    }

    try {
      // Get the authenticated user
      const { data: user } = await this.octokit.rest.users.getAuthenticated();
      const owner = user.login;

      // Check if file exists to get the SHA (needed for update)
      let sha: string | undefined;
      try {
        const { data: existingFile } = await this.octokit.rest.repos.getContent(
          {
            owner,
            repo: repoName,
            path,
          },
        );

        if ("sha" in existingFile) {
          sha = existingFile.sha;
        }
      } catch (error) {
        // File doesn't exist, which is fine for creation
      }

      // Create or update the file
      await this.octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo: repoName,
        path,
        message,
        content: Buffer.from(content).toString("base64"),
        sha,
      });
    } catch (error) {
      console.error("Failed to push file to repository:", error);
      throw new Error(
        `Failed to push file: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  public async listRepositories(): Promise<
    Array<{ name: string; url: string; description: string }>
  > {
    if (!this.octokit || !this.authenticated) {
      throw new Error("Not authenticated with GitHub");
    }

    try {
      const { data: repos } =
        await this.octokit.rest.repos.listForAuthenticatedUser();

      return repos.map((repo) => ({
        name: repo.name,
        url: repo.html_url,
        description: repo.description || "",
      }));
    } catch (error) {
      console.error("Failed to list repositories:", error);
      throw new Error(
        `Failed to list repositories: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  public async logout(): Promise<void> {
    this.octokit = null;
    this.authenticated = false;
  }
}

// Create a singleton instance
let githubService: GitHubService | null = null;

export const getGitHubService = (config?: GitHubConfig): GitHubService => {
  if (!githubService) {
    githubService = new GitHubService(config);
  } else if (config) {
    // If config is provided and instance exists, create a new instance
    githubService = new GitHubService(config);
  }
  return githubService;
};
