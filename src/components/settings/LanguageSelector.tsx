import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Languages } from "lucide-react";
import { getLanguage, setLanguage } from "@/lib/i18n";

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector = ({ className = "" }: LanguageSelectorProps) => {
  const [language, setCurrentLanguage] = useState(getLanguage());

  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLanguage(getLanguage());
    };

    window.addEventListener("languageChanged", handleLanguageChange);
    return () => {
      window.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ar" : "en";
    setLanguage(newLanguage);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className={`flex items-center gap-2 bg-[#141414] border-[#2e2e2e] hover:bg-[#2e2e2e] text-[#e1e1e1] ${className}`}
    >
      <Languages className="h-4 w-4" />
      <span>{language === "en" ? "العربية" : "English"}</span>
    </Button>
  );
};

export default LanguageSelector;
