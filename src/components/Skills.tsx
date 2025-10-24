"use client";

import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Android Development",
    skills: [
      { name: "Kotlin", level: 95 },
      { name: "Android SDK", level: 92 },
      { name: "Room Database", level: 88 },
      { name: "Retrofit", level: 90 },
      { name: "Dagger", level: 85 },
      { name: "Jetpack Compose", level: 82 },
      { name: "RxJava", level: 80 },
    ],
  },
  {
    title: "Frontend Development",
    skills: [
      { name: "React / Next.js", level: 92 },
      { name: "TypeScript", level: 90 },
      { name: "JavaScript", level: 88 },
      { name: "Tailwind CSS", level: 90 },
      { name: "Redux / Zustand", level: 85 },
    ],
  },
  {
    title: "Backend Development",
    skills: [
      { name: "GraphQL", level: 92 },
      { name: "REST APIs", level: 95 },
      { name: "Node.js", level: 88 },
      { name: "Express.js", level: 85 },
      { name: "AWS", level: 88 },
      { name: "Firebase", level: 82 },
      { name: "PostgreSQL", level: 85 },
      { name: "Docker", level: 80 },
    ],
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Skills & Expertise
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Proficient in a wide range of technologies across mobile, web, and
            backend development.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <Card key={categoryIndex} className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold mb-6">{category.title}</h3>
              <div className="space-y-5">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {skill.level}%
                      </span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
