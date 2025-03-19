import React, { useState, useEffect } from "react";
import {
  Settings,
  Moon,
  Sun,
  Monitor,
  Code,
  Palette,
  Globe,
  HelpCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { t } from "@/lib/i18n";
import LanguageSelector from "./LanguageSelector";

interface SettingsDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SettingsDialog = ({ open = true, onOpenChange }: SettingsDialogProps) => {
  const [theme, setTheme] = useState<"system" | "dark" | "light">("dark");
  const [autoSave, setAutoSave] = useState(true);
  const [syntaxHighlighting, setSyntaxHighlighting] = useState(true);
  const [realTimeValidation, setRealTimeValidation] = useState(true);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [language, setLanguage] = useState("english");

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

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as
      | "system"
      | "dark"
      | "light";
    if (savedTheme) setTheme(savedTheme);

    const savedEditorSettings = localStorage.getItem("editorSettings");
    if (savedEditorSettings) {
      try {
        const settings = JSON.parse(savedEditorSettings);
        setAutoSave(settings.autoSave !== undefined ? settings.autoSave : true);
        setSyntaxHighlighting(
          settings.syntaxHighlighting !== undefined
            ? settings.syntaxHighlighting
            : true,
        );
        setRealTimeValidation(
          settings.realTimeValidation !== undefined
            ? settings.realTimeValidation
            : true,
        );
        setLineNumbers(
          settings.lineNumbers !== undefined ? settings.lineNumbers : true,
        );
      } catch (e) {
        console.error("Failed to parse editor settings:", e);
      }
    }
  }, []);

  const handleSaveSettings = () => {
    // Save theme
    localStorage.setItem("theme", theme);

    // Save editor settings
    localStorage.setItem(
      "editorSettings",
      JSON.stringify({
        autoSave,
        syntaxHighlighting,
        realTimeValidation,
        lineNumbers,
      }),
    );

    // Apply theme to document
    document.documentElement.classList.remove("light", "dark");
    if (theme === "light") {
      document.documentElement.classList.add("light");
    } else if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      // System theme - check user preference
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.add("light");
      }
    }

    // Close dialog if onOpenChange is provided
    if (onOpenChange) onOpenChange(false);
  };

  const handleCancel = () => {
    if (onOpenChange) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="bg-[#1b1b1b] text-[#e1e1e1]"
          data-settings-trigger
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#141414] text-[#e1e1e1] border-[#2e2e2e]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#f3f3f3] flex items-center justify-between">
            <span>{t("ai.settings.title")}</span>
            <LanguageSelector />
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="appearance" className="mt-4">
          <TabsList className="grid grid-cols-3 gap-2 bg-[#1b1b1b]">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>Editor</span>
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>General</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Theme</h3>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  className={`flex flex-col items-center justify-center p-4 h-auto ${theme === "light" ? "bg-primary" : "bg-[#1b1b1b]"}`}
                  onClick={() => setTheme("light")}
                >
                  <Sun className="h-5 w-5 mb-2" />
                  <span>Light</span>
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  className={`flex flex-col items-center justify-center p-4 h-auto ${theme === "dark" ? "bg-primary" : "bg-[#1b1b1b]"}`}
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="h-5 w-5 mb-2" />
                  <span>Dark</span>
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  className={`flex flex-col items-center justify-center p-4 h-auto ${theme === "system" ? "bg-primary" : "bg-[#1b1b1b]"}`}
                  onClick={() => setTheme("system")}
                >
                  <Monitor className="h-5 w-5 mb-2" />
                  <span>System</span>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="editor" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Editor Preferences</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto Save</p>
                    <p className="text-sm text-[#a0a0a0]">
                      Automatically save your work
                    </p>
                  </div>
                  <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Syntax Highlighting</p>
                    <p className="text-sm text-[#a0a0a0]">
                      Highlight code syntax
                    </p>
                  </div>
                  <Switch
                    checked={syntaxHighlighting}
                    onCheckedChange={setSyntaxHighlighting}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Real-time Validation</p>
                    <p className="text-sm text-[#a0a0a0]">
                      Validate code as you type
                    </p>
                  </div>
                  <Switch
                    checked={realTimeValidation}
                    onCheckedChange={setRealTimeValidation}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Line Numbers</p>
                    <p className="text-sm text-[#a0a0a0]">
                      Show line numbers in editor
                    </p>
                  </div>
                  <Switch
                    checked={lineNumbers}
                    onCheckedChange={setLineNumbers}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Language</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={language === "english" ? "default" : "outline"}
                  className={`${language === "english" ? "bg-primary" : "bg-[#1b1b1b]"}`}
                  onClick={() => {
                    setLanguage("english");
                    import("@/lib/i18n").then(({ setLanguage }) =>
                      setLanguage("en"),
                    );
                  }}
                >
                  English
                </Button>
                <Button
                  variant={language === "arabic" ? "default" : "outline"}
                  className={`${language === "arabic" ? "bg-primary" : "bg-[#1b1b1b]"}`}
                  onClick={() => {
                    setLanguage("arabic");
                    import("@/lib/i18n").then(({ setLanguage }) =>
                      setLanguage("ar"),
                    );
                  }}
                >
                  العربية
                </Button>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium">Help & Support</h3>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-[#1b1b1b] hover:bg-[#2e2e2e]"
                  >
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Documentation
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            className="bg-[#1b1b1b] hover:bg-[#2e2e2e] text-[#e1e1e1]"
            onClick={handleCancel}
          >
            {t("app.cancel")}
          </Button>
          <Button
            className="bg-[#2e2e2e] hover:bg-[#3e3e3e] text-[#f3f3f3]"
            onClick={handleSaveSettings}
          >
            {t("app.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
