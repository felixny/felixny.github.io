"use client";

import { ArrowRight, Github, Linkedin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center px-6 lg:px-8 pt-16"
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Felix Nampanya
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground mb-6">
            Software Engineer
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Building elegant solutions with modern technologies. Specialized in
            Android, Frontend, and Backend development.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          <Button
            size="lg"
            onClick={scrollToContact}
            className="group text-base px-8"
          >
            Get in Touch
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              const element = document.getElementById("projects");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-base px-8"
          >
            View Projects
          </Button>
        </div>

        {/* Social Media Links */}
        <div className="flex justify-center gap-4 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
          <Button
            variant="ghost"
            size="lg"
            asChild
            className="group hover:bg-primary/10 transition-colors"
          >
            <a
              href="https://github.com/felixny"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="h-5 w-5" />
              GitHub
              <ExternalLink className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            asChild
            className="group hover:bg-primary/10 transition-colors"
          >
            <a
              href="https://linkedin.com/in/felixny"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Linkedin className="h-5 w-5" />
              LinkedIn
              <ExternalLink className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
