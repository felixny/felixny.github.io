"use client";

import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Skill {
  name: string;
  level: number;
  description?: string;
  projects?: string[];
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Android Development",
    skills: [
      { 
        name: "Kotlin", 
        level: 95, 
        description: "Primary language for Android development, used extensively in production apps",
        projects: ["JukeBot", "Ahold Delhaize Apps"]
      },
      { 
        name: "Android SDK", 
        level: 92, 
        description: "Core Android development framework and APIs",
        projects: ["JukeBot", "Professional Android Apps"]
      },
      { 
        name: "Room Database", 
        level: 88, 
        description: "Local database management for Android apps",
        projects: ["JukeBot", "Data-driven Android Apps"]
      },
      { 
        name: "Retrofit", 
        level: 90, 
        description: "Type-safe HTTP client for Android networking",
        projects: ["JukeBot", "API Integration Projects"]
      },
      { 
        name: "Dagger", 
        level: 85, 
        description: "Dependency injection framework for Android",
        projects: ["JukeBot", "Enterprise Android Apps"]
      },
      { 
        name: "Jetpack Compose", 
        level: 82, 
        description: "Modern declarative UI toolkit for Android",
        projects: ["Modern Android UI Development"]
      },
      { 
        name: "RxJava", 
        level: 80, 
        description: "Reactive programming library for Android",
        projects: ["Asynchronous Android Development"]
      },
    ],
  },
  {
    title: "Frontend Development",
    skills: [
      { 
        name: "React / Next.js", 
        level: 92, 
        description: "Modern React framework for full-stack web applications",
        projects: ["Travel Bucket List", "Portfolio Website"]
      },
      { 
        name: "TypeScript", 
        level: 90, 
        description: "Strongly typed JavaScript for scalable applications",
        projects: ["Travel Bucket List", "Portfolio Website", "JukeBot Web App"]
      },
      { 
        name: "JavaScript", 
        level: 88, 
        description: "Core web development language",
        projects: ["All Web Projects"]
      },
      { 
        name: "Tailwind CSS", 
        level: 90, 
        description: "Utility-first CSS framework for rapid UI development",
        projects: ["Portfolio Website", "Travel Bucket List"]
      },
      { 
        name: "Redux / Zustand", 
        level: 85, 
        description: "State management libraries for React applications",
        projects: ["Complex Web Applications"]
      },
    ],
  },
  {
    title: "Backend Development",
    skills: [
      { 
        name: "GraphQL", 
        level: 92, 
        description: "Query language and runtime for APIs, used in production systems",
        projects: ["Ahold Delhaize Backend", "Peapod Digital Labs"]
      },
      { 
        name: "REST APIs", 
        level: 95, 
        description: "RESTful API design and implementation, core backend expertise",
        projects: ["Travel Bucket List", "JukeBot", "Enterprise Backends"]
      },
      { 
        name: "Node.js", 
        level: 88, 
        description: "JavaScript runtime for server-side development",
        projects: ["Travel Bucket List Backend", "API Services"]
      },
      { 
        name: "Express.js", 
        level: 85, 
        description: "Web application framework for Node.js",
        projects: ["Travel Bucket List Backend", "REST API Development"]
      },
      { 
        name: "AWS", 
        level: 88, 
        description: "Amazon Web Services cloud platform, S3 integration",
        projects: ["Travel Bucket List", "Cloud Infrastructure"]
      },
      { 
        name: "Firebase", 
        level: 95, 
        description: "Real-time database and backend services for mobile/web apps",
        projects: ["JukeBot", "Real-time Collaborative Apps"]
      },
      { 
        name: "PostgreSQL", 
        level: 85, 
        description: "Open-source relational database management system",
        projects: ["Travel Bucket List", "Data-driven Applications"]
      },
      { 
        name: "Docker", 
        level: 80, 
        description: "Containerization platform for application deployment",
        projects: ["Production Deployments", "Development Environments"]
      },
    ],
  },
];

export default function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const getSkillLevel = (level: number) => {
    if (level >= 90) return "Expert";
    if (level >= 80) return "Advanced";
    if (level >= 70) return "Intermediate";
    return "Beginner";
  };

  const getSkillColor = (level: number) => {
    if (level >= 90) return "bg-green-500";
    if (level >= 80) return "bg-blue-500";
    if (level >= 70) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <section id="skills" className="py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Skills & Expertise
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hover over skills to see details, click for more information about my experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="p-6 hover:shadow-lg transition-all duration-300">
              <h3 className="text-xl font-semibold mb-6">{category.title}</h3>
              <div className="space-y-5">
                {category.skills.map((skill, skillIndex) => (
                  <div 
                    key={skillIndex}
                    className="group cursor-pointer"
                    onMouseEnter={() => setHoveredSkill(skill.name)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    onClick={() => setSelectedSkill(skill)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">
                        {skill.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={skill.level >= 90 ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {getSkillLevel(skill.level)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={skill.level} 
                        className="h-2 transition-all duration-500 group-hover:h-3" 
                      />
                      <div 
                        className={`absolute top-0 left-0 h-full transition-all duration-500 group-hover:opacity-80 ${getSkillColor(skill.level)}`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    
                    {/* Hover tooltip */}
                    {hoveredSkill === skill.name && (
                      <div className="absolute z-10 mt-2 p-3 bg-background border rounded-lg shadow-lg max-w-xs">
                        <p className="text-sm text-muted-foreground">
                          {skill.description}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {skill.projects?.map((project, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {project}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Selected skill modal */}
        {selectedSkill && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedSkill(null)}
          >
            <Card 
              className="max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{selectedSkill.name}</h3>
                <button 
                  onClick={() => setSelectedSkill(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={selectedSkill.level >= 90 ? "default" : "secondary"}
                  >
                    {getSkillLevel(selectedSkill.level)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {selectedSkill.level}% proficiency
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${getSkillColor(selectedSkill.level)}`}
                    style={{ width: `${selectedSkill.level}%` }}
                  />
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {selectedSkill.description}
                </p>
                
                <div>
                  <h4 className="font-medium mb-2">Used in projects:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSkill.projects?.map((project, idx) => (
                      <Badge key={idx} variant="outline">
                        {project}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
