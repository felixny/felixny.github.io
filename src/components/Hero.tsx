"use client";

import { ArrowRight, ChevronDown, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/useTranslations";

export default function Hero() {
  const { t } = useTranslations();
  const rawStack = String(t("hero.techStack"));
  const heroTechSkills = rawStack
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is string => s.length > 0);

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden px-6 pb-16 pt-20 lg:px-8"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="text-center lg:text-left">
          <div className="mb-4 flex justify-center lg:justify-start animate-fade-up">
            <a
              href="#projects"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
            >
              {t("hero.projectsCue")}
              <ChevronDown className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
            </a>
          </div>

          <div className="mb-5 flex justify-center lg:justify-start animate-fade-up [animation-delay:40ms]">
            <span className="section-label">{t("about.location")} · {t("hero.title")}</span>
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl animate-fade-up [animation-delay:60ms]">
            {t("hero.name")}
          </h1>

          <h2 className="mb-5 text-xl font-semibold text-primary sm:text-2xl md:text-3xl animate-fade-up [animation-delay:100ms]">
            {t("hero.title")}
          </h2>

          <p className="mb-9 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl mx-auto lg:mx-0 animate-fade-up [animation-delay:140ms]">
            {t("hero.description")}
          </p>

          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:justify-start animate-fade-up [animation-delay:180ms]">
            <Button size="lg" onClick={scrollToContact} className="group h-11 px-8 text-base">
              {t("hero.getInTouch")}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                const element = document.getElementById("projects");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="h-11 px-8 text-base"
            >
              {t("hero.viewProjects")}
            </Button>
          </div>

          <div className="mt-9 flex flex-wrap justify-center gap-3 lg:justify-start animate-fade-up [animation-delay:220ms]">
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://github.com/felixny"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Github className="h-5 w-5" />
                GitHub
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://www.linkedin.com/in/felixny/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Linkedin className="h-5 w-5" />
                LinkedIn
              </a>
            </Button>
          </div>
        </div>

        <div className="relative hidden lg:block animate-fade-up [animation-delay:160ms]">
          <div className="rounded-2xl border border-border bg-card p-7 shadow-md">
            <div className="mb-6 flex items-start justify-between gap-4 border-b border-border pb-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t("about.availability")}
                </p>
                <p className="mt-1 text-lg font-semibold text-foreground">{t("hero.title")}</p>
              </div>
            </div>
            <dl className="space-y-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{t("about.contactInfo")}</dt>
                <dd className="text-right font-medium text-foreground">{t("about.email")}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">{t("navigation.about")}</dt>
                <dd className="text-right font-medium text-foreground">{t("about.location")}</dd>
              </div>
              <div className="border-t border-border pt-5">
                <dt className="mb-3 text-muted-foreground">{t("about.technicalSkills")}</dt>
                <dd className="m-0 flex flex-wrap justify-start gap-2">
                  {heroTechSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex rounded-md border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            <div className="mt-6 grid grid-cols-3 gap-2">
              {(
                [
                  ["bentoMobile", t("hero.bentoMobile")],
                  ["bentoApis", t("hero.bentoApis")],
                  ["bentoWeb", t("hero.bentoWeb")],
                ] as const
              ).map(([key, label]) => (
                <div
                  key={key}
                  className="rounded-lg border border-border bg-muted/40 px-2 py-2.5 text-center text-xs font-medium text-muted-foreground"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
