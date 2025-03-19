import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Brain,
  Sparkles,
  Sliders,
  Save,
  Zap,
  Code,
  Cpu,
  Wrench,
  Globe,
} from "lucide-react";
import { getAIService } from "@/lib/ai";
import { t } from "@/lib/i18n";
import LanguageSelector from "./LanguageSelector";
import { toastManager } from "../ui/use-toast-manager";

interface AISettingsProps {
  onSave?: () => void;
}

const AISettings = ({ onSave = () => {} }: AISettingsProps) => {
  // Force re-render when language changes
  const [, setRender] = useState(0);

  useEffect(() => {
    const handleLanguageChange = () => {
      setRender((prev) => prev + 1);
    };

    window.addEventListener("languageChanged", handleLanguageChange);
    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, []);

  // API Settings
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gemini-2.0-flash");
  const [apiEndpoint, setApiEndpoint] = useState(
    "https://generativelanguage.googleapis.com/v1beta/models",
  );

  // Generation Settings
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [topK, setTopK] = useState(40);
  const [topP, setTopP] = useState(0.95);

  // Code Settings
  const [autoValidate, setAutoValidate] = useState(true);
  const [autoFormat, setAutoFormat] = useState(true);
  const [syntaxHighlighting, setSyntaxHighlighting] = useState(true);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [saveInterval, setSaveInterval] = useState(60); // seconds

  // Advanced Settings
  const [contextWindow, setContextWindow] = useState(16000);
  const [useSystemPrompt, setUseSystemPrompt] = useState(true);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are an expert Verse programmer for Unreal Engine Fortnite (UEFN). Your task is to generate high-quality, optimized Verse code based on user requests. Include detailed comments and follow best practices.",
  );

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("geminiApiKey");
    if (savedApiKey) setApiKey(savedApiKey);

    const savedSettings = localStorage.getItem("aiSettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        // API Settings
        if (settings.model) setModel(settings.model);
        if (settings.apiEndpoint) setApiEndpoint(settings.apiEndpoint);

        // Generation Settings
        if (settings.temperature !== undefined)
          setTemperature(settings.temperature);
        if (settings.maxTokens !== undefined) setMaxTokens(settings.maxTokens);
        if (settings.topK !== undefined) setTopK(settings.topK);
        if (settings.topP !== undefined) setTopP(settings.topP);

        // Code Settings
        if (settings.autoValidate !== undefined)
          setAutoValidate(settings.autoValidate);
        if (settings.autoFormat !== undefined)
          setAutoFormat(settings.autoFormat);
        if (settings.syntaxHighlighting !== undefined)
          setSyntaxHighlighting(settings.syntaxHighlighting);
        if (settings.lineNumbers !== undefined)
          setLineNumbers(settings.lineNumbers);
        if (settings.autoSave !== undefined) setAutoSave(settings.autoSave);
        if (settings.saveInterval !== undefined)
          setSaveInterval(settings.saveInterval);

        // Advanced Settings
        if (settings.contextWindow !== undefined)
          setContextWindow(settings.contextWindow);
        if (settings.useSystemPrompt !== undefined)
          setUseSystemPrompt(settings.useSystemPrompt);
        if (settings.systemPrompt) setSystemPrompt(settings.systemPrompt);
      } catch (e) {
        console.error("Failed to parse AI settings:", e);
      }
    }
  }, []);

  const handleSaveSettings = () => {
    // Show saving indicator
    toastManager.info("Saving settings...");
    // Initialize the AI service with the new settings
    if (apiKey) {
      getAIService({
        apiKey,
        model,
        temperature,
        maxTokens,
        topK,
        topP,
        contextWindow,
        systemPrompt: useSystemPrompt ? systemPrompt : undefined,
      });

      // Save settings to localStorage for persistence
      localStorage.setItem(
        "aiSettings",
        JSON.stringify({
          // API Settings
          model,
          apiEndpoint,

          // Generation Settings
          temperature,
          maxTokens,
          topK,
          topP,

          // Code Settings
          autoValidate,
          autoFormat,
          syntaxHighlighting,
          lineNumbers,
          autoSave,
          saveInterval,

          // Advanced Settings
          contextWindow,
          useSystemPrompt,
          systemPrompt,
        }),
      );

      // Store API key separately and more securely
      localStorage.setItem("geminiApiKey", apiKey);

      // Apply settings immediately
      document.documentElement.style.setProperty(
        "--font-family",
        "Helvetica, sans-serif",
      );

      // Show success message using toast
      toastManager.success("Settings saved and applied successfully!");

      // Reload the page to apply settings fully
      setTimeout(() => {
        window.location.reload();
      }, 1500);

      onSave();
    } else {
      toastManager.error("API key is required to save settings");
    }
  };

  const handleResetSettings = () => {
    // Reset to defaults
    setModel("gemini-2.0-flash");
    setApiEndpoint("https://generativelanguage.googleapis.com/v1beta/models");
    setTemperature(0.7);
    setMaxTokens(2048);
    setTopK(40);
    setTopP(0.95);
    setAutoValidate(true);
    setAutoFormat(true);
    setSyntaxHighlighting(true);
    setLineNumbers(true);
    setAutoSave(true);
    setSaveInterval(60);
    setContextWindow(16000);
    setUseSystemPrompt(true);
    setSystemPrompt(
      "You are an expert Verse programmer for Unreal Engine Fortnite (UEFN). Your task is to generate high-quality, optimized Verse code based on user requests. Include detailed comments and follow best practices.",
    );

    toastManager.info("Settings reset to defaults. Click Save to apply.");
  };

  const handleTestConnection = async () => {
    if (!apiKey) {
      toastManager.error("API key is required to test connection");
      return;
    }

    try {
      const aiService = getAIService({
        apiKey,
        model,
      });

      const response = await aiService.generateContent(
        "Hello, please respond with 'Connection successful' if you can receive this message.",
      );

      if (response.error) {
        throw new Error(response.error);
      }

      toastManager.success("Connection successful! API key is valid.");
    } catch (error) {
      toastManager.error(
        `Connection failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  return (
    <Card className="w-full bg-[#1b1b1b] border-[#2e2e2e] shadow-md font-['Helvetica',sans-serif]">
      <CardHeader className="px-4 py-3 flex flex-row items-center justify-between bg-[#141414] border-b border-[#2e2e2e]">
        <CardTitle className="text-[#e1e1e1] text-lg font-medium flex items-center">
          <Brain className="mr-2 h-5 w-5" />
          {t("ai.settings.title")}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestConnection}
            className="bg-[#141414] border-[#2e2e2e] hover:bg-[#2e2e2e] text-[#e1e1e1]"
          >
            <Zap className="mr-2 h-4 w-4" />
            Test Connection
          </Button>
          <LanguageSelector />
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#141414]">
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>API</span>
            </TabsTrigger>
            <TabsTrigger value="generation" className="flex items-center gap-2">
              <Sliders className="h-4 w-4" />
              <span>Generation</span>
            </TabsTrigger>
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>Code</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              <span>Advanced</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="api-key" className="text-[#e1e1e1]">
                {t("ai.settings.apiKey")}
              </Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={t("ai.settings.apiKey.placeholder")}
                className="bg-[#141414] border-[#2e2e2e] text-[#e1e1e1] w-full"
                dir="ltr"
              />
              <p className="text-xs text-[#a0a0a0]">
                {t("ai.settings.apiKey.help")}{" "}
                <a
                  href="https://ai.google.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model" className="text-[#e1e1e1]">
                {t("ai.settings.model")}
              </Label>
              <select
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full rounded-md border border-[#2e2e2e] bg-[#141414] px-3 py-2 text-[#e1e1e1]"
              >
                <option value="gemini-2.0-flash">
                  Gemini 2.0 Flash (Fast)
                </option>
                <option value="gemini-2.0-pro">
                  Gemini 2.0 Pro (Powerful)
                </option>
                <option value="gemini-1.5-flash">
                  Gemini 1.5 Flash (Legacy)
                </option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Legacy)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-endpoint" className="text-[#e1e1e1]">
                API Endpoint
              </Label>
              <Input
                id="api-endpoint"
                type="text"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                placeholder="https://generativelanguage.googleapis.com/v1beta/models"
                className="bg-[#141414] border-[#2e2e2e] text-[#e1e1e1]"
              />
              <p className="text-xs text-[#a0a0a0]">
                Base URL for the Gemini API. Only change if you're using a proxy
                or custom endpoint.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="generation" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="temperature" className="text-[#e1e1e1]">
                    {t("ai.settings.temperature")}: {temperature.toFixed(1)}
                  </Label>
                  <span className="text-xs text-[#a0a0a0]">
                    {temperature < 0.3
                      ? t("ai.settings.temperature.focused")
                      : temperature > 0.7
                        ? t("ai.settings.temperature.creative")
                        : t("ai.settings.temperature.balanced")}
                  </span>
                </div>
                <Slider
                  id="temperature"
                  min={0}
                  max={1}
                  step={0.1}
                  value={[temperature]}
                  onValueChange={(value) => setTemperature(value[0])}
                  className="w-full"
                />
                <p className="text-xs text-[#a0a0a0]">
                  Controls randomness: Lower values are more deterministic,
                  higher values more creative.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="max-tokens" className="text-[#e1e1e1]">
                    {t("ai.settings.maxTokens")}: {maxTokens}
                  </Label>
                  <span className="text-xs text-[#a0a0a0]">
                    {maxTokens < 1000
                      ? t("ai.settings.maxTokens.shorter")
                      : maxTokens > 3000
                        ? t("ai.settings.maxTokens.longer")
                        : t("ai.settings.maxTokens.medium")}
                  </span>
                </div>
                <Slider
                  id="max-tokens"
                  min={256}
                  max={8192}
                  step={256}
                  value={[maxTokens]}
                  onValueChange={(value) => setMaxTokens(value[0])}
                  className="w-full"
                />
                <p className="text-xs text-[#a0a0a0]">
                  Maximum length of generated text. Higher values allow for
                  longer code generation.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="top-k" className="text-[#e1e1e1]">
                    Top-K: {topK}
                  </Label>
                </div>
                <Slider
                  id="top-k"
                  min={1}
                  max={100}
                  step={1}
                  value={[topK]}
                  onValueChange={(value) => setTopK(value[0])}
                  className="w-full"
                />
                <p className="text-xs text-[#a0a0a0]">
                  Limits token selection to the top K most likely tokens. Lower
                  values produce more focused output.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="top-p" className="text-[#e1e1e1]">
                    Top-P: {topP.toFixed(2)}
                  </Label>
                </div>
                <Slider
                  id="top-p"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={[topP]}
                  onValueChange={(value) => setTopP(value[0])}
                  className="w-full"
                />
                <p className="text-xs text-[#a0a0a0]">
                  Nucleus sampling: Only considers tokens with cumulative
                  probability ≤ top_p.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pt-2">
                <div>
                  <Label htmlFor="auto-validate" className="text-[#e1e1e1]">
                    {t("ai.settings.autoValidate")}
                  </Label>
                  <p className="text-xs text-[#a0a0a0]">
                    {t("ai.settings.autoValidate.description")}
                  </p>
                </div>
                <Switch
                  id="auto-validate"
                  checked={autoValidate}
                  onCheckedChange={setAutoValidate}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <Label htmlFor="auto-format" className="text-[#e1e1e1]">
                    {t("ai.settings.autoFormat")}
                  </Label>
                  <p className="text-xs text-[#a0a0a0]">
                    {t("ai.settings.autoFormat.description")}
                  </p>
                </div>
                <Switch
                  id="auto-format"
                  checked={autoFormat}
                  onCheckedChange={setAutoFormat}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <Label
                    htmlFor="syntax-highlighting"
                    className="text-[#e1e1e1]"
                  >
                    Syntax Highlighting
                  </Label>
                  <p className="text-xs text-[#a0a0a0]">
                    Highlight Verse syntax in the code editor
                  </p>
                </div>
                <Switch
                  id="syntax-highlighting"
                  checked={syntaxHighlighting}
                  onCheckedChange={setSyntaxHighlighting}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <Label htmlFor="line-numbers" className="text-[#e1e1e1]">
                    Line Numbers
                  </Label>
                  <p className="text-xs text-[#a0a0a0]">
                    Show line numbers in the code editor
                  </p>
                </div>
                <Switch
                  id="line-numbers"
                  checked={lineNumbers}
                  onCheckedChange={setLineNumbers}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <Label htmlFor="auto-save" className="text-[#e1e1e1]">
                    Auto Save
                  </Label>
                  <p className="text-xs text-[#a0a0a0]">
                    Automatically save generated code to local storage
                  </p>
                </div>
                <Switch
                  id="auto-save"
                  checked={autoSave}
                  onCheckedChange={setAutoSave}
                />
              </div>

              {autoSave && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="save-interval" className="text-[#e1e1e1]">
                      Save Interval: {saveInterval} seconds
                    </Label>
                  </div>
                  <Slider
                    id="save-interval"
                    min={10}
                    max={300}
                    step={10}
                    value={[saveInterval]}
                    onValueChange={(value) => setSaveInterval(value[0])}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="context-window" className="text-[#e1e1e1]">
                    Context Window: {contextWindow} tokens
                  </Label>
                </div>
                <Slider
                  id="context-window"
                  min={4000}
                  max={32000}
                  step={1000}
                  value={[contextWindow]}
                  onValueChange={(value) => setContextWindow(value[0])}
                  className="w-full"
                />
                <p className="text-xs text-[#a0a0a0]">
                  Maximum tokens to include in context. Higher values allow for
                  more complex prompts but may be slower.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <Label htmlFor="use-system-prompt" className="text-[#e1e1e1]">
                    Use System Prompt
                  </Label>
                  <p className="text-xs text-[#a0a0a0]">
                    Include a system prompt to guide the AI's behavior
                  </p>
                </div>
                <Switch
                  id="use-system-prompt"
                  checked={useSystemPrompt}
                  onCheckedChange={setUseSystemPrompt}
                />
              </div>

              {useSystemPrompt && (
                <div className="space-y-2">
                  <Label htmlFor="system-prompt" className="text-[#e1e1e1]">
                    System Prompt
                  </Label>
                  <textarea
                    id="system-prompt"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    rows={4}
                    className="w-full rounded-md border border-[#2e2e2e] bg-[#141414] px-3 py-2 text-[#e1e1e1]"
                  />
                  <p className="text-xs text-[#a0a0a0]">
                    Instructions that guide the AI's behavior and expertise.
                    This helps set the tone and capabilities.
                  </p>
                </div>
              )}

              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={handleResetSettings}
                  className="bg-[#141414] border-[#2e2e2e] hover:bg-[#2e2e2e] text-[#e1e1e1]"
                >
                  <Wrench className="mr-2 h-4 w-4" />
                  Reset to Defaults
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => onSave()}
            className="bg-[#141414] border-[#2e2e2e] hover:bg-[#2e2e2e] text-[#e1e1e1]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveSettings}
            disabled={!apiKey}
            className="bg-[#2e2e2e] hover:bg-[#3e3e3e] text-[#f3f3f3]"
          >
            <Save className="mr-2 h-4 w-4" />
            {t("ai.settings.save")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AISettings;
