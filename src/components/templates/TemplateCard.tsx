import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Copy, Download } from "lucide-react";
import { t } from "@/lib/i18n";
import { copyToClipboard, downloadFile } from "@/lib/utils";

interface TemplateCardProps {
  title: string;
  description: string;
  code: string;
  onSelect: (code: string) => void;
  category?: string;
}

const TemplateCard = ({
  title,
  description,
  code,
  onSelect,
  category,
}: TemplateCardProps) => {
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(code);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadFile(code, `${title.toLowerCase().replace(/\s+/g, "-")}.verse`);
  };

  return (
    <Card
      className="p-4 bg-[#141414] border-[#2e2e2e] cursor-pointer hover:bg-[#1f1f1f] transition-colors"
      onClick={() => onSelect(code)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-[#f3f3f3]">{title}</h3>
          {category && (
            <span className="text-xs text-[#a0a0a0] bg-[#2e2e2e] px-2 py-0.5 rounded-full mt-1 inline-block">
              {category}
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-[#a0a0a0] hover:text-[#f3f3f3] hover:bg-[#2e2e2e]"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-[#a0a0a0] hover:text-[#f3f3f3] hover:bg-[#2e2e2e]"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-[#a0a0a0] text-sm">{description}</p>
    </Card>
  );
};

export default TemplateCard;
