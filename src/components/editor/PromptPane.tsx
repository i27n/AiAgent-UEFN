import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Lightbulb,
  Send,
  Trash2,
  Code,
  FileCode,
  HelpCircle,
  Wand2,
  AlertCircle,
  Settings,
  Upload,
  Download,
  Save,
} from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { OperationMode } from "./CodeEditor";
import { verseSnippets } from "@/lib/verse-syntax";
import { t } from "@/lib/i18n";
import { copyToClipboard, downloadFile } from "@/lib/utils";
import { toastManager } from "../ui/use-toast-manager";

interface PromptPaneProps {
  operationMode?: OperationMode;
  onSubmit?: (prompt: string) => void;
  isProcessing?: boolean;
  aiConfigured?: boolean;
}

const PromptPane = ({
  operationMode = "generate",
  onSubmit = () => {},
  isProcessing = false,
  aiConfigured = false,
}: PromptPaneProps) => {
  const [prompt, setPrompt] = useState("");
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<
    "prompt" | "history" | "templates"
  >("prompt");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Force re-render when language changes
  const [, setRender] = useState(0);

  useEffect(() => {
    // Load prompt history from localStorage
    const savedHistory = localStorage.getItem("promptHistory");
    if (savedHistory) {
      try {
        setPromptHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse prompt history:", e);
      }
    }

    const handleLanguageChange = () => {
      setRender((prev) => prev + 1);
    };

    window.addEventListener("languageChanged", handleLanguageChange);
    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, []);

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt);
      // Only add to history if not already there
      if (!promptHistory.includes(prompt)) {
        const newHistory = [prompt, ...promptHistory];
        setPromptHistory(newHistory);
        // Save to localStorage
        localStorage.setItem(
          "promptHistory",
          JSON.stringify(newHistory.slice(0, 20)),
        ); // Keep only last 20 prompts
      }
    } else {
      toastManager.error("Please enter a prompt before submitting");
    }
  };

  const clearPrompt = () => {
    setPrompt("");
    toastManager.info("Prompt cleared");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Submit on Ctrl+Enter or Cmd+Enter
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleImportPrompt = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setPrompt(content);
        toastManager.success(`Imported from ${file.name}`);
      };
      reader.readAsText(file);
    }
    // Reset the input value so the same file can be selected again
    if (e.target) {
      e.target.value = "";
    }
  };

  const handleSavePrompt = () => {
    if (prompt.trim()) {
      const filename = `prompt-${new Date().toISOString().slice(0, 10)}.txt`;
      downloadFile(prompt, filename);
      toastManager.success("Prompt saved to file");
    } else {
      toastManager.error("Nothing to save");
    }
  };

  const insertTemplate = (templateCode: string) => {
    setPrompt(templateCode);
    setActiveTab("prompt");
  };

  const getPlaceholderText = () => {
    switch (operationMode) {
      case "generate":
        return t(
          "prompt.placeholder.generate",
          "Enter a description of the Verse code you want to generate...",
        );
      case "debug":
        return t(
          "prompt.placeholder.debug",
          "Paste your Verse code here and describe the issue you're facing...",
        );
      case "explain":
        return t(
          "prompt.placeholder.explain",
          "Paste your Verse code here to get an explanation of how it works...",
        );
      case "continue":
        return t(
          "prompt.placeholder.continue",
          "Paste your partial Verse code here and describe how you want to extend it...",
        );
      case "optimize":
        return "Paste your Verse code here to optimize it for performance and readability...";
      case "document":
        return "Paste your Verse code here to generate comprehensive documentation...";
      default:
        return t("prompt.title", "Enter your prompt here...");
    }
  };

  const getPromptTitle = () => {
    switch (operationMode) {
      case "generate":
        return t("editor.mode.generate", "Generate Code");
      case "debug":
        return t("editor.mode.debug", "Debug Code");
      case "explain":
        return t("editor.mode.explain", "Explain Code");
      case "continue":
        return t("editor.mode.continue", "Continue Code");
      case "optimize":
        return "Optimize Code";
      case "document":
        return "Document Code";
      default:
        return t("prompt.title", "Enter Prompt");
    }
  };

  const getPromptIcon = () => {
    switch (operationMode) {
      case "generate":
        return <Wand2 className="h-5 w-5" />;
      case "debug":
        return <Code className="h-5 w-5" />;
      case "explain":
        return <HelpCircle className="h-5 w-5" />;
      case "continue":
        return <FileCode className="h-5 w-5" />;
      case "optimize":
        return <Sliders className="h-5 w-5" />;
      case "document":
        return <FileText className="h-5 w-5" />;
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  return (
    <Card className="h-full flex flex-col bg-[#1b1b1b] border-[#2e2e2e]">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-[#e1e1e1] gap-2">
          {getPromptIcon()}
          {getPromptTitle()}
        </CardTitle>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleImportPrompt}
                  className="h-8 px-2 text-[#a0a0a0] hover:text-[#f3f3f3] hover:bg-[#2e2e2e]"
                >
                  <Upload className="h-4 w-4" />
                  <span className="sr-only">Import</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Import from file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.md,.json,.verse"
            className="hidden"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSavePrompt}
                  className="h-8 px-2 text-[#a0a0a0] hover:text-[#f3f3f3] hover:bg-[#2e2e2e]"
                  disabled={!prompt.trim()}
                >
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Save</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save to file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      {!aiConfigured && (
        <Alert className="mx-4 mb-2 bg-amber-900/20 border-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-400" />
          <AlertDescription className="text-amber-200">
            {t("ai.settings.notConfigured", "AI is not configured yet.")}{" "}
            <Button
              variant="link"
              className="text-amber-300 underline p-0 h-auto"
              onClick={() => {
                // Find and open settings dialog
                const settingsButton = document.querySelector(
                  "[data-settings-trigger]",
                );
                if (settingsButton) {
                  (settingsButton as HTMLButtonElement).click();
                }
              }}
            >
              AI Settings <Settings className="h-3 w-3 inline" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs
        value={activeTab}
        onValueChange={(v) =>
          setActiveTab(v as "prompt" | "history" | "templates")
        }
        className="flex-1 flex flex-col"
      >
        <TabsList className="mx-4 bg-[#141414]">
          <TabsTrigger value="prompt">
            {t("prompt.tab.prompt", "Prompt")}
          </TabsTrigger>
          <TabsTrigger value="history">
            {t("prompt.tab.history", "History")}
          </TabsTrigger>
          <TabsTrigger value="templates">
            {t("prompt.tab.templates", "Templates")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prompt" className="flex-1 flex flex-col p-4 pt-2">
          <CardContent className="p-0 flex-1">
            <Textarea
              placeholder={getPlaceholderText()}
              className="h-full min-h-[500px] resize-none bg-[#141414] text-[#e1e1e1] border-[#2e2e2e] focus-visible:ring-[#2e2e2e]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              dir="auto"
            />
          </CardContent>

          <CardFooter className="px-0 pt-4 flex justify-between">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={clearPrompt}
                    className="bg-[#141414] border-[#2e2e2e] hover:bg-[#2e2e2e] text-[#e1e1e1]"
                    disabled={!prompt.trim()}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("prompt.tooltip.clear", "Clear prompt")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isProcessing || !aiConfigured}
              className="bg-[#2e2e2e] hover:bg-[#3e3e3e] text-[#e1e1e1]"
            >
              {isProcessing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                  {t("app.processing", "Processing...")}
                </>
              ) : (
                <>
                  {t("app.submit", "Submit")}
                  <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardFooter>
        </TabsContent>

        <TabsContent value="history" className="flex-1 p-4 pt-2 overflow-auto">
          {promptHistory.length > 0 ? (
            <div className="space-y-4">
              {promptHistory.map((historyItem, index) => (
                <div
                  key={index}
                  className="p-3 bg-[#141414] rounded-md border border-[#2e2e2e] cursor-pointer hover:bg-[#1f1f1f] transition-colors"
                  onClick={() => {
                    setPrompt(historyItem);
                    setActiveTab("prompt");
                  }}
                >
                  <p className="text-[#e1e1e1] line-clamp-2">{historyItem}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[#8a8a8a]">
              <p>{t("prompt.history.empty", "No prompt history yet")}</p>
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="templates"
          className="flex-1 p-4 pt-2 overflow-auto"
        >
          <div className="space-y-4">
            <div
              className="p-3 bg-[#141414] rounded-md border border-[#2e2e2e] cursor-pointer hover:bg-[#1f1f1f] transition-colors"
              onClick={() => insertTemplate(verseSnippets.basicScript)}
            >
              <h3 className="font-medium text-[#f3f3f3] mb-1">
                {t("template.basic.title", "Basic Script Template")}
              </h3>
              <p className="text-[#a0a0a0] text-sm">
                {t(
                  "template.basic.description",
                  "A simple Verse script with a basic function structure",
                )}
              </p>
            </div>

            <div
              className="p-3 bg-[#141414] rounded-md border border-[#2e2e2e] cursor-pointer hover:bg-[#1f1f1f] transition-colors"
              onClick={() => insertTemplate(verseSnippets.playerMovement)}
            >
              <h3 className="font-medium text-[#f3f3f3] mb-1">
                {t("template.player.title", "Player Movement Template")}
              </h3>
              <p className="text-[#a0a0a0] text-sm">
                {t(
                  "template.player.description",
                  "A template for handling basic player movement",
                )}
              </p>
            </div>

            <div
              className="p-3 bg-[#141414] rounded-md border border-[#2e2e2e] cursor-pointer hover:bg-[#1f1f1f] transition-colors"
              onClick={() => insertTemplate(verseSnippets.triggerSetup)}
            >
              <h3 className="font-medium text-[#f3f3f3] mb-1">
                {t("template.trigger.title", "Trigger Zone Template")}
              </h3>
              <p className="text-[#a0a0a0] text-sm">
                {t(
                  "template.trigger.description",
                  "A template for creating interactive trigger zones",
                )}
              </p>
            </div>

            <div
              className="p-3 bg-[#141414] rounded-md border border-[#2e2e2e] cursor-pointer hover:bg-[#1f1f1f] transition-colors"
              onClick={() => insertTemplate(verseSnippets.gameFlow)}
            >
              <h3 className="font-medium text-[#f3f3f3] mb-1">
                {t("template.ui.title", "UI Component Template")}
              </h3>
              <p className="text-[#a0a0a0] text-sm">
                {t(
                  "template.ui.description",
                  "A template for creating UI elements in Verse",
                )}
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default PromptPane;
