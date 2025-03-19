// Verse language syntax definitions and utilities

export const verseKeywords = [
  "using",
  "import",
  "export",
  "public",
  "private",
  "protected",
  "class",
  "struct",
  "interface",
  "enum",
  "function",
  "method",
  "var",
  "let",
  "const",
  "mutable",
  "immutable",
  "if",
  "else",
  "for",
  "while",
  "do",
  "switch",
  "case",
  "default",
  "break",
  "continue",
  "return",
  "yield",
  "true",
  "false",
  "null",
  "self",
  "this",
  "async",
  "await",
  "sync",
  "spawn",
  "type",
  "alias",
  "extends",
  "implements",
  "verse",
  "device",
  "event",
  "operator",
  "Print",
  "Log",
  "Warning",
  "Error",
];

export const verseTypes = [
  "void",
  "bool",
  "int",
  "float",
  "string",
  "vector",
  "rotation",
  "transform",
  "array",
  "map",
  "set",
  "tuple",
  "option",
  "result",
  "future",
  "agent",
  "player",
  "creative_device",
  "logic",
  "math",
  "time",
  "physics",
];

export const verseBuiltInFunctions = [
  "Print",
  "Log",
  "Warning",
  "Error",
  "MakeArray",
  "MakeMap",
  "MakeSet",
  "ToString",
  "ToInt",
  "ToFloat",
  "ToBool",
  "IsValid",
  "IsA",
  "Cast",
  "GetProperty",
  "SetProperty",
  "Sleep",
  "Wait",
  "Spawn",
  "MakeRotation",
  "MakeTransform",
  "MakeVector",
];

// Common UEFN-specific classes and types
export const uefnTypes = [
  "creative_device",
  "player",
  "fort_character",
  "game_player_controller",
  "game_mode",
  "game_state",
  "hud",
  "pawn",
  "vehicle",
  "weapon",
  "item",
  "building_piece",
  "building_actor",
  "trigger",
  "volume",
  "zone",
  "team",
  "player_start",
  "player_spawn",
  "storm",
  "storm_controller",
  "storm_safe_zone",
];

// Common UEFN-specific devices
export const uefnDevices = [
  "button_device",
  "trigger_device",
  "item_spawner_device",
  "player_spawner_device",
  "game_manager_device",
  "item_granter_device",
  "conditional_button_device",
  "elimination_manager_device",
  "team_settings_and_inventory_device",
  "mutator_zone_device",
  "vehicle_spawner_device",
  "creature_spawner_device",
  "creature_manager_device",
  "storm_controller_device",
  "timer_device",
  "tracker_device",
  "hud_message_device",
  "score_manager_device",
  "objective_device",
];

// Common UEFN-specific events
export const uefnEvents = [
  "OnBegin",
  "OnEnd",
  "OnActivated",
  "OnDeactivated",
  "OnTriggered",
  "OnCompleted",
  "OnPlayerJoin",
  "OnPlayerLeave",
  "OnPlayerEliminated",
  "OnPlayerRespawned",
  "OnPlayerDamaged",
  "OnItemCollected",
  "OnItemDropped",
  "OnItemEquipped",
  "OnItemUnequipped",
  "OnButtonPressed",
  "OnButtonReleased",
  "OnZoneEntered",
  "OnZoneExited",
  "OnGamePhaseChanged",
  "OnScoreChanged",
  "OnTimerCompleted",
  "OnRoundBegin",
  "OnRoundEnd",
];

// Verse code snippets for common functionality
export const verseSnippets = {
  basicScript: `using { /Script/VerseEngine }

verse function MyScript() : void
{
    Print("Hello, Verse world!")
}`,

  playerMovement: `using { /Script/VerseEngine }
using { /Fortnite.com/Characters }
using { /Fortnite.com/Game }

verse function HandlePlayerMovement(player : player) : void
{
    if (player.IsValid() = false) { return }
    
    if (const Character := player.GetFortCharacter[])
    {
        # Handle character movement logic here
        Print("Player character is valid")
    }
}`,

  triggerSetup: `using { /Script/VerseEngine }
using { /Fortnite.com/Devices }

verse function SetupTrigger(triggerDevice : trigger_device) : void
{
    if (triggerDevice.IsValid() = false) { return }
    
    # Subscribe to trigger events
    triggerDevice.TriggeredEvent.Subscribe(OnTriggerActivated)
}

verse function OnTriggerActivated(agent : agent) : void
{
    Print("Trigger activated by: {agent}")
    # Add your trigger response logic here
}`,

  itemGranter: `using { /Script/VerseEngine }
using { /Fortnite.com/Devices }
using { /Fortnite.com/Characters }

verse function SetupItemGranter(itemGranter : item_granter_device) : void
{
    if (itemGranter.IsValid() = false) { return }
    
    # Grant items when triggered
    itemGranter.GrantedItemEvent.Subscribe(OnItemGranted)
}

verse function OnItemGranted(character : fort_character) : void
{
    Print("Item granted to: {character}")
    # Add post-item-grant logic here
}`,

  gameFlow: `using { /Script/VerseEngine }
using { /Fortnite.com/Devices }
using { /Fortnite.com/Game }

verse function GameController(gameManager : game_manager_device) : void
{
    if (gameManager.IsValid() = false) { return }
    
    # Subscribe to game state events
    gameManager.GamePhaseBeganEvent.Subscribe(OnGamePhaseChanged)
}

verse function OnGamePhaseChanged(phase : game_phase) : void
{
    Print("Game phase changed to: {phase}")
    
    if (phase = game_phase.Playing)
    {
        Print("Game has started!")
        # Initialize gameplay elements
    }
    else if (phase = game_phase.EndGame)
    {
        Print("Game has ended!")
        # Clean up and prepare for next round
    }
}`,
};

// Function to validate Verse syntax (basic validation)
export function validateVerseSyntax(
  code: string,
): Array<{ line: number; message: string }> {
  const errors: Array<{ line: number; message: string }> = [];
  const lines = code.split("\n");

  // Very basic validation - in a real app this would be much more sophisticated
  let braceCount = 0;
  let inComment = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip comments
    if (line.trim().startsWith("#")) continue;
    if (line.includes("#")) {
      // Check for unclosed string before comment
      const beforeComment = line.split("#")[0];
      const quoteCount = (beforeComment.match(/"/g) || []).length;
      if (quoteCount % 2 !== 0) {
        errors.push({
          line: i + 1,
          message: "Possible unclosed string before comment",
        });
      }
    }

    // Check braces
    for (const char of line) {
      if (char === "{") braceCount++;
      if (char === "}") braceCount--;

      if (braceCount < 0) {
        errors.push({
          line: i + 1,
          message: "Unexpected closing brace",
        });
        braceCount = 0; // Reset to avoid multiple errors
      }
    }

    // Check for common syntax issues
    if (
      line.includes("if") &&
      !line.includes("if (") &&
      !line.includes("else if")
    ) {
      errors.push({
        line: i + 1,
        message: "'if' statement requires parentheses: if (condition)",
      });
    }

    if (line.includes("function") && !line.includes(":")) {
      errors.push({
        line: i + 1,
        message: "Function declaration missing return type",
      });
    }
  }

  // Check for unclosed braces at the end
  if (braceCount > 0) {
    errors.push({
      line: lines.length,
      message: `Missing ${braceCount} closing brace(s)`,
    });
  }

  return errors;
}

// Function to format Verse code
export function formatVerseCode(code: string): string {
  // This is a very basic formatter - a real one would be more sophisticated
  const lines = code.split("\n");
  let formattedLines: string[] = [];
  let indentLevel = 0;

  for (let line of lines) {
    const trimmedLine = line.trim();

    // Adjust indent level based on braces
    if (trimmedLine.endsWith("}") && !trimmedLine.startsWith("{")) {
      indentLevel = Math.max(0, indentLevel - 1);
    }

    // Add the line with proper indentation
    if (trimmedLine.length > 0) {
      formattedLines.push("    ".repeat(indentLevel) + trimmedLine);
    } else {
      formattedLines.push("");
    }

    // Increase indent for next line if this line opens a block
    if (trimmedLine.endsWith("{")) {
      indentLevel++;
    }
  }

  return formattedLines.join("\n");
}
