import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import PromptPane from "./PromptPane";
import TemplatesPane from "./TemplatesPane";
import HistoryPane from "./HistoryPane";
import VerseDocViewer from "../documentation/VerseDocViewer";
import { OperationMode } from "./CodeEditor";
import { t } from "@/lib/i18n";
import { MessageSquare, History, FileCode, Book } from "lucide-react";

interface EditorTabsProps {
  operationMode: OperationMode;
  onSubmit: (prompt: string) => void;
  isProcessing: boolean;
  aiConfigured: boolean;
}

const EditorTabs = ({
  operationMode,
  onSubmit,
  isProcessing,
  aiConfigured,
}: EditorTabsProps) => {
  const [activeTab, setActiveTab] = useState<
    "prompt" | "templates" | "history" | "docs"
  >("prompt");
  const [prompt, setPrompt] = useState("");

  const handleTemplateSelect = (templateCode: string) => {
    setPrompt(templateCode);
    setActiveTab("prompt");
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={(v) =>
        setActiveTab(v as "prompt" | "templates" | "history" | "docs")
      }
      className="h-full flex flex-col"
    >
      <TabsList className="mx-4 bg-[#141414]">
        <TabsTrigger value="prompt" className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          {t("editor.tabs.prompt", "Prompt")}
        </TabsTrigger>
        <TabsTrigger value="templates" className="flex items-center gap-2">
          <FileCode className="h-4 w-4" />
          {t("editor.tabs.templates", "Templates")}
        </TabsTrigger>
        <TabsTrigger value="history" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          {t("editor.tabs.history", "History")}
        </TabsTrigger>
        <TabsTrigger value="docs" className="flex items-center gap-2">
          <Book className="h-4 w-4" />
          {t("editor.tabs.docs", "Docs")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="prompt" className="flex-1 overflow-hidden">
        <PromptPane
          operationMode={operationMode}
          onSubmit={onSubmit}
          isProcessing={isProcessing}
          aiConfigured={aiConfigured}
          initialPrompt={prompt}
        />
      </TabsContent>

      <TabsContent value="templates" className="flex-1 overflow-hidden">
        <TemplatesPane onSelectTemplate={handleTemplateSelect} />
      </TabsContent>

      <TabsContent value="history" className="flex-1 overflow-hidden">
        <HistoryPane onSelectPrompt={handleTemplateSelect} />
      </TabsContent>

      <TabsContent value="docs" className="flex-1 overflow-hidden">
        <VerseDocViewer />
      </TabsContent>
    </Tabs>
  );
};

export default EditorTabs;
