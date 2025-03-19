import React, { useState, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import OperationModeSelector from "./OperationModeSelector";
import PromptPane from "./PromptPane";
import CodeOutputPane from "./CodeOutputPane";
import { getAIService } from "@/lib/ai";
import { validateVerseSyntax, formatVerseCode } from "@/lib/verse-syntax";

// Define the OperationMode type here since it's not exported from OperationModeSelector
export type OperationMode = "generate" | "debug" | "explain" | "continue";

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
  const [aiConfigured, setAiConfigured] = useState(false);

  // Check if AI is configured on component mount
  useEffect(() => {
    const apiKey = localStorage.getItem("geminiApiKey");
    setAiConfigured(!!apiKey);
  }, []);

  const handleModeChange = (mode: OperationMode) => {
    setOperationMode(mode);
  };

  const handlePromptSubmit = async (prompt: string) => {
    setIsProcessing(true);
    setErrors([]);

    try {
      const apiKey = localStorage.getItem("geminiApiKey");

      if (!apiKey) {
        throw new Error(
          "Gemini API key not configured. Please set it in the AI Settings.",
        );
      }

      // Get AI settings from localStorage
      const aiSettingsStr = localStorage.getItem("aiSettings");
      const aiSettings = aiSettingsStr ? JSON.parse(aiSettingsStr) : {};
      const autoValidate =
        aiSettings.autoValidate !== undefined ? aiSettings.autoValidate : true;
      const autoFormat =
        aiSettings.autoFormat !== undefined ? aiSettings.autoFormat : true;

      // Initialize AI service
      const aiService = getAIService({
        apiKey,
        model: aiSettings.model || "gemini-2.0-flash",
        temperature: aiSettings.temperature || 0.7,
        maxTokens: aiSettings.maxTokens || 2048,
      });

      // Generate code based on operation mode
      let response;
      switch (operationMode) {
        case "generate":
          response = await aiService.generateVerseCode(prompt);
          break;
        case "debug":
          response = await aiService.debugVerseCode(
            prompt,
            "Please debug this code",
          );
          break;
        case "explain":
          response = await aiService.explainVerseCode(prompt);
          break;
        case "continue":
          response = await aiService.continueVerseCode(
            prompt,
            "Please continue or extend this code",
          );
          break;
        default:
          throw new Error("Invalid operation mode");
      }

      if (response.error) {
        throw new Error(response.error);
      }

      let generatedCode = response.content;

      // Format code if enabled
      if (autoFormat) {
        try {
          generatedCode = formatVerseCode(generatedCode);
        } catch (formatError) {
          console.error("Error formatting code:", formatError);
        }
      }

      setGeneratedCode(generatedCode);
      onCodeGenerated(generatedCode);

      // Validate code if enabled
      if (autoValidate) {
        const validationErrors = validateVerseSyntax(generatedCode);
        setErrors(validationErrors);
      }
    } catch (error) {
      console.error("Error processing prompt:", error);
      setErrors([
        {
          line: 1,
          message:
            error instanceof Error
              ? error.message
              : "Failed to process your prompt. Please try again.",
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
            aiConfigured={aiConfigured}
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
