import React, { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import OperationModeSelector from "./OperationModeSelector";
import PromptPane from "./PromptPane";
import CodeOutputPane from "./CodeOutputPane";

// Define the OperationMode type here since it's not exported from OperationModeSelector
type OperationMode = "generate" | "debug" | "explain" | "continue";

interface CodeEditorProps {
  initialMode?: OperationMode;
  initialCode?: string;
  onCodeGenerated?: (code: string) => void;
}

const CodeEditor = ({
  initialMode = "generate",
  initialCode = "",
  onCodeGenerated = () => {},
}: CodeEditorProps) => {
  const [operationMode, setOperationMode] =
    useState<OperationMode>(initialMode);
  const [generatedCode, setGeneratedCode] = useState(initialCode);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<
    Array<{ line: number; message: string }>
  >([]);

  const handleModeChange = (mode: OperationMode) => {
    setOperationMode(mode);
  };

  const handlePromptSubmit = async (prompt: string) => {
    setIsProcessing(true);
    setErrors([]);

    try {
      // Simulate AI processing with a timeout
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock generated code based on operation mode
      let mockCode = "";
      switch (operationMode) {
        case "generate":
          mockCode = `using { /Script/VerseEngine }

verse function GeneratedScript() : void
{
    // Generated from prompt: "${prompt}"
    Print("Generated script based on your prompt")
    
    // Main functionality would be implemented here
    // based on the specific requirements
}`;
          break;
        case "debug":
          mockCode = `// Debugged version of your code
${prompt.includes("{") ? prompt : "// No valid code found in prompt"}

// Debug notes:
// - Fixed syntax errors
// - Optimized performance
// - Added error handling`;
          break;
        case "explain":
          mockCode = `// Explanation of the code:
${prompt.includes("{") ? prompt : "// No valid code found in prompt"}

/*
Code Explanation:
- This Verse script defines a function that...
- The main purpose is to...
- Key components include...
*/`;
          break;
        case "continue":
          mockCode = `${prompt.includes("{") ? prompt : "// No valid code found in prompt"}

// Additional implementation:
verse function ExtendedFeature() : void
{
    // This extends the functionality of your code
    // with the features you requested
    Print("Extended functionality added")
}`;
          break;
        default:
          mockCode = "// No operation mode selected";
      }

      setGeneratedCode(mockCode);
      onCodeGenerated(mockCode);

      // Randomly add mock errors for demonstration purposes (20% chance)
      if (Math.random() < 0.2) {
        const mockErrors = [
          {
            line: Math.floor(Math.random() * mockCode.split("\n").length) + 1,
            message: "Syntax error: unexpected token",
          },
          {
            line: Math.floor(Math.random() * mockCode.split("\n").length) + 1,
            message: "Type mismatch in expression",
          },
        ];
        setErrors(mockErrors);
      }
    } catch (error) {
      console.error("Error processing prompt:", error);
      setErrors([
        {
          line: 1,
          message: "Failed to process your prompt. Please try again.",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyCode = () => {
    // Additional actions when code is copied could be added here
    console.log("Code copied to clipboard");
  };

  const handleDownloadCode = () => {
    // Additional actions when code is downloaded could be added here
    console.log("Code downloaded");
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#000000] rounded-md overflow-hidden">
      <OperationModeSelector
        selectedMode={operationMode}
        onModeChange={handleModeChange}
      />

      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 min-h-[600px]"
      >
        <ResizablePanel defaultSize={50} minSize={30} className="p-2">
          <PromptPane
            operationMode={operationMode}
            onSubmit={handlePromptSubmit}
            isProcessing={isProcessing}
          />
        </ResizablePanel>

        <ResizableHandle className="w-2 bg-[#1b1b1b]" />

        <ResizablePanel defaultSize={50} minSize={30} className="p-2">
          <CodeOutputPane
            code={generatedCode}
            isValid={errors.length === 0}
            errors={errors}
            onCopyCode={handleCopyCode}
            onDownloadCode={handleDownloadCode}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CodeEditor;
