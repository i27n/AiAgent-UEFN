import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import {
  Copy,
  Download,
  AlertCircle,
  CheckCircle2,
  FileCode,
  Check,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { copyToClipboard, downloadFile } from "@/lib/utils";
import { t } from "@/lib/i18n";

interface CodeOutputPaneProps {
  code: string;
  isValid?: boolean;
  errors?: Array<{ line: number; message: string; severity?: string }>;
  onCopyCode?: () => void;
  onDownloadCode?: () => void;
  onFormatCode?: () => void;
  onValidateCode?: () => void;
}

const CodeOutputPane = ({
  code = `// Generated Verse code will appear here\n\nusing { /Script/VerseEngine }\n\nverse function Example() : void\n{\n    // This is a sample Verse function\n    Print("Hello, Verse world!")\n}`,
  isValid = true,
  errors = [],
  onCopyCode = () => {},
  onDownloadCode = () => {},
  onFormatCode = () => {},
  onValidateCode = () => {},
}: CodeOutputPaneProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copyToClipboard(code);
    setCopied(true);
    onCopyCode();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadFile(code, "verse-script.verse");
    onDownloadCode();
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
                  variant="outline"
                  size="sm"
                  onClick={onFormatCode}
                  disabled={!code}
                  className="h-8 bg-[#2e2e2e] border-[#2e2e2e] hover:bg-[#3e3e3e] text-[#e1e1e1]"
                >
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
                  Validate
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("editor.code.validate", "Validate code")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
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
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={!code}
                  className="h-8 bg-[#2e2e2e] border-[#2e2e2e] hover:bg-[#3e3e3e] text-[#e1e1e1]"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("editor.code.download", "Download code")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-grow relative">
        <ScrollArea className="h-full">
          <div className="relative">
            <pre className="p-4 font-mono text-sm text-[#f3f3f3] whitespace-pre overflow-x-auto">
              {code.split("\n").map((line, index) => (
                <div
                  key={index}
                  className={`${errors.some((e) => e.line === index + 1) ? "bg-red-900/20 border-l-2 border-red-500 pl-2 -ml-2" : ""}`}
                >
                  {line}
                </div>
              ))}
            </pre>

            {errors.length > 0 && (
              <div className="border-t border-[#2e2e2e] p-4 bg-[#1b1b1b]">
                <h4 className="text-red-500 font-medium mb-2">
                  {t("editor.code.errors", "Errors")}
                </h4>
                <ul className="space-y-2">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm text-[#e1e1e1]">
                      <span className="text-red-500">
                        {t("editor.code.line", "Line")} {error.line}:
                      </span>{" "}
                      {error.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CodeOutputPane;
