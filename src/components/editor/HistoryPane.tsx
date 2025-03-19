import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { History, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { toastManager } from "../ui/toast";
import { t } from "@/lib/i18n";

interface HistoryPaneProps {
  onSelectPrompt: (prompt: string) => void;
}

const HistoryPane = ({ onSelectPrompt }: HistoryPaneProps) => {
  const [promptHistory, setPromptHistory] = useState<string[]>([]);

  useEffect(() => {
    // Load prompt history from localStorage
    const savedHistory = localStorage.getItem("promptHistory");
    if (savedHistory) {
      try {
        setPromptHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse prompt history:", e);
      }
    }
  }, []);

  const clearHistory = () => {
    setPromptHistory([]);
    localStorage.removeItem("promptHistory");
    toastManager.info(t("history.cleared", "History cleared"));
  };

  return (
    <Card className="h-full flex flex-col bg-[#1b1b1b] border-[#2e2e2e]">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center text-[#e1e1e1] gap-2">
          <History className="h-5 w-5" />
          {t("history.title", "Prompt History")}
        </CardTitle>
        {promptHistory.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="h-8 px-2 text-[#a0a0a0] hover:text-[#f3f3f3] hover:bg-[#2e2e2e]"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {t("history.clear", "Clear")}
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-4 pt-2 flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          {promptHistory.length > 0 ? (
            <div className="space-y-4">
              {promptHistory.map((historyItem, index) => (
                <div
                  key={index}
                  className="p-3 bg-[#141414] rounded-md border border-[#2e2e2e] cursor-pointer hover:bg-[#1f1f1f] transition-colors"
                  onClick={() => onSelectPrompt(historyItem)}
                >
                  <p className="text-[#e1e1e1] line-clamp-2">{historyItem}</p>
                  <p className="text-[#a0a0a0] text-xs mt-1">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[#8a8a8a]">
              <p>{t("history.empty", "No prompt history yet")}</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default HistoryPane;
