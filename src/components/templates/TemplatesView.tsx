import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import TemplateCard from "./TemplateCard";
import { verseSnippets } from "@/lib/verse-syntax";
import { t } from "@/lib/i18n";

interface TemplatesViewProps {
  onSelectTemplate: (code: string) => void;
}

const TemplatesView = ({ onSelectTemplate }: TemplatesViewProps) => {
  const categories = [
    {
      id: "basics",
      name: t("templates.category.basics", "Basics"),
      templates: [
        {
          id: "basicScript",
          title: t("template.basic.title", "Basic Script Template"),
          description: t(
            "template.basic.description",
            "A simple Verse script with a basic function structure",
          ),
          code: verseSnippets.basicScript,
        },
      ],
    },
    {
      id: "gameplay",
      name: t("templates.category.gameplay", "Gameplay"),
      templates: [
        {
          id: "playerMovement",
          title: t("template.player.title", "Player Movement Template"),
          description: t(
            "template.player.description",
            "A template for handling basic player movement",
          ),
          code: verseSnippets.playerMovement,
        },
        {
          id: "triggerSetup",
          title: t("template.trigger.title", "Trigger Zone Template"),
          description: t(
            "template.trigger.description",
            "A template for creating interactive trigger zones",
          ),
          code: verseSnippets.triggerSetup,
        },
      ],
    },
    {
      id: "systems",
      name: t("templates.category.systems", "Systems"),
      templates: [
        {
          id: "gameFlow",
          title: t("template.gameflow.title", "Game Flow Template"),
          description: t(
            "template.gameflow.description",
            "A template for managing game states and flow",
          ),
          code: verseSnippets.gameFlow,
        },
        {
          id: "itemGranter",
          title: t("template.items.title", "Item Granter Template"),
          description: t(
            "template.items.description",
            "A template for granting items to players",
          ),
          code: verseSnippets.itemGranter || "",
        },
      ],
    },
  ];

  return (
    <Tabs defaultValue="basics" className="w-full">
      <TabsList className="w-full bg-[#141414] mb-4">
        {categories.map((category) => (
          <TabsTrigger key={category.id} value={category.id}>
            {category.name}
          </TabsTrigger>
        ))}
      </TabsList>

      {categories.map((category) => (
        <TabsContent key={category.id} value={category.id}>
          <ScrollArea className="h-[calc(100vh-16rem)] pr-4">
            <div className="grid grid-cols-1 gap-4">
              {category.templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  title={template.title}
                  description={template.description}
                  code={template.code}
                  onSelect={onSelectTemplate}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TemplatesView;
