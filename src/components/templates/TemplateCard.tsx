import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Copy, Download } from "lucide-react";
import { toastManager } from "../ui/toast";
import { t } from "@/lib/i18n";

interface TemplateCardProps {
  title: string;
  description: string;
  code: string;
  onSelect: (code: string) => void;
}

const TemplateCard = ({
  title,
  description,
  code,
  onSelect,
}: TemplateCardProps) => {
  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    toastManager.success(t("template.copied", "Template copied to clipboard"));
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.verse`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toastManager.success(t("template.downloaded", "Template downloaded"));
  };

  return (
    <Card
      className="p-4 bg-[#141414] border-[#2e2e2e] cursor-pointer hover:bg-[#1f1f1f] transition-colors"
      onClick={() => onSelect(code)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-[#f3f3f3]">{title}</h3>
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
