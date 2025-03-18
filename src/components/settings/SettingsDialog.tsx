import React, { useState } from "react";
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="bg-[#1b1b1b] text-[#e1e1e1]"
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#141414] text-[#e1e1e1] border-[#2e2e2e]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#f3f3f3]">
            Settings
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
                  onClick={() => setLanguage("english")}
                >
                  English
                </Button>
                <Button
                  variant={language === "spanish" ? "default" : "outline"}
                  className={`${language === "spanish" ? "bg-primary" : "bg-[#1b1b1b]"}`}
                  onClick={() => setLanguage("spanish")}
                >
                  Spanish
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
          >
            Cancel
          </Button>
          <Button className="bg-[#2e2e2e] hover:bg-[#3e3e3e] text-[#f3f3f3]">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
