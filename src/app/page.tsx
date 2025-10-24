import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ProfessionalSummary from "@/components/ProfessionalSummary";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Contact from "@/components/Contact";
import { Toaster } from "@/components/ui/toaster";

export default function Page() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <ProfessionalSummary />
      <Projects />
      <Skills />
      <Contact />
      <Toaster />
    </div>
  );
}