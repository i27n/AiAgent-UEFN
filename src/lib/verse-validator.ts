// Advanced Verse code validator

export interface ValidationError {
  line: number;
  column?: number;
  message: string;
  severity: "error" | "warning" | "info";
  code?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

// Regular expressions for Verse syntax elements
const VERSE_REGEX = {
  COMMENT: /#.*$/,
  STRING: /"(?:[^"\\]|\\.)*"/,
  USING_STATEMENT: /^\s*using\s*\{\s*\/[\w\.]+(?:\/[\w\.]+)*\s*\}\s*$/,
  CLASS_DECLARATION: /^\s*([\w_]+)\s*:=\s*class\s*\(([\w_]+)\)\s*:\s*$/,
  FUNCTION_DECLARATION:
    /^\s*([\w_]+)\s*<([\w_]+)>\s*\(([^)]*)\)\s*(?:<([\w_]+)>)?\s*:\s*([\w_]+)\s*=\s*$/,
  VARIABLE_DECLARATION: /^\s*(?:var\s+)?([\w_]+)\s*:\s*([\w_]+)\s*=\s*(.+)$/,
  EDITABLE_ANNOTATION: /^\s*@editable\s*$/,
  IF_STATEMENT: /^\s*if\s+\((.+)\)\s*$/,
  ELSE_STATEMENT: /^\s*else\s*$/,
  FOR_LOOP: /^\s*for\s*\((.+)\)\s*$/,
  BRACE_OPEN: /\{/g,
  BRACE_CLOSE: /\}/g,
  PARENTHESIS_OPEN: /\(/g,
  PARENTHESIS_CLOSE: /\)/g,
};

// Validate Verse code
export function validateVerseCode(code: string): ValidationResult {
  const lines = code.split("\n");
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Track state
  let inClassDeclaration = false;
  let inFunctionDeclaration = false;
  let braceStack: number[] = [];
  let braceBalance = 0;

  // Track imports
  const imports: Set<string> = new Set();

  // Common device namespaces
  const requiredNamespaces: { [key: string]: string[] } = {
    creative_device: ["/Fortnite.com/Devices"],
    button_device: ["/Fortnite.com/Devices"],
    trigger_device: ["/Fortnite.com/Devices"],
    player: ["/Fortnite.com/Characters"],
    fort_character: ["/Fortnite.com/Characters"],
    game_phase: ["/Fortnite.com/Game"],
  };

  // Check for required namespaces based on code content
  const usedDevices: Set<string> = new Set();

  // Process each line
  lines.forEach((line, lineIndex) => {
    const lineNumber = lineIndex + 1;
    const trimmedLine = line.trim();

    // Skip empty lines and comments
    if (trimmedLine === "" || trimmedLine.startsWith("#")) {
      return;
    }

    // Check for using statements
    if (VERSE_REGEX.USING_STATEMENT.test(trimmedLine)) {
      const match = trimmedLine.match(/\/([\w\.]+(?:\/[\w\.]+)*)/);
      if (match) {
        imports.add(match[1]);
      }
      return;
    }

    // Check for class declarations
    if (VERSE_REGEX.CLASS_DECLARATION.test(trimmedLine)) {
      inClassDeclaration = true;
      const match = trimmedLine.match(VERSE_REGEX.CLASS_DECLARATION);
      if (match && match[2]) {
        usedDevices.add(match[2]);
      }
      return;
    }

    // Check for function declarations
    if (VERSE_REGEX.FUNCTION_DECLARATION.test(trimmedLine)) {
      inFunctionDeclaration = true;
      const match = trimmedLine.match(VERSE_REGEX.FUNCTION_DECLARATION);
      if (match) {
        // Check if function has a return type
        if (!match[5]) {
          errors.push({
            line: lineNumber,
            message: "Function declaration missing return type",
            severity: "error",
          });
        }
      }
      return;
    }

    // Check for variable declarations
    if (VERSE_REGEX.VARIABLE_DECLARATION.test(trimmedLine)) {
      const match = trimmedLine.match(VERSE_REGEX.VARIABLE_DECLARATION);
      if (match) {
        // Check if variable has a type
        if (!match[2]) {
          errors.push({
            line: lineNumber,
            message: "Variable declaration missing type",
            severity: "error",
          });
        }
      }
      return;
    }

    // Check for if statements
    if (VERSE_REGEX.IF_STATEMENT.test(trimmedLine)) {
      const match = trimmedLine.match(VERSE_REGEX.IF_STATEMENT);
      if (match) {
        // Check if condition is empty
        if (!match[1].trim()) {
          errors.push({
            line: lineNumber,
            message: "If statement has empty condition",
            severity: "error",
          });
        }
      }
      return;
    }

    // Track braces for code blocks
    const openBraces = (trimmedLine.match(VERSE_REGEX.BRACE_OPEN) || []).length;
    const closeBraces = (trimmedLine.match(VERSE_REGEX.BRACE_CLOSE) || [])
      .length;

    braceBalance += openBraces - closeBraces;

    if (openBraces > 0) {
      braceStack.push(lineNumber);
    }

    if (closeBraces > 0) {
      for (let i = 0; i < closeBraces; i++) {
        if (braceStack.length > 0) {
          braceStack.pop();
        } else {
          errors.push({
            line: lineNumber,
            message: "Unexpected closing brace",
            severity: "error",
          });
        }
      }
    }

    // Check for common Verse syntax issues
    if (
      line.includes("if") &&
      !line.includes("if (") &&
      !line.includes("else if")
    ) {
      errors.push({
        line: lineNumber,
        message: "'if' statement requires parentheses: if (condition)",
        severity: "error",
      });
    }

    // Check for string literals
    const stringMatches = line.match(/"/g);
    if (stringMatches && stringMatches.length % 2 !== 0) {
      errors.push({
        line: lineNumber,
        message: "Unclosed string literal",
        severity: "error",
      });
    }
  });

  // Check for unclosed braces at the end
  if (braceBalance !== 0) {
    errors.push({
      line: lines.length,
      message: `Unbalanced braces: ${braceBalance > 0 ? "missing closing" : "extra closing"} braces`,
      severity: "error",
    });
  }

  // Check for required namespaces
  usedDevices.forEach((device) => {
    if (requiredNamespaces[device]) {
      requiredNamespaces[device].forEach((namespace) => {
        const namespaceWithoutSlashes = namespace.substring(1); // Remove leading slash
        if (!imports.has(namespaceWithoutSlashes)) {
          warnings.push({
            line: 1,
            message: `Using device '${device}' requires namespace '${namespace}'`,
            severity: "warning",
          });
        }
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Format Verse code with proper indentation and style
export function formatVerseCode(code: string): string {
  const lines = code.split("\n");
  let formattedLines: string[] = [];
  let indentLevel = 0;
  let inComment = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Skip empty lines
    if (line === "") {
      formattedLines.push("");
      continue;
    }

    // Handle comments
    if (line.startsWith("#")) {
      formattedLines.push("    ".repeat(indentLevel) + line);
      continue;
    }

    // Adjust indent for closing braces
    if (line.startsWith("}")) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Add the line with proper indentation
    formattedLines.push("    ".repeat(indentLevel) + line);

    // Adjust indent for opening braces
    if (line.endsWith("{")) {
      indentLevel++;
    }

    // Handle special case for if/else blocks without braces
    if (
      (line.startsWith("if") ||
        line.startsWith("else if") ||
        line.startsWith("else")) &&
      !line.endsWith("{")
    ) {
      indentLevel++;
    }
  }

  return formattedLines.join("\n");
}

// Suggest fixes for common Verse syntax errors
export function suggestFixes(error: ValidationError): string {
  switch (true) {
    case error.message.includes("'if' statement requires parentheses"):
      return "Add parentheses around the condition: if (condition)";
    case error.message.includes("Unclosed string literal"):
      return "Add a closing double quote to complete the string";
    case error.message.includes("Variable declaration missing type"):
      return "Specify the variable type: var Name : Type = Value";
    case error.message.includes("Function declaration missing return type"):
      return "Add a return type: FunctionName() : ReturnType = ";
    case error.message.includes("Unexpected closing brace"):
      return "Remove the extra closing brace or add a matching opening brace";
    case error.message.includes("Unbalanced braces"):
      return "Check your code for missing opening or closing braces";
    case error.message.includes("requires namespace"):
      return "Add the required namespace using statement at the top of your file";
    default:
      return "Review the code around this line for syntax errors";
  }
}
