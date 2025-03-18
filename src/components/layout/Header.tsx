import React from "react";
import { Settings, Code, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  onOpenSettings?: () => void;
}

const Header = ({ onOpenSettings = () => {} }: HeaderProps) => {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-[#141414] border-b border-[#2e2e2e] w-full">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Code className="h-6 w-6 text-[#e1e1e1] mr-2" />
          <h1 className="text-xl font-bold text-[#f3f3f3] font-sans">
            Verse Script Generator
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#e1e1e1] hover:text-white hover:bg-[#2e2e2e]"
                onClick={onOpenSettings}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#e1e1e1] hover:text-white hover:bg-[#2e2e2e]"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-[#1b1b1b] border-[#2e2e2e]"
          >
            <DropdownMenuItem className="text-[#e1e1e1] hover:bg-[#2e2e2e] cursor-pointer">
              New Project
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#e1e1e1] hover:bg-[#2e2e2e] cursor-pointer">
              Documentation
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[#e1e1e1] hover:bg-[#2e2e2e] cursor-pointer">
              About
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
