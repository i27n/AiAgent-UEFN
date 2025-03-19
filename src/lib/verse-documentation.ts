// Comprehensive Verse documentation based on https://verse.fncwiki.com/

export interface VerseDocItem {
  name: string;
  description: string;
  syntax?: string;
  example?: string;
  params?: { name: string; type: string; description: string }[];
  returnType?: string;
  category:
    | "keyword"
    | "type"
    | "function"
    | "device"
    | "event"
    | "operator"
    | "namespace";
  url?: string;
}

export const verseDocumentation: VerseDocItem[] = [
  // Keywords
  {
    name: "using",
    description: "Imports namespaces or modules to use in your code.",
    syntax: "using { /Namespace/Path }",
    example: "using { /Fortnite.com/Devices }\nusing { /Verse.org/Simulation }",
    category: "keyword",
    url: "https://verse.fncwiki.com/Keywords/using",
  },
  {
    name: "class",
    description:
      "Defines a new class type that can contain methods and properties.",
    syntax:
      "ClassName := class(ParentClass):\n    # Properties and methods here",
    example: "my_device := class(creative_device):\n    # Class body here",
    category: "keyword",
    url: "https://verse.fncwiki.com/Keywords/class",
  },
  {
    name: "var",
    description:
      "Declares a mutable variable that can be changed after initialization.",
    syntax: "var VariableName : Type = InitialValue",
    example: "var PlayerCount : int = 0",
    category: "keyword",
    url: "https://verse.fncwiki.com/Keywords/var",
  },
  {
    name: "if",
    description:
      "Conditional statement that executes code if the condition is true.",
    syntax: "if (Condition) { # Code to execute }",
    example: 'if (PlayerCount > 0) { Print("Players in game!") }',
    category: "keyword",
    url: "https://verse.fncwiki.com/Keywords/if",
  },
  {
    name: "else",
    description: "Used with if to execute code when the condition is false.",
    syntax: "if (Condition) { # Code if true } else { # Code if false }",
    example:
      'if (PlayerCount > 0) { Print("Players in game!") } else { Print("No players") }',
    category: "keyword",
    url: "https://verse.fncwiki.com/Keywords/else",
  },

  // Types
  {
    name: "int",
    description: "Integer numeric type for whole numbers.",
    example: "var Count : int = 42",
    category: "type",
    url: "https://verse.fncwiki.com/Types/int",
  },
  {
    name: "float",
    description: "Floating-point numeric type for decimal numbers.",
    example: "var Speed : float = 3.14",
    category: "type",
    url: "https://verse.fncwiki.com/Types/float",
  },
  {
    name: "string",
    description: "Text type for storing character sequences.",
    example: 'var PlayerName : string = "Jonesy"',
    category: "type",
    url: "https://verse.fncwiki.com/Types/string",
  },
  {
    name: "logic",
    description: "Boolean type representing true or false values.",
    example: "var IsGameActive : logic = true",
    category: "type",
    url: "https://verse.fncwiki.com/Types/logic",
  },
  {
    name: "vector3",
    description:
      "3D vector type representing a point or direction in 3D space.",
    example: "var Position : vector3 = vector3{X:=0.0, Y:=0.0, Z:=100.0}",
    category: "type",
    url: "https://verse.fncwiki.com/Types/vector3",
  },

  // Functions
  {
    name: "Print",
    description: "Outputs a message to the console for debugging.",
    syntax: "Print(Message : string) : void",
    example: 'Print("Hello, Verse world!")',
    params: [
      { name: "Message", type: "string", description: "The message to print" },
    ],
    returnType: "void",
    category: "function",
    url: "https://verse.fncwiki.com/Functions/Print",
  },
  {
    name: "Sleep",
    description: "Pauses execution for the specified duration in seconds.",
    syntax: "Sleep(Seconds : float)<suspends> : void",
    example: "Sleep(2.0) # Pause for 2 seconds",
    params: [
      {
        name: "Seconds",
        type: "float",
        description: "Duration to sleep in seconds",
      },
    ],
    returnType: "void",
    category: "function",
    url: "https://verse.fncwiki.com/Functions/Sleep",
  },

  // Devices
  {
    name: "creative_device",
    description:
      "Base class for all UEFN devices that can be placed in a Creative island.",
    syntax: "MyDevice := class(creative_device):\n    # Device implementation",
    example:
      'my_game_controller := class(creative_device):\n    OnBegin<override>()<suspends>:void=\n        Print("Game started!")\n',
    category: "device",
    url: "https://verse.fncwiki.com/Devices/creative_device",
  },
  {
    name: "button_device",
    description:
      "A device that can be activated by players and triggers events.",
    syntax: "@editable ButtonDevice : button_device = button_device{}",
    example:
      "@editable\nMyButton : button_device = button_device{}\n\nOnBegin<override>()<suspends>:void=\n    MyButton.ActivatedEvent.Subscribe(OnButtonPressed)",
    category: "device",
    url: "https://verse.fncwiki.com/Devices/button_device",
  },
  {
    name: "trigger_device",
    description: "A device that detects when players enter or exit its volume.",
    syntax: "@editable TriggerDevice : trigger_device = trigger_device{}",
    example:
      "@editable\nMyTrigger : trigger_device = trigger_device{}\n\nOnBegin<override>()<suspends>:void=\n    MyTrigger.TriggeredEvent.Subscribe(OnPlayerEntered)",
    category: "device",
    url: "https://verse.fncwiki.com/Devices/trigger_device",
  },

  // Events
  {
    name: "OnBegin",
    description:
      "Event that fires when a device is initialized at the start of the game.",
    syntax: "OnBegin<override>()<suspends> : void = # Implementation",
    example:
      'OnBegin<override>()<suspends> : void =\n    Print("Device initialized")',
    category: "event",
    url: "https://verse.fncwiki.com/Events/OnBegin",
  },
  {
    name: "ActivatedEvent",
    description: "Event that fires when a button device is activated.",
    syntax: "ButtonDevice.ActivatedEvent.Subscribe(HandlerFunction)",
    example: "MyButton.ActivatedEvent.Subscribe(OnButtonPressed)",
    category: "event",
    url: "https://verse.fncwiki.com/Events/ActivatedEvent",
  },
  {
    name: "TriggeredEvent",
    description: "Event that fires when an agent enters a trigger volume.",
    syntax: "TriggerDevice.TriggeredEvent.Subscribe(HandlerFunction)",
    example: "MyTrigger.TriggeredEvent.Subscribe(OnPlayerEntered)",
    category: "event",
    url: "https://verse.fncwiki.com/Events/TriggeredEvent",
  },

  // Namespaces
  {
    name: "/Fortnite.com/Devices",
    description:
      "Contains definitions for Creative devices that can be placed in islands.",
    syntax: "using { /Fortnite.com/Devices }",
    category: "namespace",
    url: "https://verse.fncwiki.com/Namespaces/Fortnite.com/Devices",
  },
  {
    name: "/Verse.org/Simulation",
    description:
      "Contains core simulation functionality like timing and events.",
    syntax: "using { /Verse.org/Simulation }",
    category: "namespace",
    url: "https://verse.fncwiki.com/Namespaces/Verse.org/Simulation",
  },
  {
    name: "/Fortnite.com/Characters",
    description: "Contains functionality related to player characters.",
    syntax: "using { /Fortnite.com/Characters }",
    category: "namespace",
    url: "https://verse.fncwiki.com/Namespaces/Fortnite.com/Characters",
  },
  {
    name: "/Fortnite.com/Game",
    description: "Contains game-related functionality and state management.",
    syntax: "using { /Fortnite.com/Game }",
    category: "namespace",
    url: "https://verse.fncwiki.com/Namespaces/Fortnite.com/Game",
  },
  {
    name: "/UnrealEngine.com/Temporary/SpatialMath",
    description: "Contains math utilities for 3D space calculations.",
    syntax: "using { /UnrealEngine.com/Temporary/SpatialMath }",
    category: "namespace",
    url: "https://verse.fncwiki.com/Namespaces/UnrealEngine.com/Temporary/SpatialMath",
  },
];

// Get documentation for a specific Verse element
export function getVerseDocumentation(name: string): VerseDocItem | undefined {
  return verseDocumentation.find(
    (item) => item.name.toLowerCase() === name.toLowerCase(),
  );
}

// Get all documentation items of a specific category
export function getVerseDocumentationByCategory(
  category: string,
): VerseDocItem[] {
  return verseDocumentation.filter((item) => item.category === category);
}

// Search documentation by query string
export function searchVerseDocumentation(query: string): VerseDocItem[] {
  const lowerQuery = query.toLowerCase();
  return verseDocumentation.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery),
  );
}
