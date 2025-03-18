import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Trash2,
  Code,
  FileText,
} from "lucide-react";
import { Separator } from "../ui/separator";
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

interface Script {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectLibraryProps {
  scripts?: Script[];
  onOpenScript?: (scriptId: string) => void;
  onDeleteScript?: (scriptId: string) => void;
}

const ProjectLibrary: React.FC<ProjectLibraryProps> = ({
  scripts = [
    {
      id: "1",
      name: "Basic Movement Controller",
      description: "A script that handles basic character movement in UEFN",
      createdAt: "2023-06-15T10:30:00Z",
      updatedAt: "2023-06-16T14:20:00Z",
    },
    {
      id: "2",
      name: "Inventory System",
      description: "Manages player inventory with item pickup and usage",
      createdAt: "2023-06-18T09:15:00Z",
      updatedAt: "2023-06-18T09:15:00Z",
    },
    {
      id: "3",
      name: "Enemy AI Behavior",
      description: "Controls enemy NPC behavior and pathfinding",
      createdAt: "2023-06-20T16:45:00Z",
      updatedAt: "2023-06-21T11:30:00Z",
    },
  ],
  onOpenScript = () => {},
  onDeleteScript = () => {},
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [scriptToDelete, setScriptToDelete] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (scriptToDelete) {
      onDeleteScript(scriptToDelete);
      setScriptToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="w-full bg-[#1b1b1b] border-[#2e2e2e] shadow-md">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="px-4 py-2 flex flex-row items-center justify-between bg-[#141414] border-b border-[#2e2e2e]">
          <CollapsibleTrigger
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center w-full justify-between"
          >
            <CardTitle className="text-[#e1e1e1] text-lg font-medium flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Project Library
            </CardTitle>
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-[#e1e1e1]" />
            ) : (
              <ChevronDown className="h-5 w-5 text-[#e1e1e1]" />
            )}
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="p-0">
            {scripts.length === 0 ? (
              <div className="p-4 text-center text-[#e1e1e1]">
                No saved scripts yet. Generate and save a script to see it here.
              </div>
            ) : (
              <ScrollArea className="h-[118px] w-full">
                <div className="p-2">
                  {scripts.map((script, index) => (
                    <React.Fragment key={script.id}>
                      <div className="flex items-center justify-between p-2 hover:bg-[#2e2e2e] rounded-md transition-colors">
                        <div className="flex-1 min-w-0">
                          <div
                            className="font-medium text-[#f3f3f3] truncate cursor-pointer hover:text-white"
                            onClick={() => onOpenScript(script.id)}
                          >
                            {script.name}
                          </div>
                          <div className="text-sm text-[#a0a0a0] truncate">
                            {script.description}
                          </div>
                          <div className="text-xs text-[#808080] mt-1">
                            Last updated: {formatDate(script.updatedAt)}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onOpenScript(script.id)}
                            className="h-8 w-8 text-[#e1e1e1] hover:text-white hover:bg-[#3a3a3a]"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-[#e1e1e1] hover:text-red-400 hover:bg-[#3a3a3a]"
                                onClick={() => setScriptToDelete(script.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-[#1b1b1b] border-[#2e2e2e]">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-[#f3f3f3]">
                                  Delete Script
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-[#a0a0a0]">
                                  Are you sure you want to delete "{script.name}
                                  "? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-[#2e2e2e] text-[#e1e1e1] hover:bg-[#3a3a3a] hover:text-white border-none">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-900 text-white hover:bg-red-800"
                                  onClick={handleDeleteConfirm}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      {index < scripts.length - 1 && (
                        <Separator className="my-2 bg-[#2e2e2e]" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default ProjectLibrary;
