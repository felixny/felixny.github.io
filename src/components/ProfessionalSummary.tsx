"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Mail, MapPin, Phone, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Experience {
  title: string;
  company: string;
  location: string;
  duration: string;
  description: string[];
  technologies: string[];
}

interface Education {
  degree: string;
  institution: string;
  location: string;
  year: string;
  gpa?: string;
}

interface Skill {
  category: string;
  skills: string[];
}

const experiences: Experience[] = [
  {
    title: "Software Engineer",
    company: "Ahold Delhaize USA",
    location: "Quincy, MA",
    duration: "Mar 2024 - Present",
    description: [
      "Designed and implemented scalable Android and backend features handling millions of customer interactions and real-time deal recommendations",
      "Integrated third-party APIs (Chicory, Gambit) into distributed shopping and ad pipelines, boosting in-app revenue by 50%",
      "Re-architected checkout and cart systems using GraphQL endpoints with caching layers, improving transaction reliability by 35% under peak load",
      "Optimized memory usage and performance bottlenecks, increasing crash-free sessions by 40% and ensuring system stability at scale",
      "Collaborated across backend, mobile, and product teams to deliver high-availability solutions and maintain production SLAs"
    ],
    technologies: ["Android", "GraphQL", "Java", "Kotlin", "REST APIs", "Caching", "Performance Optimization"]
  },
  {
    title: "Software Engineer",
    company: "Peapod Digital Labs",
    location: "Quincy, MA", 
    duration: "Jan 2023 - Mar 2024",
    description: [
      "Built and maintained GraphQL/REST services for Special Offers and Weekly Ads, enabling high-throughput data delivery to mobile and web clients",
      "Developed scalable Android features with Dagger, Room, Retrofit, and Jetpack libraries, reducing cold start times by 25%",
      "Optimized data caching and network layers to support concurrent users during promotional events with minimal latency"
    ],
    technologies: ["GraphQL", "REST APIs", "Android", "Dagger", "Room", "Retrofit", "Jetpack", "Caching"]
  },
  {
    title: "Software Engineer Intern",
    company: "IDEMIA",
    location: "Billerica, MA",
    duration: "May 2022 - Sep 2022",
    description: [
      "Developed Bluetooth, NFC, and QR integrations for a secure Mobile ID system, enhancing verification speed and reliability"
    ],
    technologies: ["Bluetooth", "NFC", "QR Code", "Mobile ID", "Security"]
  }
];

const education: Education[] = [
  {
    degree: "Master of Science in Computer Science",
    institution: "Northeastern University",
    location: "Boston, MA",
    year: "2023",
    gpa: undefined
  }
];

const skills: Skill[] = [
  {
    category: "Programming Languages",
    skills: ["Java", "Kotlin", "JavaScript", "TypeScript", "Python", "C++"]
  },
  {
    category: "Mobile Development",
    skills: ["Android", "Jetpack Compose", "Room", "Retrofit", "Dagger", "RxJava"]
  },
  {
    category: "Backend Technologies", 
    skills: ["GraphQL", "REST APIs", "Node.js", "Express.js", "Caching", "Performance Optimization"]
  },
  {
    category: "Tools & Platforms",
    skills: ["Git", "Docker", "AWS", "Android Studio", "Postman", "VS Code"]
  }
];

export default function ProfessionalSummary() {
  return (
    <section id="professional-summary" className="py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Professional Summary
          </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Experienced software engineer with expertise in full-stack development,
                    modern web technologies, and building scalable applications.
                  </p>
                  {/* Force rebuild for GitHub Pages */}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="p-6 h-fit">
              <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">felixynx@gmail.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Boston, MA</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Available for opportunities</span>
                </div>
                <div className="flex items-center gap-3">
                  <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  <a href="https://linkedin.com/in/felixny" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    LinkedIn Profile
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  <a href="https://github.com/felixny" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    GitHub Profile
                  </a>
                </div>
              </div>
              <Button className="w-full mt-6" asChild>
                <a href="https://drive.google.com/uc?export=download&id=1rcP-irzAWbOMlQ4R_2ukN9Qn5U_OOb5U" target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </a>
              </Button>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Professional Summary */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">About Me</h3>
              <p className="text-muted-foreground leading-relaxed">
                Passionate software engineer with 4+ years of experience in full-stack development. 
                Specialized in building modern web applications using React, Node.js, and cloud technologies. 
                Strong background in mobile development with React Native and Android. 
                Committed to writing clean, maintainable code and delivering exceptional user experiences.
              </p>
            </Card>

            {/* Experience */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Professional Experience</h3>
              <div className="space-y-8">
                {experiences.map((exp, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h4 className="text-lg font-semibold">{exp.title}</h4>
                      <span className="text-sm text-muted-foreground">{exp.duration}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <span className="font-medium text-primary">{exp.company}</span>
                      <span className="text-sm text-muted-foreground">• {exp.location}</span>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {exp.description.map((desc, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1.5">•</span>
                          {desc}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Education */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Education</h3>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h4 className="text-lg font-semibold">{edu.degree}</h4>
                      <span className="text-sm text-muted-foreground">{edu.year}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="font-medium text-primary">{edu.institution}</span>
                      <span className="text-sm text-muted-foreground">• {edu.location}</span>
                      {edu.gpa && (
                        <span className="text-sm text-muted-foreground">• GPA: {edu.gpa}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Skills */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Technical Skills</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <h4 className="font-semibold mb-3 text-primary">{skill.category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {skill.skills.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
