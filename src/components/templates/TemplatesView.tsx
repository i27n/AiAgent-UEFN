import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, Plus, RefreshCw } from "lucide-react";
import TemplateCard from "./TemplateCard";
import { verseSnippets } from "@/lib/verse-syntax";
import { t } from "@/lib/i18n";
import { loadTemplates, Template } from "@/lib/templates";
import ImportTemplateDialog from "./ImportTemplateDialog";
import NewTemplateDialog from "./NewTemplateDialog";

interface TemplatesViewProps {
  onSelectTemplate: (code: string) => void;
}

interface TemplateCategory {
  id: string;
  name: string;
  templates: Template[];
}

const TemplatesView = ({ onSelectTemplate }: TemplatesViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [userTemplates, setUserTemplates] = useState<Template[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load built-in templates and user templates
  useEffect(() => {
    // Built-in templates from verse-syntax
    const builtInCategories = [
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
            category: "Beginner",
            createdAt: 0,
            updatedAt: 0,
            source: "default",
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
            category: "Intermediate",
            createdAt: 0,
            updatedAt: 0,
            source: "default",
          },
          {
            id: "triggerSetup",
            title: t("template.trigger.title", "Trigger Zone Template"),
            description: t(
              "template.trigger.description",
              "A template for creating interactive trigger zones",
            ),
            code: verseSnippets.triggerSetup,
            category: "Intermediate",
            createdAt: 0,
            updatedAt: 0,
            source: "default",
          },
        ],
      },
      {
        id: "systems",
        name: t("templates.category.systems", "Systems"),
        templates: [
          {
            id: "gameFlow",
            title: t("template.ui.title", "UI Component Template"),
            description: t(
              "template.ui.description",
              "A template for creating UI elements in Verse",
            ),
            code: verseSnippets.gameFlow,
            category: "Advanced",
            createdAt: 0,
            updatedAt: 0,
            source: "default",
          },
          {
            id: "itemGranter",
            title: t("template.items.title", "Item Granter Template"),
            description: t(
              "template.items.description",
              "A template for granting items to players",
            ),
            code: verseSnippets.itemGranter || "",
            category: "Intermediate",
            createdAt: 0,
            updatedAt: 0,
            source: "default",
          },
        ],
      },
    ];

    // Load user templates
    const loadedUserTemplates = loadTemplates();
    setUserTemplates(loadedUserTemplates);

    // Create a user templates category if there are any user templates
    const allCategories = [...builtInCategories];
    if (loadedUserTemplates.length > 0) {
      allCategories.unshift({
        id: "user",
        name: "My Templates",
        templates: loadedUserTemplates,
      });
    }

    setCategories(allCategories);
  }, [refreshKey]);

  // Flatten all templates for search
  const allTemplates: Template[] = categories.flatMap((category) =>
    category.templates.map((template) => ({
      ...template,
      category: template.category || category.name,
    })),
  );

  // Filter templates based on search query
  const filteredTemplates =
    searchQuery.trim() !== ""
      ? allTemplates.filter(
          (template) =>
            template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (template.category &&
              template.category
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            (template.tags &&
              template.tags.some((tag) =>
                tag.toLowerCase().includes(searchQuery.toLowerCase()),
              )),
        )
      : [];

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleImportSuccess = () => {
    handleRefresh();
  };

  const handleCreateSuccess = () => {
    handleRefresh();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#a0a0a0]" />
          <Input
            placeholder="Search templates..."
            className="pl-8 bg-[#141414] border-[#2e2e2e] text-[#e1e1e1]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="px-4 pb-4 flex justify-between items-center">
        <div className="flex space-x-2">
          <NewTemplateDialog onCreateSuccess={handleCreateSuccess} />
          <ImportTemplateDialog onImportSuccess={handleImportSuccess} />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          className="h-8 px-2 text-[#a0a0a0] hover:text-[#f3f3f3] hover:bg-[#2e2e2e]"
          title="Refresh templates"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {searchQuery.trim() !== "" ? (
        <div className="flex-1 overflow-hidden px-4">
          <h3 className="text-[#a0a0a0] text-sm font-medium mb-2">
            {filteredTemplates.length}{" "}
            {filteredTemplates.length === 1 ? "result" : "results"}
          </h3>
          <ScrollArea className="h-[calc(100vh-16rem)]">
            <div className="grid grid-cols-1 gap-4 pr-4">
              {filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  title={template.title}
                  description={template.description}
                  code={template.code}
                  category={template.category}
                  onSelect={onSelectTemplate}
                  source={template.source}
                  sourceUrl={template.sourceUrl}
                  id={template.id}
                  onRefresh={handleRefresh}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      ) : (
        <Tabs
          defaultValue={categories[0]?.id || "basics"}
          className="flex-1 px-4"
        >
          <TabsList className="bg-[#141414] mb-4">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="m-0">
              <ScrollArea className="h-[calc(100vh-16rem)]">
                <div className="grid grid-cols-1 gap-4 pr-4">
                  {category.templates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      title={template.title}
                      description={template.description}
                      code={template.code}
                      category={template.category}
                      onSelect={onSelectTemplate}
                      source={template.source}
                      sourceUrl={template.sourceUrl}
                      id={template.id}
                      onRefresh={handleRefresh}
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default TemplatesView;
