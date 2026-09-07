import type { SubpageContent } from "./types";

export const consultingPage: SubpageContent = {
  path: "/consulting/",
  metadata: {
    title: "Software Consulting | Mohammad Moin — Independent Consultant & Corporate Trainer",
    description:
      "Software consulting by Mohammad Moin covering full-stack web and mobile development, frontend architecture, Nx monorepos, stack migration, technical delivery and engineering mentoring.",
  },
  navActive: "consulting",
  hero: {
    eyebrow: "02 · Software Consulting & Engineering",
    title: "Practical engineering support for modern web and mobile products.",
    lede: "Mohammad Moin provides full-stack engineering and technical consulting across frontend architecture, mobile development, backend delivery, monorepos, stack migration and engineering enablement.",
    actions: [
      {
        href: "mailto:mohammad.nicoll@gmail.com?subject=Software%20Consulting%20Enquiry",
        label: "Discuss a project →",
        primary: true,
      },
      { href: "/", label: "View portfolio" },
      { href: "/training/", label: "Training" },
    ],
  },
  sections: [
    {
      type: "cards",
      kicker: "Consulting areas",
      title: "From architecture to production delivery.",
      intro:
        "Consulting engagements can focus on a specific technical problem or cover the complete path from architecture and proof of concept through implementation, quality and delivery.",
      cards: [
        {
          title: "Frontend architecture",
          description:
            "Application structure, component architecture, state management, performance, testing and maintainability across Angular, React and Vue.",
          topics: [
            { label: "Angular", href: "/engineering/angular/" },
            { label: "React", href: "/engineering/react/" },
            "Vue.js",
            "TypeScript",
          ],
        },
        {
          title: "Full-stack development",
          description:
            "End-to-end delivery across web applications, APIs, authentication, data access and production engineering.",
          topics: ["Node.js", "NestJS", "Express", "Firebase"],
        },
        {
          title: "Monorepo & platform architecture",
          description:
            "Designing maintainable workspaces, shared libraries, dependency boundaries, build strategies and CI/CD workflows.",
          topics: [
            "Nx",
            { label: "Architecture", href: "/engineering/frontend-architecture/" },
            "CI/CD",
          ],
        },
        {
          title: "Stack migration",
          description:
            "Technical assessment, target architecture, proof-of-concept implementation and migration planning for teams moving between frameworks or stacks.",
          topics: ["Migration", "Architecture", "POC"],
        },
        {
          title: "Mobile application engineering",
          description:
            "Cross-platform application development and architecture using React Native and Ionic, with emphasis on maintainability and production delivery.",
          topics: [
            { label: "React Native", href: "/engineering/react-native/" },
            "Ionic",
            "Mobile",
          ],
        },
        {
          title: "Engineering enablement",
          description:
            "Code quality practices, technical mentoring, debugging workflows and development standards that help teams ship more consistently.",
          topics: ["Mentoring", "Quality", "Delivery"],
        },
      ],
    },
    {
      type: "steps",
      kicker: "Engagement model",
      title: "Focused on an outcome, not a technology checklist.",
      intro:
        "Engagements can be structured around an architecture review, technical POC, implementation sprint, migration roadmap, delivery support or ongoing engineering mentorship.",
      muted: true,
      steps: [
        {
          number: "01",
          title: "Assess",
          body: "Understand the product, current stack, constraints and delivery problem.",
        },
        {
          number: "02",
          title: "Design",
          body: "Define architecture, priorities, technical direction and an actionable plan.",
        },
        {
          number: "03",
          title: "Build",
          body: "Implement the critical path, POC or engineering changes with the team.",
        },
        {
          number: "04",
          title: "Enable",
          body: "Leave the team with patterns, knowledge and practices they can sustain.",
        },
      ],
    },
    {
      type: "topics",
      kicker: "Related engineering",
      title: "Explore the technical focus areas.",
      topics: [
        { label: "Angular", href: "/engineering/angular/" },
        { label: "React", href: "/engineering/react/" },
        { label: "React Native", href: "/engineering/react-native/" },
        { label: "Frontend Architecture", href: "/engineering/frontend-architecture/" },
        { label: "Terraform", href: "/engineering/terraform/" },
      ],
    },
    {
      type: "cta",
      kicker: "Next step",
      title: "Have a technical problem worth solving?",
      intro:
        "Share the product context, current stack and desired outcome. The engagement can then be shaped around the actual problem rather than a predefined technology package.",
      actions: [
        {
          href: "mailto:mohammad.nicoll@gmail.com?subject=Software%20Consulting%20Enquiry",
          label: "Start a conversation →",
          primary: true,
        },
        { href: "/training/", label: "Explore training" },
      ],
    },
  ],
  footer: "rich",
};
