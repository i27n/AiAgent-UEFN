import React, { useState } from "react";
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
} from "lucide-react";

interface PromptPaneProps {
  operationMode?: "generate" | "debug" | "explain" | "continue";
  onSubmit?: (prompt: string) => void;
  isProcessing?: boolean;
}

const PromptPane = ({
  operationMode = "generate",
  onSubmit = () => {},
  isProcessing = false,
}: PromptPaneProps) => {
  const [prompt, setPrompt] = useState("");
  const [promptHistory, setPromptHistory] = useState<string[]>([]);

  const handleSubmit = () => {
    if (prompt.trim()) {
      onSubmit(prompt);
      setPromptHistory((prev) => [...prev, prompt]);
    }
  };

  const clearPrompt = () => {
    setPrompt("");
  };

  const getPlaceholderText = () => {
    switch (operationMode) {
      case "generate":
        return 'Describe the Verse script you want to create (e.g., "Create a script that spawns enemies when a player enters a trigger zone")...';
      case "debug":
        return "Paste your Verse code here and describe the issue you're experiencing...";
      case "explain":
        return "Paste the Verse code you want explained and specify what aspects you want to understand better...";
      case "continue":
        return "Paste your partial Verse implementation and describe how you want to extend it...";
      default:
        return "Enter your prompt here...";
    }
  };

  const getPromptTitle = () => {
    switch (operationMode) {
      case "generate":
        return "Generate New Script";
      case "debug":
        return "Debug Existing Code";
      case "explain":
        return "Get Explanation";
      case "continue":
        return "Continue Development";
      default:
        return "Enter Prompt";
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

      <Tabs defaultValue="prompt" className="flex-1 flex flex-col">
        <TabsList className="mx-4 bg-[#141414]">
          <TabsTrigger value="prompt">Prompt</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="prompt" className="flex-1 flex flex-col p-4 pt-2">
          <CardContent className="p-0 flex-1">
            <Textarea
              placeholder={getPlaceholderText()}
              className="h-full min-h-[500px] resize-none bg-[#141414] text-[#e1e1e1] border-[#2e2e2e] focus-visible:ring-[#2e2e2e]"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
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
                  <p>Clear prompt</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isProcessing}
              className="bg-[#2e2e2e] hover:bg-[#3e3e3e] text-[#e1e1e1]"
            >
              {isProcessing ? "Processing..." : "Submit"}
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
              <p>No prompt history yet</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default PromptPane;
