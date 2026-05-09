"use client";

import { Github, Linkedin } from "lucide-react";
import { useTranslations } from "@/hooks/useTranslations";

const GITHUB_URL = "https://github.com/felixny";
const LINKEDIN_URL = "https://www.linkedin.com/in/felixny/";

export default function SiteFooter() {
  const { t } = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background/80 py-10 px-6 text-center lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5">
        <p className="text-sm text-muted-foreground">
          © {year} Felix Nampanya · {t("footer.city")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            <Github className="h-4 w-4" aria-hidden />
            {t("footer.visitGithub")}
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            <Linkedin className="h-4 w-4" aria-hidden />
            {t("footer.visitLinkedin")}
          </a>
        </div>
      </div>
    </footer>
  );
}
