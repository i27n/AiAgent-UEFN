import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Textarea } from "../ui/textarea";
import { Upload, Github, FileJson, AlertCircle } from "lucide-react";
import {
  importTemplatesFromJson,
  fetchTemplatesFromGithub,
  addTemplate,
} from "@/lib/templates";
import { toastManager } from "../ui/use-toast-manager";

interface ImportTemplateDialogProps {
  onImportSuccess: () => void;
}

const ImportTemplateDialog = ({
  onImportSuccess,
}: ImportTemplateDialogProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("file");
  const [githubUrl, setGithubUrl] = useState("");
  const [jsonContent, setJsonContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          setJsonContent(content);
          setError(null);
        } catch (err) {
          setError("Failed to read file");
        }
      };
      reader.onerror = () => {
        setError("Failed to read file");
      };
      reader.readAsText(file);
    }
  };

  const handleImportFromFile = () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!jsonContent.trim()) {
        setError("Please provide JSON content");
        setIsLoading(false);
        return;
      }

      const result = importTemplatesFromJson(jsonContent);

      if (result.success) {
        toastManager.success(`Successfully imported ${result.count} templates`);
        setOpen(false);
        onImportSuccess();
      } else {
        setError(result.error || "Failed to import templates");
      }
    } catch (err) {
      setError("An error occurred during import");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportFromGithub = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!githubUrl.trim() || !githubUrl.includes("github.com")) {
        setError("Please provide a valid GitHub repository URL");
        setIsLoading(false);
        return;
      }

      const result = await fetchTemplatesFromGithub(githubUrl);

      if (result.success && result.templates) {
        // Add each template individually
        result.templates.forEach((template) => {
          addTemplate({
            title: template.title,
            description: template.description,
            code: template.code,
            category: template.category,
            tags: template.tags,
            source: template.source,
            sourceUrl: template.sourceUrl,
          });
        });

        toastManager.success(
          `Successfully imported ${result.templates.length} templates from GitHub`,
        );
        setOpen(false);
        onImportSuccess();
      } else {
        setError(result.error || "Failed to import templates from GitHub");
      }
    } catch (err) {
      setError("An error occurred during GitHub import");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-[#141414] border-[#2e2e2e] hover:bg-[#2e2e2e] text-[#e1e1e1]"
        >
          <Upload className="mr-2 h-4 w-4" />
          Import Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-[#1b1b1b] border-[#2e2e2e] text-[#e1e1e1]">
        <DialogHeader>
          <DialogTitle>Import Templates</DialogTitle>
          <DialogDescription className="text-[#a0a0a0]">
            Import templates from a file, GitHub repository, or paste JSON
            directly.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 bg-[#141414]">
            <TabsTrigger value="file" className="flex items-center gap-2">
              <FileJson className="h-4 w-4" />
              <span>File</span>
            </TabsTrigger>
            <TabsTrigger value="github" className="flex items-center gap-2">
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </TabsTrigger>
            <TabsTrigger value="paste" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span>Paste JSON</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Select JSON File</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="file-upload"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".json"
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={handleClickFileUpload}
                  className="w-full bg-[#141414] border-[#2e2e2e] hover:bg-[#2e2e2e] text-[#e1e1e1]"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose File
                </Button>
              </div>
              {jsonContent && (
                <p className="text-sm text-green-400">
                  File loaded successfully
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="github" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="github-url">GitHub Repository URL</Label>
              <Input
                id="github-url"
                placeholder="https://github.com/username/repo"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="bg-[#141414] border-[#2e2e2e] text-[#e1e1e1]"
              />
              <p className="text-xs text-[#a0a0a0]">
                Enter the URL of a GitHub repository containing template JSON
                files in a 'templates' folder.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="paste" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="json-content">Paste JSON Content</Label>
              <Textarea
                id="json-content"
                placeholder='{"templates": [{"title": "Example Template", "description": "A sample template", "code": "// Your code here"}]}'
                value={jsonContent}
                onChange={(e) => setJsonContent(e.target.value)}
                className="min-h-[200px] bg-[#141414] border-[#2e2e2e] text-[#e1e1e1]"
              />
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="bg-red-900/20 border border-red-700/50 p-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="bg-[#141414] border-[#2e2e2e] hover:bg-[#2e2e2e] text-[#e1e1e1]"
          >
            Cancel
          </Button>
          <Button
            onClick={
              activeTab === "github"
                ? handleImportFromGithub
                : handleImportFromFile
            }
            disabled={
              isLoading || (activeTab === "github" ? !githubUrl : !jsonContent)
            }
            className="bg-[#2e2e2e] hover:bg-[#3e3e3e] text-[#f3f3f3]"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                Importing...
              </>
            ) : (
              "Import"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportTemplateDialog;
