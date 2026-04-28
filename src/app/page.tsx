import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ProfessionalSummary from "@/components/ProfessionalSummary";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import { Toaster } from "@/components/ui/toaster";

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-primary/[0.06] via-transparent to-muted/40"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed left-1/2 top-0 -z-10 h-[32rem] w-[min(56rem,100%)] -translate-x-1/2 rounded-full bg-primary/[0.07] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-page-grid opacity-[0.35] dark:opacity-[0.22]"
        aria-hidden
      />

      <Navigation />
      <Hero />
      <ProfessionalSummary />
      <Projects />
      <Skills />
      <Contact />

      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        Felix Nampanya · Boston
      </footer>

      <Toaster />
    </div>
  );
}
