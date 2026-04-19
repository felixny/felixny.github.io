"use client";

import { useState, useEffect } from "react";

import enTranslations from "../../messages/en.json";
import jaTranslations from "../../messages/ja.json";

const translations = {
  en: enTranslations,
  ja: jaTranslations,
};

export function useTranslations() {
  const [language, setLanguage] = useState<string>("en");

  useEffect(() => {
    const saved = localStorage.getItem("preferred-language") || "en";
    setLanguage(saved);
  }, []);

  const t = (key: string) => {
    const keys = key.split(".");
    let value: unknown = translations[language as keyof typeof translations];

    for (const k of keys) {
      if (value && typeof value === "object" && k in (value as object)) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }

    return typeof value === "string" ? value : key;
  };

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem("preferred-language", newLanguage);
  };

  return { t, language, changeLanguage };
}
