import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { AlertCircle, Github, Key } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { getGitHubService } from "@/lib/github";

interface GitHubLoginProps {
  onLoginSuccess: () => void;
  onCancel: () => void;
}

const GitHubLogin = ({ onLoginSuccess, onCancel }: GitHubLoginProps) => {
  const [loginMethod, setLoginMethod] = useState<"token" | "credentials">(
    "token",
  );
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const githubService = getGitHubService();
      let success = false;

      if (loginMethod === "token") {
        if (!token.trim()) {
          throw new Error("Please enter a valid GitHub token");
        }
        success = await githubService.authenticateWithToken(token);
      } else {
        if (!username.trim() || !password.trim()) {
          throw new Error("Please enter both username and password");
        }
        success = await githubService.authenticateWithCredentials(
          username,
          password,
        );
      }

      if (success) {
        onLoginSuccess();
      } else {
        throw new Error(
          "Authentication failed. Please check your credentials and try again.",
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-[#1b1b1b] border-[#2e2e2e]">
      <CardHeader>
        <CardTitle className="text-[#f3f3f3] flex items-center gap-2">
          <Github className="h-5 w-5" />
          Connect to GitHub
        </CardTitle>
        <CardDescription className="text-[#a0a0a0]">
          Connect your GitHub account to save and manage your Verse scripts
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert
            variant="destructive"
            className="mb-4 bg-red-900/20 border-red-800"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs
          defaultValue="token"
          value={loginMethod}
          onValueChange={(v) => setLoginMethod(v as "token" | "credentials")}
        >
          <TabsList className="grid w-full grid-cols-2 bg-[#141414]">
            <TabsTrigger value="token">Personal Access Token</TabsTrigger>
            <TabsTrigger value="credentials">Username & Password</TabsTrigger>
          </TabsList>

          <TabsContent value="token" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="token" className="text-[#e1e1e1]">
                GitHub Personal Access Token
              </Label>
              <Input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="bg-[#141414] border-[#2e2e2e] text-[#e1e1e1]"
              />
              <p className="text-xs text-[#a0a0a0]">
                Create a token with 'repo' scope at{" "}
                <a
                  href="https://github.com/settings/tokens/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  GitHub Token Settings
                </a>
              </p>
            </div>
          </TabsContent>

          <TabsContent value="credentials" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#e1e1e1]">
                GitHub Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourusername"
                className="bg-[#141414] border-[#2e2e2e] text-[#e1e1e1]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#e1e1e1]">
                GitHub Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-[#141414] border-[#2e2e2e] text-[#e1e1e1]"
              />
            </div>

            <p className="text-xs text-[#a0a0a0]">
              Note: Using a personal access token is recommended over password
              authentication.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={onCancel}
          className="bg-[#141414] border-[#2e2e2e] hover:bg-[#2e2e2e] text-[#e1e1e1]"
        >
          Cancel
        </Button>
        <Button
          onClick={handleLogin}
          disabled={isLoading}
          className="bg-[#2e2e2e] hover:bg-[#3e3e3e] text-[#f3f3f3]"
        >
          {isLoading ? "Connecting..." : "Connect"}
          {!isLoading && <Key className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GitHubLogin;
