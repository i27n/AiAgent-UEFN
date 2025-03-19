import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Search, Book, Code, Box, Zap, Hash } from "lucide-react";
import {
  verseDocumentation,
  VerseDocItem,
  searchVerseDocumentation,
  getVerseDocumentationByCategory,
} from "@/lib/verse-documentation";
import { Button } from "../ui/button";
import { toastManager } from "../ui/use-toast-manager";
import { copyToClipboard } from "@/lib/utils";

const VerseDocViewer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItem, setSelectedItem] = useState<VerseDocItem | null>(null);

  // Filter documentation items based on search and category
  const filteredItems =
    searchQuery.trim() !== ""
      ? searchVerseDocumentation(searchQuery)
      : selectedCategory === "all"
        ? verseDocumentation
        : getVerseDocumentationByCategory(selectedCategory);

  const handleCopyExample = (example: string) => {
    copyToClipboard(example);
    toastManager.success("Example copied to clipboard");
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "keyword":
        return <Hash className="h-4 w-4" />;
      case "type":
        return <Box className="h-4 w-4" />;
      case "function":
        return <Code className="h-4 w-4" />;
      case "device":
        return <Box className="h-4 w-4" />;
      case "event":
        return <Zap className="h-4 w-4" />;
      case "namespace":
        return <Book className="h-4 w-4" />;
      default:
        return <Code className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "keyword":
        return "bg-blue-900/20 text-blue-400 border-blue-800";
      case "type":
        return "bg-green-900/20 text-green-400 border-green-800";
      case "function":
        return "bg-purple-900/20 text-purple-400 border-purple-800";
      case "device":
        return "bg-orange-900/20 text-orange-400 border-orange-800";
      case "event":
        return "bg-yellow-900/20 text-yellow-400 border-yellow-800";
      case "namespace":
        return "bg-indigo-900/20 text-indigo-400 border-indigo-800";
      default:
        return "bg-gray-900/20 text-gray-400 border-gray-800";
    }
  };

  return (
    <Card className="h-full flex flex-col bg-[#1b1b1b] border-[#2e2e2e]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-[#e1e1e1] gap-2">
          <Book className="h-5 w-5" />
          Verse Documentation
        </CardTitle>
      </CardHeader>

      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#a0a0a0]" />
          <Input
            placeholder="Search Verse documentation..."
            className="pl-8 bg-[#141414] border-[#2e2e2e] text-[#e1e1e1]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs
        value={selectedCategory}
        onValueChange={setSelectedCategory}
        className="flex-1 flex flex-col px-4"
      >
        <TabsList className="bg-[#141414]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="keyword">Keywords</TabsTrigger>
          <TabsTrigger value="type">Types</TabsTrigger>
          <TabsTrigger value="function">Functions</TabsTrigger>
          <TabsTrigger value="device">Devices</TabsTrigger>
          <TabsTrigger value="event">Events</TabsTrigger>
        </TabsList>

        <div className="flex flex-1 overflow-hidden mt-4">
          {/* Documentation list */}
          <div className="w-1/3 pr-2">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              <div className="space-y-2">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div
                      key={item.name}
                      className={`p-2 rounded-md cursor-pointer transition-colors ${selectedItem?.name === item.name ? "bg-[#2e2e2e]" : "bg-[#141414] hover:bg-[#1f1f1f]"}`}
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getCategoryIcon(item.category)}
                          <span className="ml-2 text-[#e1e1e1] font-medium">
                            {item.name}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={getCategoryColor(item.category)}
                        >
                          {item.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#a0a0a0] mt-1 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-[#a0a0a0]">
                    No documentation items found
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Documentation details */}
          <div className="w-2/3 pl-2 border-l border-[#2e2e2e]">
            <ScrollArea className="h-[calc(100vh-16rem)]">
              {selectedItem ? (
                <div className="p-4 bg-[#141414] rounded-md">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#f3f3f3]">
                      {selectedItem.name}
                    </h2>
                    <Badge
                      variant="outline"
                      className={getCategoryColor(selectedItem.category)}
                    >
                      {selectedItem.category}
                    </Badge>
                  </div>

                  <p className="mt-2 text-[#e1e1e1]">
                    {selectedItem.description}
                  </p>

                  {selectedItem.syntax && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-[#a0a0a0]">
                        Syntax
                      </h3>
                      <pre className="mt-1 p-2 bg-[#0f0f0f] rounded-md text-[#e1e1e1] overflow-x-auto">
                        <code>{selectedItem.syntax}</code>
                      </pre>
                    </div>
                  )}

                  {selectedItem.example && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-[#a0a0a0]">
                          Example
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs text-[#a0a0a0] hover:text-[#f3f3f3]"
                          onClick={() =>
                            handleCopyExample(selectedItem.example || "")
                          }
                        >
                          Copy
                        </Button>
                      </div>
                      <pre className="mt-1 p-2 bg-[#0f0f0f] rounded-md text-[#e1e1e1] overflow-x-auto">
                        <code>{selectedItem.example}</code>
                      </pre>
                    </div>
                  )}

                  {selectedItem.params && selectedItem.params.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-[#a0a0a0]">
                        Parameters
                      </h3>
                      <div className="mt-1 space-y-2">
                        {selectedItem.params.map((param) => (
                          <div key={param.name} className="flex">
                            <span className="text-[#e1e1e1] font-medium">
                              {param.name}
                            </span>
                            <span className="text-[#a0a0a0] mx-2">:</span>
                            <span className="text-green-400">{param.type}</span>
                            <span className="text-[#a0a0a0] mx-2">-</span>
                            <span className="text-[#e1e1e1]">
                              {param.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedItem.returnType && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-[#a0a0a0]">
                        Return Type
                      </h3>
                      <div className="mt-1">
                        <span className="text-green-400">
                          {selectedItem.returnType}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedItem.url && (
                    <div className="mt-4">
                      <a
                        href={selectedItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline text-sm"
                      >
                        View full documentation
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[#a0a0a0]">
                  <Book className="h-16 w-16 mb-4 opacity-20" />
                  <p>Select an item to view documentation</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </Tabs>
    </Card>
  );
};

export default VerseDocViewer;
