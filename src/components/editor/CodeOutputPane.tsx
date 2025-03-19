import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Copy,
  Download,
  AlertCircle,
  CheckCircle2,
  FileCode,
  Check,
  Upload,
  FileCheck,
  Info,
  FileText,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { copyToClipboard, downloadFile } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { toastManager } from "../ui/use-toast-manager";

interface CodeOutputPaneProps {
  code: string;
  isValid?: boolean;
  errors?: Array<{ line: number; message: string; severity?: string }>;
  onCopyCode?: () => void;
  onDownloadCode?: () => void;
  onFormatCode?: () => void;
  onValidateCode?: () => void;
  onSaveToProject?: () => void;
  responseMetadata?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    latencyMs?: number;
  } | null;
}

const CodeOutputPane = ({
  code = `// Generated Verse code will appear here\n\nusing { /Script/VerseEngine }\n\nverse function Example() : void\n{\n    // This is a sample Verse function\n    Print("Hello, Verse world!")\n}`,
  isValid = true,
  errors = [],
  onCopyCode = () => {},
  onDownloadCode = () => {},
  onFormatCode = () => {},
  onValidateCode = () => {},
  onSaveToProject = () => {},
  responseMetadata = null,
}: CodeOutputPaneProps) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = () => {
    copyToClipboard(code);
    setCopied(true);
    onCopyCode();
    setTimeout(() => setCopied(false), 2000);
    toastManager.success("Code copied to clipboard");
  };

  const handleDownload = () => {
    downloadFile(code, "verse-script.verse");
    onDownloadCode();
    toastManager.success("Code downloaded");
  };

  const handleImportCode = () => {
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
        // Here we would typically set the code, but since we don't have direct access to setGeneratedCode
        // We'll need to implement a callback for this in the parent component
        toastManager.info(
          `File imported: ${file.name}. Please implement handling for imported code.`,
        );
      };
      reader.readAsText(file);
    }
    // Reset the input value so the same file can be selected again
    if (e.target) {
      e.target.value = "";
    }
  };

  // Function to render code with markdown support
  const renderCodeWithMarkdown = () => {
    // Simple markdown rendering for code blocks
    return code.split("\n").map((line, index) => {
      const hasError = errors.some((e) => e.line === index + 1);
      const lineClass = hasError
        ? "bg-red-900/20 border-l-2 border-red-500 pl-2 -ml-2"
        : "";

      // Very basic markdown-like formatting
      let formattedLine = line;

      // Bold text between ** **
      formattedLine = formattedLine.replace(
        /\*\*(.*?)\*\*/g,
        '<span class="font-bold">$1</span>',
      );

      // Italic text between * *
      formattedLine = formattedLine.replace(
        /\*(.*?)\*/g,
        '<span class="italic">$1</span>',
      );

      // Code inline between ` `
      formattedLine = formattedLine.replace(
        /`(.*?)`/g,
        '<code class="bg-[#0f0f0f] px-1 rounded">$1</code>',
      );

      return (
        <div key={index} className={lineClass}>
          {formattedLine.includes("<span") ||
          formattedLine.includes("<code") ? (
            <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
          ) : (
            formattedLine
          )}
        </div>
      );
    });
  };

  return (
    <Card className="flex flex-col h-full w-full bg-[#141414] border-[#2e2e2e] overflow-hidden">
      <CardHeader className="p-3 border-b border-[#2e2e2e] bg-[#1b1b1b] flex flex-row items-center justify-between">
        <div className="flex items-center">
          <FileCode className="h-5 w-5 mr-2 text-[#e1e1e1]" />
          <CardTitle className="text-[#e1e1e1] text-base font-medium">
            {t("editor.code.title", "Generated Code")}
          </CardTitle>
          {isValid ? (
            <Badge
              variant="outline"
              className="ml-2 bg-green-900/20 text-green-400 border-green-800"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Valid
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="ml-2 bg-red-900/20 text-red-400 border-red-800"
            >
              <AlertCircle className="h-3 w-3 mr-1" />
              {errors.length} {errors.length === 1 ? "Error" : "Errors"}
            </Badge>
          )}
        </div>

        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!code}
                  className="h-8 bg-[#2e2e2e] border-[#2e2e2e] hover:bg-[#3e3e3e] text-[#e1e1e1]"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      {t("editor.code.copied.button", "Copied!")}
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("editor.code.copy", "Copy code")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownload}
                  disabled={!code}
                  className="h-8 bg-[#2e2e2e] border-[#2e2e2e] hover:bg-[#3e3e3e] text-[#e1e1e1]"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("editor.code.download", "Download code")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleImportCode}
                  className="h-8 bg-[#2e2e2e] border-[#2e2e2e] hover:bg-[#3e3e3e] text-[#e1e1e1]"
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Import code from file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".verse,.txt,.md,.json"
            className="hidden"
          />
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-grow relative">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <TabsList className="bg-[#141414] border-b border-[#2e2e2e] rounded-none px-4">
            <TabsTrigger
              value="code"
              className="data-[state=active]:bg-[#2e2e2e]"
            >
              Code
            </TabsTrigger>
            <TabsTrigger
              value="errors"
              className="data-[state=active]:bg-[#2e2e2e]"
              disabled={errors.length === 0}
            >
              Errors {errors.length > 0 && `(${errors.length})`}
            </TabsTrigger>
            <TabsTrigger
              value="info"
              className="data-[state=active]:bg-[#2e2e2e]"
              disabled={!responseMetadata}
            >
              Info
            </TabsTrigger>
            <TabsTrigger
              value="markdown"
              className="data-[state=active]:bg-[#2e2e2e]"
              disabled={!code}
            >
              Markdown
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="code"
            className="flex-1 overflow-auto p-0 m-0 relative"
          >
            <div className="absolute top-2 right-2 z-10 flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onFormatCode}
                      disabled={!code}
                      className="h-8 bg-[#2e2e2e] border-[#2e2e2e] hover:bg-[#3e3e3e] text-[#e1e1e1]"
                    >
                      <FileCheck className="h-4 w-4 mr-1" />
                      Format
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("editor.code.format", "Format code")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onValidateCode}
                      disabled={!code}
                      className="h-8 bg-[#2e2e2e] border-[#2e2e2e] hover:bg-[#3e3e3e] text-[#e1e1e1]"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Validate
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("editor.code.validate", "Validate code")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <ScrollArea className="h-full pt-14">
              <pre
                className="p-4 font-mono text-sm text-[#f3f3f3] whitespace-pre overflow-x-auto"
                dir="ltr"
              >
                {code.split("\n").map((line, index) => (
                  <div
                    key={index}
                    className={`${errors.some((e) => e.line === index + 1) ? "bg-red-900/20 border-l-2 border-red-500 pl-2 -ml-2" : ""}`}
                  >
                    {line}
                  </div>
                ))}
              </pre>
            </ScrollArea>
          </TabsContent>

          <TabsContent
            value="errors"
            className="flex-1 overflow-auto p-4 m-0 bg-[#141414]"
          >
            {errors.length > 0 ? (
              <div className="space-y-4">
                <h4 className="text-red-500 font-medium mb-2">
                  {t("editor.code.errors", "Errors")}
                </h4>
                <ul className="space-y-2">
                  {errors.map((error, index) => (
                    <li
                      key={index}
                      className="text-sm text-[#e1e1e1] p-2 bg-[#1b1b1b] rounded border border-[#2e2e2e]"
                    >
                      <span className="text-red-500">
                        {t("editor.code.line", "Line")} {error.line}:
                      </span>{" "}
                      {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-[#a0a0a0]">
                <div className="text-center">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50 text-green-500" />
                  <p>{t("editor.code.noErrors", "No errors found")}</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="info"
            className="flex-1 overflow-auto p-4 m-0 bg-[#141414]"
          >
            {responseMetadata ? (
              <div className="space-y-4">
                <div className="p-3 rounded-md bg-blue-900/10 border border-blue-700/30">
                  <div className="flex items-center">
                    <Info className="h-5 w-5 text-blue-500 mr-2" />
                    <span>
                      {t("editor.output.generationInfo", "Generation Info")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-md bg-[#1b1b1b] border border-[#2e2e2e]">
                    <p className="text-sm text-[#a0a0a0] mb-1">
                      {t("editor.output.promptTokens", "Prompt Tokens")}
                    </p>
                    <p className="text-lg font-mono">
                      {responseMetadata.promptTokens || "--"}
                    </p>
                  </div>
                  <div className="p-3 rounded-md bg-[#1b1b1b] border border-[#2e2e2e]">
                    <p className="text-sm text-[#a0a0a0] mb-1">
                      {t("editor.output.completionTokens", "Completion Tokens")}
                    </p>
                    <p className="text-lg font-mono">
                      {responseMetadata.completionTokens || "--"}
                    </p>
                  </div>
                  <div className="p-3 rounded-md bg-[#1b1b1b] border border-[#2e2e2e]">
                    <p className="text-sm text-[#a0a0a0] mb-1">
                      {t("editor.output.totalTokens", "Total Tokens")}
                    </p>
                    <p className="text-lg font-mono">
                      {responseMetadata.totalTokens || "--"}
                    </p>
                  </div>
                  <div className="p-3 rounded-md bg-[#1b1b1b] border border-[#2e2e2e]">
                    <p className="text-sm text-[#a0a0a0] mb-1">
                      {t("editor.output.latency", "Latency")}
                    </p>
                    <p className="text-lg font-mono">
                      {responseMetadata.latencyMs
                        ? `${(responseMetadata.latencyMs / 1000).toFixed(2)}s`
                        : "--"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-[#a0a0a0]">
                <div className="text-center">
                  <Info className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>
                    {t(
                      "editor.output.noInfo",
                      "No generation information available",
                    )}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="markdown"
            className="flex-1 overflow-auto p-4 m-0 bg-[#141414]"
          >
            {code ? (
              <div className="prose prose-invert max-w-none">
                <pre
                  className="p-4 font-mono text-sm text-[#f3f3f3] whitespace-pre overflow-x-auto"
                  dir="ltr"
                >
                  {renderCodeWithMarkdown()}
                </pre>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-[#a0a0a0]">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No markdown content available</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CodeOutputPane;
