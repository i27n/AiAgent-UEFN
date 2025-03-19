import React, { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import {
  Copy,
  Download,
  Trash2,
  Edit,
  Github,
  ExternalLink,
} from "lucide-react";
import { t } from "@/lib/i18n";
import { copyToClipboard, downloadFile } from "@/lib/utils";
import { deleteTemplate } from "@/lib/templates";
import { toastManager } from "../ui/use-toast-manager";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import EditTemplateDialog from "./EditTemplateDialog";

interface TemplateCardProps {
  id: string;
  title: string;
  description: string;
  code: string;
  onSelect: (code: string) => void;
  category?: string;
  source?: string;
  sourceUrl?: string;
  onRefresh: () => void;
}

const TemplateCard = ({
  id,
  title,
  description,
  code,
  onSelect,
  category,
  source,
  sourceUrl,
  onRefresh,
}: TemplateCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(code);
    toastManager.success("Code copied to clipboard");
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadFile(code, `${title.toLowerCase().replace(/\s+/g, "-")}.verse`);
    toastManager.success("Template downloaded");
  };

  const handleDelete = () => {
    if (source === "default") {
      toastManager.error("Cannot delete built-in templates");
      return;
    }

    const success = deleteTemplate(id);
    if (success) {
      toastManager.success("Template deleted");
      onRefresh();
    } else {
      toastManager.error("Failed to delete template");
    }
    setShowDeleteDialog(false);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (source === "default") {
      toastManager.info(
        "Cannot edit built-in templates. Save as a new template instead.",
      );
      return;
    }
    setShowEditDialog(true);
  };

  const handleSourceLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (sourceUrl) {
      window.open(sourceUrl, "_blank");
    }
  };

  return (
    <Card
      className="p-4 bg-[#141414] border-[#2e2e2e] cursor-pointer hover:bg-[#1f1f1f] transition-colors"
      onClick={() => onSelect(code)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium text-[#f3f3f3]">{title}</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {category && (
              <span className="text-xs text-[#a0a0a0] bg-[#2e2e2e] px-2 py-0.5 rounded-full inline-block">
                {category}
              </span>
            )}
            {source && source !== "default" && (
              <span className="text-xs text-[#a0a0a0] bg-[#2e2e2e] px-2 py-0.5 rounded-full inline-block flex items-center">
                {source === "github" && <Github className="h-3 w-3 mr-1" />}
                {source}
              </span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          {sourceUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-[#a0a0a0] hover:text-[#f3f3f3] hover:bg-[#2e2e2e]"
              onClick={handleSourceLink}
              title="View source"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-[#a0a0a0] hover:text-[#f3f3f3] hover:bg-[#2e2e2e]"
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-[#a0a0a0] hover:text-[#f3f3f3] hover:bg-[#2e2e2e]"
            onClick={handleDownload}
            title="Download as file"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-[#a0a0a0] hover:text-[#f3f3f3] hover:bg-[#2e2e2e]"
            onClick={handleEdit}
            title={
              source === "default"
                ? "Cannot edit built-in templates"
                : "Edit template"
            }
          >
            <Edit className="h-4 w-4" />
          </Button>
          {source !== "default" && (
            <AlertDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
            >
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-[#a0a0a0] hover:text-red-400 hover:bg-[#2e2e2e]"
                  onClick={(e) => e.stopPropagation()}
                  title="Delete template"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#1b1b1b] border-[#2e2e2e]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-[#f3f3f3]">
                    Delete Template
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-[#a0a0a0]">
                    Are you sure you want to delete "{title}"? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-[#2e2e2e] text-[#e1e1e1] hover:bg-[#3a3a3a] hover:text-white border-none">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-900 text-white hover:bg-red-800"
                    onClick={handleDelete}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      <p className="text-[#a0a0a0] text-sm">{description}</p>

      {showEditDialog && (
        <EditTemplateDialog
          template={{
            id,
            title,
            description,
            code,
            category: category || "",
            tags: [],
            createdAt: 0,
            updatedAt: 0,
          }}
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onEditSuccess={onRefresh}
        />
      )}
    </Card>
  );
};

export default TemplateCard;
