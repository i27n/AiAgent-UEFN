// AI Service for Gemini API integration

export interface AIConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  topK?: number;
  topP?: number;
  contextWindow?: number;
  systemPrompt?: string;
  apiEndpoint?: string;
}

export interface AIResponse {
  content: string;
  error?: string;
  metadata?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    latencyMs?: number;
  };
}

export class AIService {
  private apiKey: string;
  private model: string;
  private temperature: number;
  private maxTokens: number;
  private topK: number;
  private topP: number;
  private contextWindow: number;
  private systemPrompt?: string;
  private baseUrl: string;
  private requestStartTime: number = 0;

  constructor(config: AIConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || "gemini-2.0-flash";
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 2048;
    this.topK = config.topK || 40;
    this.topP = config.topP || 0.95;
    this.contextWindow = config.contextWindow || 16000;
    this.systemPrompt = config.systemPrompt;
    this.baseUrl =
      config.apiEndpoint ||
      "https://generativelanguage.googleapis.com/v1beta/models";
  }

  // Method to update configuration
  public configure(config: Partial<AIConfig>): void {
    if (config.apiKey) this.apiKey = config.apiKey;
    if (config.model) this.model = config.model;
    if (config.temperature !== undefined) this.temperature = config.temperature;
    if (config.maxTokens !== undefined) this.maxTokens = config.maxTokens;
    if (config.topK !== undefined) this.topK = config.topK;
    if (config.topP !== undefined) this.topP = config.topP;
    if (config.contextWindow !== undefined)
      this.contextWindow = config.contextWindow;
    if (config.systemPrompt !== undefined)
      this.systemPrompt = config.systemPrompt;
    if (config.apiEndpoint) this.baseUrl = config.apiEndpoint;
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
      this.requestStartTime = performance.now();
      const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;

      // Prepare request body
      const requestBody: any = {
        contents: [],
        generationConfig: {
          temperature: this.temperature,
          maxOutputTokens: this.maxTokens,
          topK: this.topK,
          topP: this.topP,
        },
      };

      // Add system prompt if available
      if (this.systemPrompt) {
        requestBody.contents.push({
          role: "system",
          parts: [{ text: this.systemPrompt }],
        });
      }

      // Add user prompt
      requestBody.contents.push({
        role: "user",
        parts: [{ text: prompt }],
      });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message ||
            `API request failed with status ${response.status}`,
        );
      }

      const data = await response.json();
      const latencyMs = performance.now() - this.requestStartTime;

      // Extract the generated text from the response
      const generatedText =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      // Extract token usage if available
      const promptTokens = data.usageMetadata?.promptTokenCount || 0;
      const completionTokens = data.usageMetadata?.candidatesTokenCount || 0;
      const totalTokens = promptTokens + completionTokens;

      return {
        content: generatedText,
        metadata: {
          promptTokens,
          completionTokens,
          totalTokens,
          latencyMs,
        },
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
    Include detailed comments explaining the code.
    Ensure the code is optimized and follows UEFN conventions.
    Format the code with proper indentation and spacing.
    
    Request: ${prompt}
    
    Return the code in a code block using triple backticks with 'verse' as the language identifier.`;

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
    
    Analyze the code thoroughly for syntax errors, logical issues, and UEFN-specific problems.
    Provide a fixed version of the code with explanations of what was wrong and how it was fixed.
    Include comments in the fixed code to highlight the changes made.
    
    Return the fixed code in a code block using triple backticks with 'verse' as the language identifier.`;

    return this.generateContent(debugPrompt);
  }

  // Method for explaining Verse code
  public async explainVerseCode(code: string): Promise<AIResponse> {
    const explainPrompt = `Explain the following Verse code for Unreal Engine Fortnite (UEFN) in detail:
    
    ${code}
    
    Provide a comprehensive explanation including:
    1. Overall purpose and functionality of the code
    2. Breakdown of each function, class, and major code block
    3. Explanation of any complex algorithms or patterns used
    4. How the code interacts with UEFN systems and devices
    5. Potential performance considerations or optimization opportunities
    6. Best practices followed or areas for improvement
    
    Format your explanation with clear sections and highlight important concepts.`;

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
    
    Requirements for the continuation:
    1. Maintain the same coding style and naming conventions
    2. Add detailed comments for any new functionality
    3. Ensure the new code integrates seamlessly with the existing code
    4. Follow UEFN best practices and optimization guidelines
    5. Make sure the extended code is complete and functional
    
    Provide the complete code with the new additions or extensions integrated seamlessly.
    Return the complete code in a code block using triple backticks with 'verse' as the language identifier.`;

    return this.generateContent(continuePrompt);
  }

  // Method for optimizing Verse code
  public async optimizeVerseCode(code: string): Promise<AIResponse> {
    const optimizePrompt = `Optimize the following Verse code for Unreal Engine Fortnite (UEFN):
    
    ${code}
    
    Perform the following optimizations:
    1. Improve performance by reducing unnecessary operations
    2. Enhance readability with better formatting and naming
    3. Apply UEFN-specific best practices
    4. Reduce code duplication and improve reusability
    5. Add or improve comments to explain complex sections
    6. Fix any potential bugs or edge cases
    
    Provide the optimized code with comments explaining the key optimizations made.
    Return the optimized code in a code block using triple backticks with 'verse' as the language identifier.`;

    return this.generateContent(optimizePrompt);
  }

  // Method for generating documentation for Verse code
  public async generateDocumentation(code: string): Promise<AIResponse> {
    const docPrompt = `Generate comprehensive documentation for the following Verse code for Unreal Engine Fortnite (UEFN):
    
    ${code}
    
    Create documentation that includes:
    1. Overview of the code's purpose and functionality
    2. Detailed API documentation for all public functions, classes, and interfaces
    3. Parameters, return values, and exceptions for each function
    4. Usage examples for key components
    5. Dependencies and requirements
    6. Any performance considerations or limitations
    
    Format the documentation in a clear, professional style suitable for developers.`;

    return this.generateContent(docPrompt);
  }

  // Method for converting pseudocode to Verse
  public async pseudocodeToVerse(pseudocode: string): Promise<AIResponse> {
    const convertPrompt = `Convert the following pseudocode or natural language description to proper Verse code for Unreal Engine Fortnite (UEFN):
    
    ${pseudocode}
    
    Requirements:
    1. Create fully functional, syntactically correct Verse code
    2. Follow UEFN best practices and conventions
    3. Include detailed comments explaining the implementation
    4. Ensure the code is optimized and efficient
    5. Handle potential edge cases and errors
    
    Return the Verse code in a code block using triple backticks with 'verse' as the language identifier.`;

    return this.generateContent(convertPrompt);
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
