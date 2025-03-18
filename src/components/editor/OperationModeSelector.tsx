import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Code, Bug, HelpCircle, GitBranch } from "lucide-react";

export type OperationMode = "generate" | "debug" | "explain" | "continue";

interface OperationModeSelectorProps {
  selectedMode?: OperationMode;
  onModeChange?: (mode: OperationMode) => void;
}

const OperationModeSelector = ({
  selectedMode = "generate",
  onModeChange = () => {},
}: OperationModeSelectorProps) => {
  const handleValueChange = (value: string) => {
    onModeChange(value as OperationMode);
  };

  return (
    <div className="w-full bg-[#1b1b1b] p-2 rounded-t-md border-b border-[#2e2e2e]">
      <TooltipProvider>
        <Tabs
          value={selectedMode}
          onValueChange={handleValueChange}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full bg-[#141414]">
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="generate"
                  className="flex items-center gap-2"
                >
                  <Code size={16} />
                  <span className="hidden sm:inline">Generate</span>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate new Verse script</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="debug" className="flex items-center gap-2">
                  <Bug size={16} />
                  <span className="hidden sm:inline">Debug</span>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Debug existing code</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="explain"
                  className="flex items-center gap-2"
                >
                  <HelpCircle size={16} />
                  <span className="hidden sm:inline">Explain</span>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Get explanation for code</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="continue"
                  className="flex items-center gap-2"
                >
                  <GitBranch size={16} />
                  <span className="hidden sm:inline">Continue</span>
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Continue development from partial implementation</p>
              </TooltipContent>
            </Tooltip>
          </TabsList>
        </Tabs>
      </TooltipProvider>
    </div>
  );
};

export default OperationModeSelector;
