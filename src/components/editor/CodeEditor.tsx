import React, { useState, useEffect, useCallback } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import OperationModeSelector from "./OperationModeSelector";
import EditorTabs from "./EditorTabs";
import CodeOutputPane from "./CodeOutputPane";
import { getAIService } from "@/lib/ai";
import { validateVerseCode, formatVerseCode } from "@/lib/verse-validator";
import { extractCodeBlocks, debounce } from "@/lib/utils";
import { toastManager } from "../ui/use-toast-manager";
import { t } from "@/lib/i18n";

export type OperationMode =
  | "generate"
  | "debug"
  | "explain"
  | "continue"
  | "optimize"
  | "document";

const CodeEditor = () => {
  const [operationMode, setOperationMode] = useState<OperationMode>("generate");
  const [generatedCode, setGeneratedCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<
    Array<{ line: number; message: string; severity?: string }>
  >([]);
  const [isValid, setIsValid] = useState(true);
  const [aiConfigured, setAiConfigured] = useState(false);
  const [responseMetadata, setResponseMetadata] = useState<{
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    latencyMs?: number;
  } | null>(null);

  // Auto-save functionality
  const [lastSavedCode, setLastSavedCode] = useState("");

  // Check if AI is configured on component mount
  useEffect(() => {
    const apiKey = localStorage.getItem("geminiApiKey");
    setAiConfigured(!!apiKey);

    // Load last saved code if available
    const savedCode = localStorage.getItem("lastGeneratedCode");
    if (savedCode) {
      setGeneratedCode(savedCode);
      setLastSavedCode(savedCode);
    }
  }, []);

  // Auto-save code when it changes
  const saveCodeToLocalStorage = useCallback(
    debounce((code: string) => {
      if (code && code !== lastSavedCode) {
        localStorage.setItem("lastGeneratedCode", code);
        setLastSavedCode(code);

        // Get auto-save setting
        const aiSettingsStr = localStorage.getItem("aiSettings");
        const aiSettings = aiSettingsStr ? JSON.parse(aiSettingsStr) : {};
        const autoSave =
          aiSettings.autoSave !== undefined ? aiSettings.autoSave : true;

        if (autoSave) {
          toastManager.info("Code auto-saved to local storage");
        }
      }
    }, 2000),
    [lastSavedCode],
  );

  // Auto-save effect
  useEffect(() => {
    const aiSettingsStr = localStorage.getItem("aiSettings");
    const aiSettings = aiSettingsStr ? JSON.parse(aiSettingsStr) : {};
    const autoSave =
      aiSettings.autoSave !== undefined ? aiSettings.autoSave : true;

    if (generatedCode && autoSave) {
      saveCodeToLocalStorage(generatedCode);
    }
  }, [generatedCode, saveCodeToLocalStorage]);

  const handleModeChange = (mode: OperationMode) => {
    setOperationMode(mode);
  };

  const handlePromptSubmit = async (prompt: string) => {
    setIsProcessing(true);
    setErrors([]);
    setResponseMetadata(null);

    try {
      const apiKey = localStorage.getItem("geminiApiKey");

      if (!apiKey) {
        throw new Error(
          t(
            "editor.error.noApiKey",
            "API key not configured. Please set it in the AI Settings.",
          ),
        );
      }

      // Get AI settings from localStorage
      const aiSettingsStr = localStorage.getItem("aiSettings");
      const aiSettings = aiSettingsStr ? JSON.parse(aiSettingsStr) : {};
      const autoValidate =
        aiSettings.autoValidate !== undefined ? aiSettings.autoValidate : true;
      const autoFormat =
        aiSettings.autoFormat !== undefined ? aiSettings.autoFormat : true;

      // Advanced settings
      const topK = aiSettings.topK !== undefined ? aiSettings.topK : 40;
      const topP = aiSettings.topP !== undefined ? aiSettings.topP : 0.95;
      const contextWindow =
        aiSettings.contextWindow !== undefined
          ? aiSettings.contextWindow
          : 16000;
      const systemPrompt = aiSettings.useSystemPrompt
        ? aiSettings.systemPrompt
        : undefined;

      // Save to history
      saveToHistory(prompt, operationMode);

      // Initialize AI service with all available settings
      const aiService = getAIService({
        apiKey,
        model: aiSettings.model || "gemini-2.0-flash",
        temperature: aiSettings.temperature || 0.7,
        maxTokens: aiSettings.maxTokens || 2048,
        topK,
        topP,
        contextWindow,
        systemPrompt,
      });

      // Generate code based on operation mode
      let response;
      switch (operationMode) {
        case "generate":
          response = await aiService.generateVerseCode(prompt);
          break;
        case "debug":
          response = await aiService.debugVerseCode(
            extractCodeFromPrompt(prompt),
            prompt.includes(":")
              ? prompt.split(":")[1].trim()
              : "Please debug this code",
          );
          break;
        case "explain":
          response = await aiService.explainVerseCode(
            extractCodeFromPrompt(prompt),
          );
          break;
        case "continue":
          response = await aiService.continueVerseCode(
            extractCodeFromPrompt(prompt),
            prompt.includes(":")
              ? prompt.split(":")[1].trim()
              : "Please continue or extend this code",
          );
          break;
        case "optimize":
          response = await aiService.optimizeVerseCode(
            extractCodeFromPrompt(prompt),
          );
          break;
        case "document":
          response = await aiService.generateDocumentation(
            extractCodeFromPrompt(prompt),
          );
          break;
        default:
          throw new Error("Invalid operation mode");
      }

      if (response.error) {
        throw new Error(response.error);
      }

      // Save metadata if available
      if (response.metadata) {
        setResponseMetadata(response.metadata);
      }

      let generatedCode = extractCodeFromResponse(response.content);

      // Format code if enabled (only for code generation modes)
      if (
        autoFormat &&
        ["generate", "debug", "continue", "optimize"].includes(operationMode)
      ) {
        try {
          generatedCode = formatVerseCode(generatedCode);
        } catch (formatError) {
          console.error("Error formatting code:", formatError);
        }
      }

      setGeneratedCode(generatedCode);

      // Validate code if enabled (only for code generation modes)
      if (
        autoValidate &&
        ["generate", "debug", "continue", "optimize"].includes(operationMode)
      ) {
        const validationResult = validateVerseCode(generatedCode);
        setErrors([...validationResult.errors, ...validationResult.warnings]);
        setIsValid(validationResult.isValid);

        if (validationResult.warnings.length > 0) {
          toastManager.warning(
            `Generated code has ${validationResult.warnings.length} warning(s)`,
          );
        }
      }
    } catch (error) {
      console.error("Error processing prompt:", error);
      toastManager.error(
        error instanceof Error
          ? error.message
          : "Failed to process your prompt. Please try again.",
      );
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

  // Extract code from prompt (for debug, explain, continue modes)
  const extractCodeFromPrompt = (promptText: string): string => {
    // Check if the prompt contains code blocks
    const codeBlocks = extractCodeBlocks(promptText);
    if (codeBlocks.length > 0) {
      return codeBlocks[0]; // Return the first code block
    }

    // If no code blocks, return the whole prompt
    return promptText;
  };

  // Extract code from AI response
  const extractCodeFromResponse = (content: string): string => {
    // Check if the response contains code blocks
    const codeBlocks = extractCodeBlocks(content);
    if (codeBlocks.length > 0) {
      return codeBlocks[0]; // Return the first code block
    }

    // If no code blocks, return the whole content
    return content;
  };

  // Save prompt to history
  const saveToHistory = (promptText: string, mode: OperationMode) => {
    const historyItem = {
      prompt: promptText,
      timestamp: Date.now(),
      mode: mode,
    };

    // Get existing history
    const savedHistory = localStorage.getItem("promptHistory");
    let history = [];

    if (savedHistory) {
      try {
        history = JSON.parse(savedHistory);
      } catch (e) {
        console.error("Failed to parse prompt history:", e);
      }
    }

    // Add new item to history (avoid duplicates)
    if (!history.some((item: any) => item.prompt === promptText)) {
      history = [historyItem, ...history];
      // Keep only last 50 items
      if (history.length > 50) {
        history = history.slice(0, 50);
      }
      localStorage.setItem("promptHistory", JSON.stringify(history));
    }
  };

  const handleCopyCode = () => {
    toastManager.success(t("editor.code.copied", "Code copied to clipboard!"));
  };

  const handleDownloadCode = () => {
    toastManager.success(
      t("editor.code.downloaded", "Code downloaded successfully!"),
    );
  };

  const handleFormatCode = () => {
    if (generatedCode) {
      try {
        const formattedCode = formatVerseCode(generatedCode);
        setGeneratedCode(formattedCode);
        toastManager.success(t("editor.code.format", "Code formatted"));
      } catch (error) {
        toastManager.error("Error formatting code");
      }
    }
  };

  const handleValidateCode = () => {
    if (generatedCode) {
      const validationResult = validateVerseCode(generatedCode);
      setErrors([...validationResult.errors, ...validationResult.warnings]);
      setIsValid(validationResult.isValid);

      if (validationResult.isValid) {
        toastManager.success(t("editor.code.valid", "Code is valid"));
      } else {
        toastManager.error(
          `${validationResult.errors.length} error(s) found in code`,
        );
      }
    }
  };

  const handleSaveToProject = () => {
    // This would be implemented to save to a project structure
    // For now, we'll just save to localStorage with a timestamp
    if (generatedCode) {
      const savedProjects = localStorage.getItem("savedProjects");
      let projects = [];

      if (savedProjects) {
        try {
          projects = JSON.parse(savedProjects);
        } catch (e) {
          console.error("Failed to parse saved projects:", e);
        }
      }

      const newProject = {
        id: Date.now().toString(),
        name: `Verse Script ${new Date().toLocaleDateString()}`,
        description: `Generated using ${operationMode} mode`,
        code: generatedCode,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      projects.push(newProject);
      localStorage.setItem("savedProjects", JSON.stringify(projects));

      toastManager.success("Script saved to project library");
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#000000] rounded-md overflow-hidden font-['Helvetica',sans-serif]">
      <OperationModeSelector
        selectedMode={operationMode}
        onModeChange={handleModeChange}
      />

      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1 min-h-[600px]"
      >
        <ResizablePanel defaultSize={50} minSize={30} className="p-2">
          <EditorTabs
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
            isValid={isValid}
            errors={errors}
            onCopyCode={handleCopyCode}
            onDownloadCode={handleDownloadCode}
            onFormatCode={handleFormatCode}
            onValidateCode={handleValidateCode}
            onSaveToProject={handleSaveToProject}
            responseMetadata={responseMetadata}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CodeEditor;
