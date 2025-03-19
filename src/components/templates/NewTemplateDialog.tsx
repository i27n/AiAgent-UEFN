import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Plus, Save, AlertCircle } from "lucide-react";
import { addTemplate } from "@/lib/templates";
import { toastManager } from "../ui/use-toast-manager";

interface NewTemplateDialogProps {
  onCreateSuccess: () => void;
}

const NewTemplateDialog = ({ onCreateSuccess }: NewTemplateDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateTemplate = () => {
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

      // Add the template
      addTemplate({
        title: title.trim(),
        description: description.trim(),
        code: code.trim(),
        category: category.trim() || "User",
        tags: tagArray,
      });

      toastManager.success("Template created successfully");
      setOpen(false);
      onCreateSuccess();

      // Reset form
      setTitle("");
      setDescription("");
      setCode("");
      setCategory("");
      setTags("");
    } catch (err) {
      setError("An error occurred while creating the template");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-[#141414] border-[#2e2e2e] hover:bg-[#2e2e2e] text-[#e1e1e1]"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-[#1b1b1b] border-[#2e2e2e] text-[#e1e1e1]">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
          <DialogDescription className="text-[#a0a0a0]">
            Create a new template to save for future use.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3 bg-[#141414] border-[#2e2e2e] text-[#e1e1e1]"
              placeholder="My Custom Template"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 bg-[#141414] border-[#2e2e2e] text-[#e1e1e1]"
              placeholder="A brief description of what this template does"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="col-span-3 bg-[#141414] border-[#2e2e2e] text-[#e1e1e1]"
              placeholder="Beginner, Intermediate, Advanced, etc."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="col-span-3 bg-[#141414] border-[#2e2e2e] text-[#e1e1e1]"
              placeholder="movement, ui, gameplay (comma separated)"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="code" className="text-right pt-2">
              Code
            </Label>
            <Textarea
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="col-span-3 min-h-[200px] bg-[#141414] border-[#2e2e2e] text-[#e1e1e1] font-mono"
              placeholder="// Paste your Verse code here"
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
            onClick={() => setOpen(false)}
            className="bg-[#141414] border-[#2e2e2e] hover:bg-[#2e2e2e] text-[#e1e1e1]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateTemplate}
            disabled={isLoading}
            className="bg-[#2e2e2e] hover:bg-[#3e3e3e] text-[#f3f3f3]"
          >
            {isLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Template
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewTemplateDialog;
