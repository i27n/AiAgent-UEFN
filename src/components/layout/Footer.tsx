import React from "react";
import { t } from "@/lib/i18n";

const Footer = () => {
  return (
    <footer className="p-4 bg-[#141414] border-t border-[#2e2e2e] text-center text-[#a0a0a0] text-sm">
      <p>
        {t("app.footer.text", "Verse Script Generator for UEFN © 2023-2024")}
      </p>
      <p className="mt-1">
        <a
          href="https://dev.epicgames.com/documentation/en-us/uefn/verse-language-reference"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          {t("app.footer.docs", "Verse Documentation")}
        </a>
        {" | "}
        <a
          href="https://github.com/your-username/verse-script-generator"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          {t("app.footer.github", "GitHub Repository")}
        </a>
      </p>
    </footer>
  );
};

export default Footer;
