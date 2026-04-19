"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "@/hooks/useTranslations";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslations();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: t("navigation.home"), id: "hero" },
    { label: t("navigation.about"), id: "professional-summary" },
    { label: t("navigation.projects"), id: "projects" },
    { label: t("navigation.skills"), id: "skills" },
    { label: t("navigation.contact"), id: "contact" },
  ];

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "border-b border-border bg-background/80 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <button
            onClick={() => scrollToSection("hero")}
            className="text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
          >
            Portfolio
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </button>
            ))}
            <LanguageSwitcher />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-border py-3 md:hidden">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full py-2.5 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </button>
            ))}
            <div className="px-1 py-2">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
