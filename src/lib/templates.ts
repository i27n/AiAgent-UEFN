// Templates management system

export interface Template {
  id: string;
  title: string;
  description: string;
  code: string;
  category?: string;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  source?: "local" | "github" | "user" | "default";
  sourceUrl?: string;
}

// Load templates from localStorage
export const loadTemplates = (): Template[] => {
  try {
    const savedTemplates = localStorage.getItem("userTemplates");
    if (savedTemplates) {
      return JSON.parse(savedTemplates);
    }
  } catch (error) {
    console.error("Failed to load templates:", error);
  }
  return [];
};

// Save templates to localStorage
export const saveTemplates = (templates: Template[]): void => {
  try {
    localStorage.setItem("userTemplates", JSON.stringify(templates));
  } catch (error) {
    console.error("Failed to save templates:", error);
  }
};

// Add a new template
export const addTemplate = (
  template: Omit<Template, "id" | "createdAt" | "updatedAt">,
): Template => {
  const templates = loadTemplates();
  const now = Date.now();

  const newTemplate: Template = {
    ...template,
    id: `template-${now}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: now,
    updatedAt: now,
    source: template.source || "user",
  };

  templates.push(newTemplate);
  saveTemplates(templates);

  return newTemplate;
};

// Update an existing template
export const updateTemplate = (
  id: string,
  updates: Partial<Omit<Template, "id" | "createdAt">>,
): Template | null => {
  const templates = loadTemplates();
  const index = templates.findIndex((t) => t.id === id);

  if (index === -1) return null;

  const updatedTemplate = {
    ...templates[index],
    ...updates,
    updatedAt: Date.now(),
  };

  templates[index] = updatedTemplate;
  saveTemplates(templates);

  return updatedTemplate;
};

// Delete a template
export const deleteTemplate = (id: string): boolean => {
  const templates = loadTemplates();
  const filteredTemplates = templates.filter((t) => t.id !== id);

  if (filteredTemplates.length === templates.length) return false;

  saveTemplates(filteredTemplates);
  return true;
};

// Import templates from JSON file
export const importTemplatesFromJson = (
  jsonContent: string,
): { success: boolean; count: number; error?: string } => {
  try {
    const importedData = JSON.parse(jsonContent);
    let templates: Template[] = [];

    // Handle different possible formats
    if (Array.isArray(importedData)) {
      templates = importedData;
    } else if (
      importedData.templates &&
      Array.isArray(importedData.templates)
    ) {
      templates = importedData.templates;
    } else {
      return { success: false, count: 0, error: "Invalid template format" };
    }

    // Validate and process templates
    const now = Date.now();
    const validTemplates = templates
      .filter((t) => t.title && t.code) // Basic validation
      .map((t) => ({
        ...t,
        id:
          t.id ||
          `template-${now}-${Math.random().toString(36).substring(2, 9)}`,
        createdAt: t.createdAt || now,
        updatedAt: now,
        source: t.source || "local",
      }));

    if (validTemplates.length === 0) {
      return { success: false, count: 0, error: "No valid templates found" };
    }

    // Add to existing templates
    const existingTemplates = loadTemplates();
    saveTemplates([...existingTemplates, ...validTemplates]);

    return { success: true, count: validTemplates.length };
  } catch (error) {
    return {
      success: false,
      count: 0,
      error:
        error instanceof Error ? error.message : "Failed to import templates",
    };
  }
};

// Export templates to JSON
export const exportTemplatesToJson = (): string => {
  const templates = loadTemplates();
  return JSON.stringify({ templates }, null, 2);
};

// Fetch templates from GitHub repository
export const fetchTemplatesFromGithub = async (
  repoUrl: string,
): Promise<{ success: boolean; templates?: Template[]; error?: string }> => {
  try {
    // Extract owner and repo from URL
    // Example: https://github.com/owner/repo
    const urlParts = repoUrl.split("/");
    const owner = urlParts[urlParts.length - 2];
    const repo = urlParts[urlParts.length - 1];

    if (!owner || !repo) {
      return { success: false, error: "Invalid GitHub repository URL" };
    }

    // Fetch templates from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/templates`,
    );

    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch from GitHub: ${response.statusText}`,
      };
    }

    const files = await response.json();

    if (!Array.isArray(files)) {
      return { success: false, error: "Invalid response from GitHub" };
    }

    // Process only JSON files
    const jsonFiles = files.filter((file) => file.name.endsWith(".json"));

    if (jsonFiles.length === 0) {
      return { success: false, error: "No template files found in repository" };
    }

    // Fetch and process each template file
    const templates: Template[] = [];
    const now = Date.now();

    for (const file of jsonFiles) {
      const contentResponse = await fetch(file.download_url);
      if (contentResponse.ok) {
        const content = await contentResponse.json();

        if (content.title && content.code) {
          templates.push({
            id: `github-${now}-${Math.random().toString(36).substring(2, 9)}`,
            title: content.title,
            description: content.description || "",
            code: content.code,
            category: content.category || "GitHub",
            tags: content.tags || [],
            createdAt: now,
            updatedAt: now,
            source: "github",
            sourceUrl: file.html_url,
          });
        }
      }
    }

    if (templates.length === 0) {
      return {
        success: false,
        error: "No valid templates found in repository",
      };
    }

    return { success: true, templates };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch templates from GitHub",
    };
  }
};
