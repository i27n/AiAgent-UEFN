import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FileCode } from "lucide-react";
import TemplatesView from "../templates/TemplatesView";
import { t } from "@/lib/i18n";

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
        <TemplatesView onSelectTemplate={onSelectTemplate} />
      </CardContent>
    </Card>
  );
};

export default TemplatesPane;
