import type { SubpageContent } from "./types";

export const trainingPage: SubpageContent = {
  path: "/training/",
  metadata: {
    title: "Corporate Technology Training | Mohammad Moin — Independent Consultant",
    description:
      "Corporate technology training by Mohammad Moin — practical upskilling programs for engineering teams across Angular, React, React Native, TypeScript, Node.js, Nx and stack migration.",
  },
  navActive: "training",
  hero: {
    eyebrow: "01 · Corporate Technology Training",
    title: "Practical training for modern engineering teams.",
    lede: "Mohammad Moin designs and delivers practical technology upskilling programs for engineers and corporate teams moving onto modern JavaScript stacks, with an emphasis on production practices, architecture and hands-on implementation.",
    actions: [
      {
        href: "mailto:mohammad.nicoll@gmail.com?subject=Corporate%20Training%20Enquiry",
        label: "Discuss a training program →",
        primary: true,
      },
      { href: "/", label: "View portfolio" },
      { href: "/consulting/", label: "Consulting" },
    ],
  },
  sections: [
    {
      type: "intro",
      kicker: "Training approach",
      title: "Production experience, translated into practical learning.",
      intro:
        "Programs are structured around real development workflows rather than isolated syntax. Depending on the engagement, training can combine guided theory, practical exercises, proof-of-concept work, architecture discussions, debugging and code-quality practices.",
      facts: [
        { strong: "Practical", span: "Hands-on, implementation-led learning" },
        { strong: "Enterprise", span: "Architecture, tooling and team workflows" },
        { strong: "Flexible", span: "Corporate, cohort and mentoring formats" },
      ],
    },
    {
      type: "cards",
      kicker: "Programs",
      title: "Technology training areas",
      intro:
        "Training can be delivered as focused technology programs or combined into a stack-migration and engineering-upskilling curriculum.",
      muted: true,
      cards: [
        {
          tag: "Frontend",
          title: "Angular Corporate Training",
          description:
            "Modern Angular development covering application architecture, standalone components, routing, state, forms, testing, performance and production practices.",
          topics: ["Angular", "TypeScript", "Architecture", "Testing"],
        },
        {
          tag: "Frontend & Mobile",
          title: "React & React Native Training",
          description:
            "Practical React and React Native development with component architecture, hooks, state management, performance, debugging and production application patterns.",
          topics: ["React", "React Native", "Redux Toolkit", "Mobile"],
        },
        {
          tag: "Backend",
          title: "Node.js & Full-Stack JavaScript",
          description:
            "Backend and full-stack engineering with Node.js, API design, Express/NestJS patterns, authentication, data access, testing and service architecture.",
          topics: ["Node.js", "NestJS", "Express", "APIs"],
        },
        {
          tag: "Language",
          title: "TypeScript Engineering",
          description:
            "TypeScript for production engineering: type modelling, generics, utility types, API contracts, reusable abstractions and maintainable application code.",
          topics: ["TypeScript", "Generics", "Type Safety"],
        },
        {
          tag: "Architecture",
          title: "Nx & Monorepo Architecture",
          description:
            "Enterprise monorepo practices including workspace organization, libraries, dependency boundaries, affected builds, shared tooling and CI/CD workflows.",
          topics: ["Nx", "Monorepo", "CI/CD", "Architecture"],
        },
        {
          tag: "Custom programs",
          title: "Engineering Upskilling & Stack Migration",
          description:
            "Custom programs for teams moving from one technology stack to another, including capability assessment, curriculum design, practical POCs and mentoring.",
          topics: ["Upskilling", "Migration", "Mentoring"],
        },
      ],
    },
    {
      type: "cards",
      kicker: "Engagement formats",
      title: "Designed around the team's outcome.",
      cards: [
        {
          title: "Corporate cohort",
          description:
            "Structured programs for engineering teams with a defined curriculum, practical exercises and progressive project work.",
        },
        {
          title: "Workshop",
          description:
            "Focused sessions for a specific framework, architecture topic, tooling decision or migration challenge.",
        },
        {
          title: "1:1 mentoring",
          description:
            "Targeted guidance for engineers who need deeper support with architecture, debugging, code quality or technology transition.",
        },
        {
          title: "Custom curriculum",
          description:
            "A program mapped to the team's existing stack, experience level, delivery goals and technology roadmap.",
        },
      ],
    },
    {
      type: "cta",
      kicker: "Next step",
      title: "Need a training program for your team?",
      intro:
        "Share the current stack, target technology, team profile and desired outcome. A focused curriculum can then be shaped around the actual engineering context.",
      actions: [
        {
          href: "mailto:mohammad.nicoll@gmail.com?subject=Corporate%20Training%20Enquiry",
          label: "Start a conversation →",
          primary: true,
        },
        { href: "/consulting/", label: "Explore consulting" },
      ],
    },
  ],
  footer: "rich",
};
