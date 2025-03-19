import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  Github,
  Plus,
  Upload,
  LogOut,
  RefreshCw,
  AlertCircle,
  Check,
  Loader2,
} from "lucide-react";
import { Switch } from "../ui/switch";
import { getGitHubService } from "@/lib/github";
import GitHubLogin from "./GitHubLogin";

interface GitHubPanelProps {
  currentScript?: string;
  currentScriptName?: string;
}

const GitHubPanel = ({
  currentScript = "",
  currentScriptName = "Untitled Script",
}: GitHubPanelProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [repositories, setRepositories] = useState<
    Array<{ name: string; url: string; description: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // New repo dialog state
  const [showNewRepoDialog, setShowNewRepoDialog] = useState(false);
  const [newRepoName, setNewRepoName] = useState("");
  const [newRepoDescription, setNewRepoDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  // Push script dialog state
  const [showPushDialog, setShowPushDialog] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [filePath, setFilePath] = useState("");
  const [commitMessage, setCommitMessage] = useState("");

  // Login dialog state
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const githubService = getGitHubService();
    const authenticated = githubService.isAuthenticated();
    setIsAuthenticated(authenticated);

    if (authenticated) {
      fetchRepositories();
    }
  };

  const fetchRepositories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const githubService = getGitHubService();
      const repos = await githubService.listRepositories();
      setRepositories(repos);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch repositories",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRepository = async () => {
    if (!newRepoName.trim()) {
      setError("Repository name is required");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const githubService = getGitHubService();
      const repoUrl = await githubService.createRepository(
        newRepoName,
        newRepoDescription,
        isPrivate,
      );

      setSuccess(`Repository created successfully: ${newRepoName}`);
      setShowNewRepoDialog(false);
      setNewRepoName("");
      setNewRepoDescription("");
      setIsPrivate(false);

      // Refresh the repository list
      fetchRepositories();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create repository",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePushScript = async () => {
    if (!selectedRepo) {
      setError("Please select a repository");
      return;
    }

    if (!filePath.trim()) {
      setError("File path is required");
      return;
    }

    // Ensure the file has a .verse extension
    const finalPath = filePath.endsWith(".verse")
      ? filePath
      : `${filePath}.verse`;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const githubService = getGitHubService();
      await githubService.pushFile(
        selectedRepo,
        finalPath,
        currentScript,
        commitMessage || `Add ${finalPath}`,
      );

      setSuccess(`Script successfully pushed to ${selectedRepo}/${finalPath}`);
      setShowPushDialog(false);
      setSelectedRepo("");
      setFilePath("");
      setCommitMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to push script");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const githubService = getGitHubService();
    await githubService.logout();
    setIsAuthenticated(false);
    setRepositories([]);
  };

  const handleLoginSuccess = () => {
    setShowLoginDialog(false);
    setIsAuthenticated(true);
    fetchRepositories();
  };

  // If not authenticated, show login button
  if (!isAuthenticated && !showLoginDialog) {
    return (
      <Card className="w-full bg-[#1b1b1b] border-[#2e2e2e] shadow-md">
        <CardHeader className="px-4 py-3 flex flex-row items-center justify-between bg-[#141414] border-b border-[#2e2e2e]">
          <CardTitle className="text-[#e1e1e1] text-lg font-medium flex items-center">
            <Github className="mr-2 h-5 w-5" />
            GitHub Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 flex flex-col items-center justify-center space-y-4">
          <p className="text-[#a0a0a0] text-center">
            Connect to GitHub to save and manage your Verse scripts
          </p>
          <Button
            onClick={() => setShowLoginDialog(true)}
            className="bg-[#2e2e2e] hover:bg-[#3e3e3e] text-[#f3f3f3]"
          >
            <Github className="mr-2 h-4 w-4" />
            Connect to GitHub
          </Button>

          {error && (
            <div className="text-red-400 text-sm mt-2">
              <AlertCircle className="h-4 w-4 inline mr-1" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (showLoginDialog) {
    return (
      <Card className="w-full bg-[#1b1b1b] border-[#2e2e2e] shadow-md">
        <CardContent className="p-4">
          <GitHubLogin
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setShowLoginDialog(false)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-[#1b1b1b] border-[#2e2e2e] shadow-md">
      <CardHeader className="px-4 py-3 flex flex-row items-center justify-between bg-[#141414] border-b border-[#2e2e2e]">
        <CardTitle className="text-[#e1e1e1] text-lg font-medium flex items-center">
          <Github className="mr-2 h-5 w-5" />
          GitHub Integration
        </CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchRepositories}
            disabled={isLoading}
            className="h-8 w-8 text-[#e1e1e1] hover:text-white hover:bg-[#3a3a3a]"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="sr-only">Refresh</span>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-[#e1e1e1] hover:text-red-400 hover:bg-[#3a3a3a]"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#1b1b1b] border-[#2e2e2e]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[#f3f3f3]">
                  Disconnect from GitHub
                </AlertDialogTitle>
                <AlertDialogDescription className="text-[#a0a0a0]">
                  Are you sure you want to disconnect from GitHub? You'll need
                  to reconnect to access your repositories.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-[#2e2e2e] text-[#e1e1e1] hover:bg-[#3a3a3a] hover:text-white border-none">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-900 text-white hover:bg-red-800"
                  onClick={handleLogout}
                >
                  Disconnect
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-md p-3 mb-4 text-[#e1e1e1]">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-900/20 border border-green-800 rounded-md p-3 mb-4 text-[#e1e1e1]">
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-400 mr-2" />
              <p>{success}</p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[#f3f3f3] font-medium">Your Repositories</h3>
            <Dialog
              open={showNewRepoDialog}
              onOpenChange={setShowNewRepoDialog}
            >
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-[#2e2e2e] hover:bg-[#3e3e3e] text-[#e1e1e1]"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New Repo
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1b1b1b] border-[#2e2e2e] text-[#e1e1e1]">
                <DialogHeader>
                  <DialogTitle>Create New Repository</DialogTitle>
                  <DialogDescription className="text-[#a0a0a0]">
                    Create a new GitHub repository for your Verse scripts.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="repo-name">Repository Name</Label>
                    <Input
                      id="repo-name"
                      placeholder="verse-scripts"
                      value={newRepoName}
                      onChange={(e) => setNewRepoName(e.target.value)}
                      className="bg-[#141414] border-[#2e2e2e]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="repo-description">
                      Description (Optional)
                    </Label>
                    <Input
                      id="repo-description"
                      placeholder="My collection of UEFN Verse scripts"
                      value={newRepoDescription}
                      onChange={(e) => setNewRepoDescription(e.target.value)}
                      className="bg-[#141414] border-[#2e2e2e]"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="private-repo"
                      checked={isPrivate}
                      onCheckedChange={setIsPrivate}
                    />
                    <Label htmlFor="private-repo">Private Repository</Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewRepoDialog(false)}
                    className="bg-[#141414] border-[#2e2e2e] hover:bg-[#2e2e2e]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateRepository}
                    disabled={isLoading || !newRepoName.trim()}
                    className="bg-[#2e2e2e] hover:bg-[#3e3e3e]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>Create Repository</>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <ScrollArea className="h-[200px] rounded-md border border-[#2e2e2e] bg-[#141414]">
            {repositories.length === 0 ? (
              <div className="p-4 text-center text-[#a0a0a0]">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="h-6 w-6 animate-spin text-[#e1e1e1]" />
                    <p>Loading repositories...</p>
                  </div>
                ) : (
                  <p>
                    No repositories found. Create a new repository to get
                    started.
                  </p>
                )}
              </div>
            ) : (
              <div className="p-4">
                {repositories.map((repo, index) => (
                  <React.Fragment key={repo.name}>
                    <div className="py-2">
                      <div className="font-medium text-[#f3f3f3]">
                        {repo.name}
                      </div>
                      {repo.description && (
                        <div className="text-sm text-[#a0a0a0] mt-1">
                          {repo.description}
                        </div>
                      )}
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:underline mt-1 inline-block"
                      >
                        View on GitHub
                      </a>
                    </div>
                    {index < repositories.length - 1 && (
                      <Separator className="my-2 bg-[#2e2e2e]" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </ScrollArea>

          <div className="pt-2">
            <Dialog open={showPushDialog} onOpenChange={setShowPushDialog}>
              <DialogTrigger asChild>
                <Button
                  className="w-full bg-[#2e2e2e] hover:bg-[#3e3e3e] text-[#e1e1e1]"
                  disabled={!currentScript || repositories.length === 0}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Push Current Script to GitHub
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1b1b1b] border-[#2e2e2e] text-[#e1e1e1]">
                <DialogHeader>
                  <DialogTitle>Push Script to GitHub</DialogTitle>
                  <DialogDescription className="text-[#a0a0a0]">
                    Save your current script to a GitHub repository.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="repo-select">Select Repository</Label>
                    <select
                      id="repo-select"
                      value={selectedRepo}
                      onChange={(e) => setSelectedRepo(e.target.value)}
                      className="w-full rounded-md border border-[#2e2e2e] bg-[#141414] px-3 py-2 text-[#e1e1e1]"
                    >
                      <option value="">Select a repository</option>
                      {repositories.map((repo) => (
                        <option key={repo.name} value={repo.name}>
                          {repo.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file-path">File Path</Label>
                    <Input
                      id="file-path"
                      placeholder="scripts/my-script.verse"
                      value={filePath}
                      onChange={(e) => setFilePath(e.target.value)}
                      className="bg-[#141414] border-[#2e2e2e]"
                    />
                    <p className="text-xs text-[#a0a0a0]">
                      Path where the file will be saved in the repository. The
                      .verse extension will be added automatically if not
                      included.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="commit-message">
                      Commit Message (Optional)
                    </Label>
                    <Input
                      id="commit-message"
                      placeholder="Add new Verse script"
                      value={commitMessage}
                      onChange={(e) => setCommitMessage(e.target.value)}
                      className="bg-[#141414] border-[#2e2e2e]"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowPushDialog(false)}
                    className="bg-[#141414] border-[#2e2e2e] hover:bg-[#2e2e2e]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handlePushScript}
                    disabled={isLoading || !selectedRepo || !filePath.trim()}
                    className="bg-[#2e2e2e] hover:bg-[#3e3e3e]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Pushing...
                      </>
                    ) : (
                      <>Push to GitHub</>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GitHubPanel;
