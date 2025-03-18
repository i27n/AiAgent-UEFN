import React, { useState } from "react";
import { Copy, Download, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";
import { Card } from "../ui/card";

interface CodeOutputPaneProps {
  code: string;
  isValid?: boolean;
  errors?: Array<{ line: number; message: string }>;
  onCopyCode?: () => void;
  onDownloadCode?: () => void;
}

const CodeOutputPane = ({
  code = `// Generated Verse code will appear here

using { /Script/VerseEngine }

verse function Example() : void
{
    // This is a sample Verse function
    Print("Hello, Verse world!")
}`,
  isValid = true,
  errors = [],
  onCopyCode = () => {},
  onDownloadCode = () => {},
}: CodeOutputPaneProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    onCopyCode();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "verse-script.verse";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onDownloadCode();
  };

  return (
    <Card className="flex flex-col h-full w-full bg-[#141414] border-[#2e2e2e] overflow-hidden">
      <div className="flex justify-between items-center p-3 border-b border-[#2e2e2e] bg-[#1b1b1b]">
        <div className="flex items-center">
          <h3 className="text-[#e1e1e1] font-medium">Generated Code</h3>
          {isValid ? (
            <CheckCircle2 className="ml-2 h-5 w-5 text-green-500" />
          ) : (
            <AlertCircle className="ml-2 h-5 w-5 text-red-500" />
          )}
        </div>
        <div className="flex space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="bg-[#2e2e2e] border-[#2e2e2e] hover:bg-[#3e3e3e] text-[#e1e1e1]"
                >
                  {copied ? "Copied!" : <Copy className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy code</p>
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
                  className="bg-[#2e2e2e] border-[#2e2e2e] hover:bg-[#3e3e3e] text-[#e1e1e1]"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download code</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <ScrollArea className="flex-grow p-0 relative">
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
              <h4 className="text-red-500 font-medium mb-2">Errors</h4>
              <ul className="space-y-2">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm text-[#e1e1e1]">
                    <span className="text-red-500">Line {error.line}:</span>{" "}
                    {error.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default CodeOutputPane;
