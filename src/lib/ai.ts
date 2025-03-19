// AI Service for Gemini API integration

export interface AIConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  content: string;
  error?: string;
}

export class AIService {
  private apiKey: string;
  private model: string;
  private temperature: number;
  private maxTokens: number;
  private baseUrl = "https://generativelanguage.googleapis.com/v1beta/models";

  constructor(config: AIConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || "gemini-2.0-flash";
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 2048;
  }

  // Method to update configuration
  public configure(config: Partial<AIConfig>): void {
    if (config.apiKey) this.apiKey = config.apiKey;
    if (config.model) this.model = config.model;
    if (config.temperature !== undefined) this.temperature = config.temperature;
    if (config.maxTokens !== undefined) this.maxTokens = config.maxTokens;
  }

  public async generateContent(prompt: string): Promise<AIResponse> {
    if (!this.apiKey) {
      return {
        content: "",
        error:
          "API key is not configured. Please set up your Gemini API key in settings.",
      };
    }

    try {
      const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: this.temperature,
            maxOutputTokens: this.maxTokens,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message ||
            `API request failed with status ${response.status}`,
        );
      }

      const data = await response.json();

      // Extract the generated text from the response
      const generatedText =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      return {
        content: generatedText,
      };
    } catch (error) {
      console.error("AI generation error:", error);
      return {
        content: "",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Method specifically for generating Verse code
  public async generateVerseCode(prompt: string): Promise<AIResponse> {
    const versePrompt = `Generate Verse code for Unreal Engine Fortnite (UEFN) based on the following request. 
    Use proper Verse syntax and follow best practices for UEFN development.
    Include comments explaining the code.
    Request: ${prompt}`;

    return this.generateContent(versePrompt);
  }

  // Method for debugging Verse code
  public async debugVerseCode(
    code: string,
    issue: string,
  ): Promise<AIResponse> {
    const debugPrompt = `Debug the following Verse code for Unreal Engine Fortnite (UEFN).
    The user is experiencing this issue: ${issue}
    
    Code:
    ${code}
    
    Provide a fixed version of the code with explanations of what was wrong and how it was fixed.`;

    return this.generateContent(debugPrompt);
  }

  // Method for explaining Verse code
  public async explainVerseCode(code: string): Promise<AIResponse> {
    const explainPrompt = `Explain the following Verse code for Unreal Engine Fortnite (UEFN) in detail:
    
    ${code}
    
    Break down what each part does, explain any complex concepts, and describe the overall functionality.`;

    return this.generateContent(explainPrompt);
  }

  // Method for continuing/extending Verse code
  public async continueVerseCode(
    code: string,
    extension: string,
  ): Promise<AIResponse> {
    const continuePrompt = `Continue or extend the following Verse code for Unreal Engine Fortnite (UEFN) based on this request: ${extension}
    
    Existing code:
    ${code}
    
    Provide the complete code with the new additions or extensions integrated seamlessly.`;

    return this.generateContent(continuePrompt);
  }
}

// Create a singleton instance
let aiService: AIService | null = null;

export const getAIService = (config: AIConfig): AIService => {
  if (!aiService) {
    aiService = new AIService(config);
  } else {
    // Update the existing instance with new config
    aiService.configure(config);
  }
  return aiService;
};
