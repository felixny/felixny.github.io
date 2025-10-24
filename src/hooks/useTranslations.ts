"use client";

import { useState, useEffect } from "react";

// Import translation files
import enTranslations from "../../messages/en.json";
import jaTranslations from "../../messages/ja.json";

const translations = {
  en: enTranslations,
  ja: jaTranslations,
};

export function useTranslations() {
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get language from localStorage or default to English
    const savedLanguage = localStorage.getItem("preferred-language") || "en";
    setLanguage(savedLanguage);
    setIsLoading(false);
  }, []);

  const t = (key: string) => {
    if (isLoading) return "";
    
    const keys = key.split(".");
    let value: any = translations[language as keyof typeof translations];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const changeLanguage = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem("preferred-language", newLanguage);
  };

  return { t, language, changeLanguage, isLoading };
}
