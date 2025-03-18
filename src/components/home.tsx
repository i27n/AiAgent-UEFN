import React, { useState } from "react";
import { Button } from "./ui/button";
import { Settings, Github } from "lucide-react";
import CodeEditor from "./editor/CodeEditor";
import ProjectLibrary from "./project/ProjectLibrary";
import SettingsDialog from "./settings/SettingsDialog";

const Home = () => {
  const [savedScripts, setSavedScripts] = useState([
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
  ]);

  const [currentScript, setCurrentScript] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleCodeGenerated = (code: string) => {
    setCurrentScript(code);
  };

  const handleOpenScript = (scriptId: string) => {
    // In a real app, we would fetch the script content from storage
    console.log(`Opening script with ID: ${scriptId}`);
    // Mock opening a script
    const script = savedScripts.find((s) => s.id === scriptId);
    if (script) {
      setCurrentScript(
        `// ${script.name}\n// ${script.description}\n\nusing { /Script/VerseEngine }\n\nverse function ${script.name.replace(/\s+/g, "")}() : void\n{\n    // Implementation for ${script.name}\n    Print("${script.name} is running")\n}`,
      );
    }
  };

  const handleDeleteScript = (scriptId: string) => {
    setSavedScripts(savedScripts.filter((script) => script.id !== scriptId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#000000]">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-[#141414] border-b border-[#2e2e2e]">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-[#f3f3f3] mr-2">
            Verse Script Generator
          </h1>
          <span className="bg-[#2e2e2e] text-[#e1e1e1] text-xs px-2 py-1 rounded">
            BETA
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#e1e1e1] hover:text-white"
          >
            <Github className="h-5 w-5" />
          </a>
          <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-4 overflow-hidden">
        {/* Project Library */}
        <ProjectLibrary
          scripts={savedScripts}
          onOpenScript={handleOpenScript}
          onDeleteScript={handleDeleteScript}
        />

        {/* Code Editor */}
        <div className="h-[calc(100vh-250px)]">
          <CodeEditor
            initialCode={currentScript}
            onCodeGenerated={handleCodeGenerated}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-3 bg-[#141414] border-t border-[#2e2e2e] text-center text-[#8a8a8a] text-sm">
        <p>
          AI-Powered UEFN Verse Script Generator &copy;{" "}
          {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default Home;
