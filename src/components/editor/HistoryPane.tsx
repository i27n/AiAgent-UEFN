import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { History, Trash2, Clock, Search } from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { t } from "@/lib/i18n";
import { formatDate } from "@/lib/utils";

interface HistoryPaneProps {
  onSelectPrompt: (prompt: string) => void;
}

interface HistoryItem {
  prompt: string;
  timestamp: number;
  mode?: string;
}

const HistoryPane = ({ onSelectPrompt }: HistoryPaneProps) => {
  const [promptHistory, setPromptHistory] = useState<HistoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load prompt history from localStorage
    const savedHistory = localStorage.getItem("promptHistory");
    if (savedHistory) {
      try {
        // Handle both old format (string[]) and new format (HistoryItem[])
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          if (parsed.length > 0 && typeof parsed[0] === "string") {
            // Convert old format to new format
            const converted = parsed.map((prompt: string) => ({
              prompt,
              timestamp: Date.now(),
            }));
            setPromptHistory(converted);
          } else {
            setPromptHistory(parsed);
          }
        }
      } catch (e) {
        console.error("Failed to parse prompt history:", e);
      }
    }
  }, []);

  const clearHistory = () => {
    setPromptHistory([]);
    localStorage.removeItem("promptHistory");
  };

  // Filter history based on search query
  const filteredHistory =
    searchQuery.trim() !== ""
      ? promptHistory.filter(
          (item) =>
            item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.mode &&
              item.mode.toLowerCase().includes(searchQuery.toLowerCase())),
        )
      : promptHistory;

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

      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#a0a0a0]" />
          <Input
            placeholder="Search history..."
            className="pl-8 bg-[#141414] border-[#2e2e2e] text-[#e1e1e1]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <CardContent className="p-4 pt-2 flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-16rem)]">
          {filteredHistory.length > 0 ? (
            <div className="space-y-4">
              {filteredHistory.map((historyItem, index) => (
                <div
                  key={index}
                  className="p-3 bg-[#141414] rounded-md border border-[#2e2e2e] cursor-pointer hover:bg-[#1f1f1f] transition-colors"
                  onClick={() => onSelectPrompt(historyItem.prompt)}
                >
                  <p className="text-[#e1e1e1] line-clamp-2">
                    {historyItem.prompt}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-[#a0a0a0] text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {historyItem.timestamp
                        ? formatDate(historyItem.timestamp)
                        : "Unknown date"}
                    </div>
                    {historyItem.mode && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-[#2e2e2e] text-[#a0a0a0] border-[#3e3e3e]"
                      >
                        {historyItem.mode}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[#8a8a8a]">
              <p>
                {searchQuery
                  ? t("history.no_results", "No matching history items")
                  : t("history.empty", "No prompt history yet")}
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default HistoryPane;
