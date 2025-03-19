import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Brain, Sparkles, Sliders, Save } from "lucide-react";
import { getAIService } from "@/lib/ai";
import { t } from "@/lib/i18n";
import LanguageSelector from "./LanguageSelector";

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
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("gemini-2.0-flash");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [autoValidate, setAutoValidate] = useState(true);
  const [autoFormat, setAutoFormat] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem("geminiApiKey");
    if (savedApiKey) setApiKey(savedApiKey);

    const savedSettings = localStorage.getItem("aiSettings");
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        if (settings.model) setModel(settings.model);
        if (settings.temperature !== undefined)
          setTemperature(settings.temperature);
        if (settings.maxTokens !== undefined) setMaxTokens(settings.maxTokens);
        if (settings.autoValidate !== undefined)
          setAutoValidate(settings.autoValidate);
        if (settings.autoFormat !== undefined)
          setAutoFormat(settings.autoFormat);
      } catch (e) {
        console.error("Failed to parse AI settings:", e);
      }
    }
  }, []);

  const handleSaveSettings = () => {
    // Initialize the AI service with the new settings
    if (apiKey) {
      getAIService({
        apiKey,
        model,
        temperature,
        maxTokens,
      });

      // Save settings to localStorage for persistence
      localStorage.setItem(
        "aiSettings",
        JSON.stringify({
          model,
          temperature,
          maxTokens,
          autoValidate,
          autoFormat,
        }),
      );

      // Store API key separately and more securely
      localStorage.setItem("geminiApiKey", apiKey);

      // Show success message
      const successMessage = document.createElement("div");
      successMessage.className =
        "fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50";
      successMessage.textContent = "Settings saved successfully!";
      document.body.appendChild(successMessage);

      // Remove the message after 3 seconds
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);

      onSave();
    }
  };

  return (
    <Card className="w-full bg-[#1b1b1b] border-[#2e2e2e] shadow-md">
      <CardHeader className="px-4 py-3 flex flex-row items-center justify-between bg-[#141414] border-b border-[#2e2e2e]">
        <CardTitle className="text-[#e1e1e1] text-lg font-medium flex items-center">
          <Brain className="mr-2 h-5 w-5" />
          {t("ai.settings.title")}
        </CardTitle>
        <LanguageSelector />
      </CardHeader>

      <CardContent className="p-4">
        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-[#141414]">
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>API Settings</span>
            </TabsTrigger>
            <TabsTrigger value="generation" className="flex items-center gap-2">
              <Sliders className="h-4 w-4" />
              <span>Generation</span>
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
                className="bg-[#141414] border-[#2e2e2e] text-[#e1e1e1]"
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
                  max={4096}
                  step={256}
                  value={[maxTokens]}
                  onValueChange={(value) => setMaxTokens(value[0])}
                  className="w-full"
                />
              </div>

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
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
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
