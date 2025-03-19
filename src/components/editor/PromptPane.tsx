import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { OperationMode } from "./CodeEditor";
import { verseSnippets } from "@/lib/verse-syntax";
import { t } from "@/lib/i18n";

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
    }
  };

  const clearPrompt = () => {
    setPrompt("");
  };

  const insertTemplate = (templateCode: string) => {
    setPrompt(templateCode);
    setActiveTab("prompt");
  };

  const getPlaceholderText = () => {
    switch (operationMode) {
      case "generate":
        return t("prompt.placeholder.generate");
      case "debug":
        return t("prompt.placeholder.debug");
      case "explain":
        return t("prompt.placeholder.explain");
      case "continue":
        return t("prompt.placeholder.continue");
      default:
        return t("prompt.title");
    }
  };

  const getPromptTitle = () => {
    switch (operationMode) {
      case "generate":
        return t("editor.mode.generate");
      case "debug":
        return t("editor.mode.debug");
      case "explain":
        return t("editor.mode.explain");
      case "continue":
        return t("editor.mode.continue");
      default:
        return t("prompt.title");
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
      default:
        return <Lightbulb className="h-5 w-5" />;
    }
  };

  return (
    <Card className="h-full flex flex-col bg-[#1b1b1b] border-[#2e2e2e]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-[#e1e1e1] gap-2">
          {getPromptIcon()}
          {getPromptTitle()}
        </CardTitle>
      </CardHeader>

      {!aiConfigured && (
        <Alert className="mx-4 mb-2 bg-amber-900/20 border-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-400" />
          <AlertDescription className="text-amber-200">
            {t("ai.settings.notConfigured")}{" "}
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
          <TabsTrigger value="prompt">{t("prompt.tab.prompt")}</TabsTrigger>
          <TabsTrigger value="history">{t("prompt.tab.history")}</TabsTrigger>
          <TabsTrigger value="templates">
            {t("prompt.tab.templates")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="prompt" className="flex-1 flex flex-col p-4 pt-2">
          <CardContent className="p-0 flex-1">
            <Textarea
              placeholder={getPlaceholderText()}
              className="h-full min-h-[500px] resize-none bg-[#141414] text-[#e1e1e1] border-[#2e2e2e] focus-visible:ring-[#2e2e2e]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
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
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t("prompt.tooltip.clear")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isProcessing}
              className="bg-[#2e2e2e] hover:bg-[#3e3e3e] text-[#e1e1e1]"
            >
              {isProcessing ? t("app.processing") : t("app.submit")}
              {!isProcessing && <Send className="ml-2 h-4 w-4" />}
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
                  onClick={() => setPrompt(historyItem)}
                >
                  <p className="text-[#e1e1e1] line-clamp-2">{historyItem}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[#8a8a8a]">
              <p>{t("prompt.history.empty")}</p>
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
                {t("template.basic.title")}
              </h3>
              <p className="text-[#a0a0a0] text-sm">
                {t("template.basic.description")}
              </p>
            </div>

            <div
              className="p-3 bg-[#141414] rounded-md border border-[#2e2e2e] cursor-pointer hover:bg-[#1f1f1f] transition-colors"
              onClick={() => insertTemplate(verseSnippets.playerMovement)}
            >
              <h3 className="font-medium text-[#f3f3f3] mb-1">
                {t("template.player.title")}
              </h3>
              <p className="text-[#a0a0a0] text-sm">
                {t("template.player.description")}
              </p>
            </div>

            <div
              className="p-3 bg-[#141414] rounded-md border border-[#2e2e2e] cursor-pointer hover:bg-[#1f1f1f] transition-colors"
              onClick={() => insertTemplate(verseSnippets.triggerSetup)}
            >
              <h3 className="font-medium text-[#f3f3f3] mb-1">
                {t("template.trigger.title")}
              </h3>
              <p className="text-[#a0a0a0] text-sm">
                {t("template.trigger.description")}
              </p>
            </div>

            <div
              className="p-3 bg-[#141414] rounded-md border border-[#2e2e2e] cursor-pointer hover:bg-[#1f1f1f] transition-colors"
              onClick={() => insertTemplate(verseSnippets.gameFlow)}
            >
              <h3 className="font-medium text-[#f3f3f3] mb-1">
                {t("template.ui.title")}
              </h3>
              <p className="text-[#a0a0a0] text-sm">
                {t("template.ui.description")}
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default PromptPane;
