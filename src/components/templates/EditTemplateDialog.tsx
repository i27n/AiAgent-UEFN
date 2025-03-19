import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Save, AlertCircle } from "lucide-react";
import { updateTemplate, Template } from "@/lib/templates";
import { toastManager } from "../ui/use-toast-manager";

interface EditTemplateDialogProps {
  template: Template;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEditSuccess: () => void;
}

const EditTemplateDialog = ({
  template,
  open,
  onOpenChange,
  onEditSuccess,
}: EditTemplateDialogProps) => {
  const [title, setTitle] = useState(template.title);
  const [description, setDescription] = useState(template.description);
  const [code, setCode] = useState(template.code);
  const [category, setCategory] = useState(template.category || "");
  const [tags, setTags] = useState(template.tags?.join(", ") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateTemplate = () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!title.trim()) {
        setError("Title is required");
        setIsLoading(false);
        return;
      }

      if (!code.trim()) {
        setError("Code is required");
        setIsLoading(false);
        return;
      }

      // Process tags
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // Update the template
      const result = updateTemplate(template.id, {
        title: title.trim(),
        description: description.trim(),
        code: code.trim(),
        category: category.trim() || undefined,
        tags: tagArray,
      });

      if (result) {
        toastManager.success("Template updated successfully");
        onOpenChange(false);
        onEditSuccess();
      } else {
        setError("Failed to update template");
      }
    } catch (err) {
      setError("An error occurred while updating the template");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#1b1b1b] border-[#2e2e2e] text-[#e1e1e1]">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
          <DialogDescription className="text-[#a0a0a0]">
            Update your template details.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-title" className="text-right">
              Title
            </Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3 bg-[#141414] border-[#2e2e2e] text-[#e1e1e1]"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-description" className="text-right">
              Description
            </Label>
            <Input
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 bg-[#141414] border-[#2e2e2e] text-[#e1e1e1]"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-category" className="text-right">
              Category
            </Label>
            <Input
              id="edit-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="col-span-3 bg-[#141414] border-[#2e2e2e] text-[#e1e1e1]"
              placeholder="Beginner, Intermediate, Advanced, etc."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-tags" className="text-right">
              Tags
            </Label>
            <Input
              id="edit-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="col-span-3 bg-[#141414] border-[#2e2e2e] text-[#e1e1e1]"
              placeholder="movement, ui, gameplay (comma separated)"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="edit-code" className="text-right pt-2">
              Code
            </Label>
            <Textarea
              id="edit-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="col-span-3 min-h-[200px] bg-[#141414] border-[#2e2e2e] text-[#e1e1e1] font-mono"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700/50 p-3 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-[#141414] border-[#2e2e2e] hover:bg-[#2e2e2e] text-[#e1e1e1]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateTemplate}
            disabled={isLoading}
            className="bg-[#2e2e2e] hover:bg-[#3e3e3e] text-[#f3f3f3]"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update Template
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTemplateDialog;
