// Simple i18n implementation for the application

type Language = "en" | "ar";

type Translations = {
  [key: string]: {
    en: string;
    ar: string;
  };
};

// Application translations
const translations: Translations = {
  // Common UI elements
  "app.title": {
    en: "Verse Script Generator",
    ar: "منشئ سكربت Verse",
  },
  "app.save": {
    en: "Save",
    ar: "حفظ",
  },
  "app.cancel": {
    en: "Cancel",
    ar: "إلغاء",
  },
  "app.submit": {
    en: "Submit",
    ar: "إرسال",
  },
  "app.processing": {
    en: "Processing...",
    ar: "جاري المعالجة...",
  },
  "app.clear": {
    en: "Clear",
    ar: "مسح",
  },

  // Editor modes
  "editor.mode.generate": {
    en: "Generate New Script",
    ar: "إنشاء سكربت جديد",
  },
  "editor.mode.debug": {
    en: "Debug Existing Code",
    ar: "تصحيح الكود الحالي",
  },
  "editor.mode.explain": {
    en: "Get Explanation",
    ar: "الحصول على شرح",
  },
  "editor.mode.continue": {
    en: "Continue Development",
    ar: "متابعة التطوير",
  },

  // Prompt pane
  "prompt.title": {
    en: "Enter Prompt",
    ar: "أدخل الطلب",
  },
  "prompt.placeholder.generate": {
    en: 'Describe the Verse script you want to create (e.g., "Create a script that spawns enemies when a player enters a trigger zone")...',
    ar: 'صف سكربت Verse الذي تريد إنشاءه (مثال: "إنشاء سكربت يقوم بإظهار الأعداء عندما يدخل اللاعب منطقة محددة")...',
  },
  "prompt.placeholder.debug": {
    en: "Paste your Verse code here and describe the issue you're experiencing...",
    ar: "الصق كود Verse الخاص بك هنا وصف المشكلة التي تواجهها...",
  },
  "prompt.placeholder.explain": {
    en: "Paste the Verse code you want explained and specify what aspects you want to understand better...",
    ar: "الصق كود Verse الذي تريد شرحه وحدد الجوانب التي تريد فهمها بشكل أفضل...",
  },
  "prompt.placeholder.continue": {
    en: "Paste your partial Verse implementation and describe how you want to extend it...",
    ar: "الصق تنفيذ Verse الجزئي الخاص بك وصف كيف تريد توسيعه...",
  },
  "prompt.tab.prompt": {
    en: "Prompt",
    ar: "الطلب",
  },
  "prompt.tab.history": {
    en: "History",
    ar: "السجل",
  },
  "prompt.tab.templates": {
    en: "Templates",
    ar: "القوالب",
  },
  "prompt.history.empty": {
    en: "No prompt history yet",
    ar: "لا يوجد سجل طلبات حتى الآن",
  },
  "prompt.tooltip.clear": {
    en: "Clear prompt",
    ar: "مسح الطلب",
  },

  // Templates
  "templates.title": {
    en: "Verse Templates",
    ar: "قوالب Verse",
  },
  "template.basic.title": {
    en: "Basic Script Template",
    ar: "قالب سكربت أساسي",
  },
  "template.basic.description": {
    en: "A simple Verse script with a basic function structure",
    ar: "سكربت Verse بسيط مع هيكل وظيفي أساسي",
  },
  "template.player.title": {
    en: "Player Movement Template",
    ar: "قالب حركة اللاعب",
  },
  "template.player.description": {
    en: "A template for handling basic player movement",
    ar: "قالب للتعامل مع حركة اللاعب الأساسية",
  },
  "template.trigger.title": {
    en: "Trigger Zone Template",
    ar: "قالب منطقة التفعيل",
  },
  "template.trigger.description": {
    en: "A template for creating interactive trigger zones",
    ar: "قالب لإنشاء مناطق تفعيل تفاعلية",
  },
  "template.ui.title": {
    en: "UI Component Template",
    ar: "قالب مكون واجهة المستخدم",
  },
  "template.ui.description": {
    en: "A template for creating UI elements in Verse",
    ar: "قالب لإنشاء عناصر واجهة المستخدم في Verse",
  },

  // History
  "history.title": {
    en: "Prompt History",
    ar: "سجل الطلبات",
  },
  "history.clear": {
    en: "Clear",
    ar: "مسح",
  },
  "history.empty": {
    en: "No prompt history yet",
    ar: "لا يوجد سجل طلبات حتى الآن",
  },
  "history.no_results": {
    en: "No matching history items",
    ar: "لا توجد عناصر سجل مطابقة",
  },

  // AI Settings
  "ai.settings.title": {
    en: "AI Configuration",
    ar: "إعدادات الذكاء الاصطناعي",
  },
  "ai.settings.apiKey": {
    en: "Gemini API Key",
    ar: "مفتاح واجهة برمجة تطبيقات Gemini",
  },
  "ai.settings.apiKey.placeholder": {
    en: "Enter your Gemini API key",
    ar: "أدخل مفتاح واجهة برمجة تطبيقات Gemini الخاص بك",
  },
  "ai.settings.apiKey.help": {
    en: "Get your API key from",
    ar: "احصل على مفتاح واجهة برمجة التطبيقات الخاص بك من",
  },
  "ai.settings.model": {
    en: "Model",
    ar: "النموذج",
  },
  "ai.settings.temperature": {
    en: "Temperature",
    ar: "درجة الحرارة",
  },
  "ai.settings.temperature.focused": {
    en: "More focused",
    ar: "أكثر تركيزًا",
  },
  "ai.settings.temperature.balanced": {
    en: "Balanced",
    ar: "متوازن",
  },
  "ai.settings.temperature.creative": {
    en: "More creative",
    ar: "أكثر إبداعًا",
  },
  "ai.settings.maxTokens": {
    en: "Max Output Length",
    ar: "الحد الأقصى لطول المخرجات",
  },
  "ai.settings.maxTokens.shorter": {
    en: "Shorter",
    ar: "أقصر",
  },
  "ai.settings.maxTokens.medium": {
    en: "Medium",
    ar: "متوسط",
  },
  "ai.settings.maxTokens.longer": {
    en: "Longer",
    ar: "أطول",
  },
  "ai.settings.autoValidate": {
    en: "Auto-validate generated code",
    ar: "التحقق التلقائي من الكود المُنشأ",
  },
  "ai.settings.autoValidate.description": {
    en: "Automatically check code for syntax errors",
    ar: "التحقق تلقائيًا من أخطاء بناء الجملة في الكود",
  },
  "ai.settings.autoFormat": {
    en: "Auto-format generated code",
    ar: "تنسيق الكود المُنشأ تلقائيًا",
  },
  "ai.settings.autoFormat.description": {
    en: "Automatically format code for readability",
    ar: "تنسيق الكود تلقائيًا لسهولة القراءة",
  },
  "ai.settings.save": {
    en: "Save Settings",
    ar: "حفظ الإعدادات",
  },
  "ai.settings.notConfigured": {
    en: "Gemini API key not configured. Please set it in the",
    ar: "لم يتم تكوين مفتاح واجهة برمجة تطبيقات Gemini. يرجى تعيينه في",
  },
};

// Current language state
let currentLanguage: Language = "en";

// Initialize language from localStorage if available
export const initLanguage = (): void => {
  const savedLanguage = localStorage.getItem("language") as Language;
  if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
    currentLanguage = savedLanguage;
  }
};

// Get translation for a key
export const t = (key: string, defaultValue?: string): string => {
  if (!translations[key]) {
    console.warn(`Translation key not found: ${key}`);
    return defaultValue || key;
  }
  return translations[key][currentLanguage];
};

// Set current language
export const setLanguage = (language: Language): void => {
  currentLanguage = language;
  localStorage.setItem("language", language);
  // Force re-render by dispatching a custom event
  window.dispatchEvent(new Event("languageChanged"));

  // Update document direction
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = language;

  // Apply RTL-specific styles for Arabic
  if (language === "ar") {
    document.body.classList.add("rtl-layout");
  } else {
    document.body.classList.remove("rtl-layout");
  }
};

// Get current language
export const getLanguage = (): Language => {
  return currentLanguage;
};

// Check if current language is RTL
export const isRTL = (): boolean => {
  return currentLanguage === "ar";
};
