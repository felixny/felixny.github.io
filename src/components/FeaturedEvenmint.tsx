"use client";

import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "@/hooks/useTranslations";
import AnimateOnScroll from "@/components/AnimateOnScroll";

const DEMO = "https://evenmint.vercel.app/";

export default function FeaturedEvenmint() {
  const { t } = useTranslations();

  return (
    <AnimateOnScroll className="mb-14 lg:mb-16">
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/[0.04] p-6 shadow-lg shadow-primary/5 md:p-8 lg:p-10">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl"
          aria-hidden
        />
        <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              {t("projects.evenmint.badge")}
            </div>

            <div className="space-y-3">
              <h3 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                <span className="bg-gradient-to-r from-primary via-chart-2 to-primary bg-[length:200%_auto] bg-clip-text text-transparent">
                  Evenmint
                </span>
              </h3>
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {t("projects.evenmint.description")}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {String(t("projects.evenmint.techStack"))
                .split(", ")
                .map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {tech}
                  </Badge>
                ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Button size="lg" className="group rounded-full shadow-md shadow-primary/20" asChild>
                <a href={DEMO} target="_blank" rel="noopener noreferrer">
                  {t("projects.evenmint.ctaLive")}
                  <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full" asChild>
                <a href="#projects-grid">{t("projects.evenmint.ctaMore")}</a>
              </Button>
            </div>
          </div>

          {/* Lightweight UI preview inspired by product marketing */}
          <div className="relative mx-auto w-full max-w-[340px] lg:mx-0 lg:justify-self-end">
            <div className="rounded-xl border border-border/90 bg-muted/40 p-1 shadow-inner backdrop-blur-sm motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out hover:scale-[1.02] motion-reduce:hover:scale-100">
              <div className="flex items-center gap-2 rounded-t-lg bg-muted/80 px-3 py-2">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <span className="ml-2 flex-1 truncate text-center font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {t("projects.evenmint.mockTitle")}
                </span>
              </div>
              <div className="space-y-2 rounded-b-lg bg-background/95 p-3">
                <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {t("projects.evenmint.mockLedger")}
                  </span>
                  <Badge variant="outline" className="rounded-full px-2 py-0 text-[10px]">
                    {t("projects.evenmint.mockClosed")}
                  </Badge>
                </div>
                {[t("projects.evenmint.mockRow1"), t("projects.evenmint.mockRow2"), t("projects.evenmint.mockRow3")].map(
                  (label, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border/50 bg-muted/30 px-3 py-2 text-xs transition-colors hover:bg-muted/50"
                    >
                      <p className="font-medium text-foreground">{label}</p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {t("projects.evenmint.mockMeta")}
                      </p>
                    </div>
                  ),
                )}
                <div className="rounded-lg bg-gradient-to-r from-primary/15 to-chart-2/10 px-3 py-2 text-center">
                  <p className="text-[11px] font-semibold text-primary">
                    {t("projects.evenmint.mockSettlement")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimateOnScroll>
  );
}
