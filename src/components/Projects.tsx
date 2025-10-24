"use client";

import { ExternalLink, Github } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Project {
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  demoUrl?: string;
  image: string;
}

const projects: Project[] = [
  {
    title: "Travel Bucket List & Info Hub",
    description:
      "A full-stack web application for managing your travel bucket list with destination tracking, photo management, and travel planning features. Features modern glass morphism UI, AWS S3 integration, and external API integrations.",
    techStack: ["React", "TypeScript", "Node.js", "Express", "Supabase", "AWS S3", "Tailwind CSS"],
    githubUrl: "https://github.com/felixny/travel-bucketlist-app",
    demoUrl: "https://github.com/felixny/travel-bucketlist-app",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
  },
  {
    title: "Crypto Tracker",
    description:
      "A Python application that monitors cryptocurrency prices in real-time, sends email alerts when prices cross predefined thresholds, and generates trend graphs with historical data storage.",
    techStack: ["Python", "Pandas", "Matplotlib", "Requests", "SMTP", "CoinGecko API"],
    githubUrl: "https://github.com/felixny/crypto-tracker",
    demoUrl: "https://github.com/felixny/crypto-tracker",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80",
  },
  {
    title: "Weather Dashboard",
    description:
      "Beautiful weather application with location-based forecasts, interactive maps, and weather alerts.",
    techStack: ["React Native", "TypeScript", "OpenWeather API", "Redux"],
    githubUrl: "https://github.com",
    image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&q=80",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A selection of projects showcasing my expertise in building modern,
            scalable applications.
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
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {project.description}
                </p>
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
                      Code
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
                        Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
