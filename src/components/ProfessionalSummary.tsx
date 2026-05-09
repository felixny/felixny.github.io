"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Mail, MapPin, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/hooks/useTranslations";

interface Experience {
  title: string;
  company: string;
  location: string;
  duration: string;
  summary: string;
  bullets: string[];
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
    duration: "Apr 2024 - Present",
    summary:
      "I ship and maintain slices of production web applications shoppers use daily. The usual mix is React and TypeScript, backend APIs backed by relational data, merges moving through CI/CD, and pairing with design, QA, backend and product so regressions carry numbers behind them.",
    bullets: [
      "REST and GraphQL integrations emphasize validation parity, sane error payloads, guarded fallbacks and lightweight telemetry whenever partner hops slow down.",
      "Production regressions routinely cross React surfaces, middleware and warehouses. Targeted SQL, log traces and dashboards stay paired with repro snippets QA reruns verbatim.",
      "Advertising integrations tying Chicory and Gambit journeys into storefront experiences drove a documented one hundred percent lift in attributable in-app ad revenue backed by partner dashboards.",
    ],
    technologies: [
      "React",
      "TypeScript",
      "GraphQL",
      "REST APIs",
      "SQL",
      "CI/CD",
    ],
  },
  {
    title: "Software Engineer",
    company: "Peapod Digital Labs",
    location: "Quincy, MA",
    duration: "Jan 2023 - Mar 2024",
    summary:
      "Weekly Ads-era product unfolded inside Scrum teams anchored on JavaScript, React, REST, GraphQL and relational databases. Frontend views, API contracts and validation finished before demos.",
    bullets: [
      "The slow order-history path floated around three to four seconds until query consolidation, fewer round trips and tighter caching kept common requests reliably under three hundred milliseconds in production.",
      "Jest coverage, curated Postman collections, Cypress regression smoke plus CI asserts caught UI drift before merges.",
      "Shared SQL validation scripts paired with sharper API signals cut repeat investigation latency about thirty percent once everyone replayed identical fixtures.",
    ],
    technologies: [
      "React",
      "JavaScript",
      "TypeScript",
      "GraphQL",
      "REST APIs",
      "SQL",
      "Scrum",
    ],
  },
  {
    title: "Software Engineering Intern",
    company: "IDEMIA",
    location: "Billerica, MA",
    duration: "May 2022 - Sep 2022",
    summary:
      "Hands-on internship on Mobile ID flows tying QR scans, NFC taps and Bluetooth readers to Android clients. Debugging meant handset logs plus tight defect write-ups.",
    bullets: [
      "Exercised NFC, QR and Bluetooth integrations against reader firmware builds.",
      "Logged cross-device oddities early with repro assets so firmware and native owners could unblock quickly.",
      "Captured edge cases straight from QA feedback without dropping reader state.",
    ],
    technologies: ["Android", "NFC", "Bluetooth", "QR"],
  },
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
    skills: ["Java", "Kotlin", "JavaScript", "TypeScript", "Python", "C++"],
  },
  {
    category: "Web Frameworks",
    skills: ["React", "Next.js", "Vue.js", "Angular"],
  },
  {
    category: "Mobile Development",
    skills: ["Android", "Jetpack Compose", "Room", "Retrofit", "Dagger", "RxJava"],
  },
  {
    category: "Backend Technologies",
    skills: [
      "GraphQL",
      "REST APIs",
      "Node.js",
      "Express.js",
      "Caching",
      "Performance Optimization",
    ],
  },
  {
    category: "Tools & Platforms",
    skills: ["Git", "Docker", "AWS", "Android Studio", "Postman", "VS Code"],
  },
];

export default function ProfessionalSummary() {
  const { t } = useTranslations();

  return (
    <section id="professional-summary" className="relative py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 max-w-3xl mx-auto text-center space-y-4">
          <div className="flex justify-center">
            <span className="section-label">{t("navigation.about")}</span>
          </div>
          <h2 className="section-title">{t("about.title")}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("about.description")}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="h-fit p-6">
              <h3 className="text-lg font-semibold tracking-tight mb-6">{t("about.contactInfo")}</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{t("about.email")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{t("about.location")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{t("about.availability")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  <a href="https://www.linkedin.com/in/felixny/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    {t("about.linkedin")}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  <a href="https://github.com/felixny" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    {t("about.github")}
                  </a>
                </div>
              </div>
              <Button className="w-full mt-6" asChild>
                <a href="https://drive.google.com/uc?export=download&id=1rcP-irzAWbOMlQ4R_2ukN9Qn5U_OOb5U" target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4 mr-2" />
                  {t("about.downloadResume")}
                </a>
              </Button>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Experience */}
            <Card className="p-6 md:p-8">
              <h3 className="mb-6 text-xl font-semibold">{t("about.experience")}</h3>
              <div className="space-y-10">
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
                    <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
                      {exp.summary}
                    </p>
                    <ul className="space-y-2 mb-4">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1.5">•</span>
                          {bullet}
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
            <Card className="p-6 md:p-8">
              <h3 className="text-lg font-semibold tracking-tight mb-8">{t("about.education")}</h3>
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
            <Card className="p-6 md:p-8">
              <h3 className="text-lg font-semibold tracking-tight mb-8">{t("about.technicalSkills")}</h3>
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
