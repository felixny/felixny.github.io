"use client";

import { useState } from "react";
import { ExternalLink, Github, X, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslations } from "@/hooks/useTranslations";

interface Project {
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  demoUrl?: string;
  image: string;
}

const getProjects = (t: any): Project[] => [
  {
    title: t("projects.travelApp.title"),
    description: t("projects.travelApp.description"),
    techStack: t("projects.travelApp.techStack").split(", "),
    githubUrl: "https://github.com/felixny/travel-bucketlist-app",
    demoUrl: "https://github.com/felixny/travel-bucketlist-app",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
  },
  {
    title: t("projects.cryptoTracker.title"),
    description: t("projects.cryptoTracker.description"),
    techStack: t("projects.cryptoTracker.techStack").split(", "),
    githubUrl: "https://github.com/felixny/crypto-tracker",
    demoUrl: "https://github.com/felixny/crypto-tracker",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80",
  },
  {
    title: t("projects.jukeBot.title"),
    description: t("projects.jukeBot.description"),
    techStack: t("projects.jukeBot.techStack").split(", "),
    githubUrl: "https://github.com/felixny/JukeBot",
    demoUrl: "https://github.com/felixny/JukeBot",
    image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80",
  },
];

export default function Projects() {
  const { t } = useTranslations();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: number]: boolean }>({});
  
  const projects = getProjects(t);

  const toggleDescription = (index: number) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getTruncatedDescription = (description: string, maxLength: number = 120) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  return (
    <section id="projects" className="py-24 px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {t("projects.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("projects.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden bg-muted">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <div className="text-sm text-muted-foreground mb-4">
                  {expandedDescriptions[index] ? (
                    <div>
                      <p className="mb-2">{project.description}</p>
                      <button
                        onClick={() => toggleDescription(index)}
                        className="text-primary hover:underline flex items-center gap-1 text-xs"
                      >
                        <ChevronUp className="h-3 w-3" />
                        {t("projects.showLess")}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-2">{getTruncatedDescription(project.description)}</p>
                      <button
                        onClick={() => toggleDescription(index)}
                        className="text-primary hover:underline flex items-center gap-1 text-xs"
                      >
                        <ChevronDown className="h-3 w-3" />
                        {t("projects.readMore")}
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    asChild
                  >
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      {t("projects.viewCode")}
                    </a>
                  </Button>
                  {project.demoUrl && (
                    <Button size="sm" className="flex-1" asChild>
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t("projects.viewProject")}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Project Detail Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedProject?.title}</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-6">
              <div className="relative h-64 overflow-hidden rounded-lg bg-muted">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{t("projects.description")}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">{t("projects.technologiesUsed")}</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button asChild className="flex-1">
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    {t("projects.viewCode")}
                  </a>
                </Button>
                {selectedProject.demoUrl && (
                  <Button asChild className="flex-1">
                    <a
                      href={selectedProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      {t("projects.liveDemo")}
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
