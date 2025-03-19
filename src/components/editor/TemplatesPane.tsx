import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FileCode } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { t } from "@/lib/i18n";
import { verseSnippets } from "@/lib/verse-syntax";

interface TemplatesPaneProps {
  onSelectTemplate: (code: string) => void;
}

const TemplatesPane = ({ onSelectTemplate }: TemplatesPaneProps) => {
  return (
    <Card className="h-full flex flex-col bg-[#1b1b1b] border-[#2e2e2e]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-[#e1e1e1] gap-2">
          <FileCode className="h-5 w-5" />
          {t("templates.title", "Verse Templates")}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 pt-2 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="space-y-4 pr-4">
            <div
              className="p-3 bg-[#141414] rounded-md border border-[#2e2e2e] cursor-pointer hover:bg-[#1f1f1f] transition-colors"
              onClick={() => onSelectTemplate(verseSnippets.basicScript)}
            >
              <h3 className="font-medium text-[#f3f3f3] mb-1">
                {t("template.basic.title", "Basic Script Template")}
              </h3>
              <p className="text-[#a0a0a0] text-sm">
                {t(
                  "template.basic.description",
                  "A simple Verse script with a basic function structure",
                )}
              </p>
            </div>

            <div
              className="p-3 bg-[#141414] rounded-md border border-[#2e2e2e] cursor-pointer hover:bg-[#1f1f1f] transition-colors"
              onClick={() => onSelectTemplate(verseSnippets.playerMovement)}
            >
              <h3 className="font-medium text-[#f3f3f3] mb-1">
                {t("template.player.title", "Player Movement Template")}
              </h3>
              <p className="text-[#a0a0a0] text-sm">
                {t(
                  "template.player.description",
                  "A template for handling basic player movement",
                )}
              </p>
            </div>

            <div
              className="p-3 bg-[#141414] rounded-md border border-[#2e2e2e] cursor-pointer hover:bg-[#1f1f1f] transition-colors"
              onClick={() => onSelectTemplate(verseSnippets.triggerSetup)}
            >
              <h3 className="font-medium text-[#f3f3f3] mb-1">
                {t("template.trigger.title", "Trigger Zone Template")}
              </h3>
              <p className="text-[#a0a0a0] text-sm">
                {t(
                  "template.trigger.description",
                  "A template for creating interactive trigger zones",
                )}
              </p>
            </div>

            <div
              className="p-3 bg-[#141414] rounded-md border border-[#2e2e2e] cursor-pointer hover:bg-[#1f1f1f] transition-colors"
              onClick={() => onSelectTemplate(verseSnippets.gameFlow)}
            >
              <h3 className="font-medium text-[#f3f3f3] mb-1">
                {t("template.ui.title", "UI Component Template")}
              </h3>
              <p className="text-[#a0a0a0] text-sm">
                {t(
                  "template.ui.description",
                  "A template for creating UI elements in Verse",
                )}
              </p>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default TemplatesPane;
