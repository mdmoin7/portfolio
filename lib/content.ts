import { PROFILE_IMAGE } from "./seo";

/** Story-driven nav — matches homepage section order */
export const navLinks = [
  { href: "#what-i-do", label: "01. What I Do" },
  { href: "#projects", label: "02. Projects" },
  { href: "#stack", label: "03. Pillars" },
  { href: "#experience", label: "04. Experience" },
  { href: "#about", label: "05. About" },
  { href: "#contact", label: "06. Contact" },
] as const;

export const roles = [
  "Corporate Trainer",
  "Web & Mobile Engineer",
  "Curriculum Designer",
] as const;

export const intro = {
  eyebrow: "Independent Consultant · Corporate Trainer",
  title: "Mohammad Moin",
  subtitle:
    "I help engineering teams ship production software — and grow the people who build it.",
};

export const hero = {
  name: "Mohammad Moin",
  headline: {
    before: "Building production",
    accent1: "systems",
    middle: "and developing",
    accent2: "people.",
  },
  lede:
    "Independent software engineering consultant and corporate technology trainer based in Bengaluru. I partner with organizations on frontend architecture, full-stack delivery, and enterprise upskilling — from architecture reviews to production rollouts and cohort-based training.",
  profileImage: PROFILE_IMAGE,
  profileAlt: "Mohammad Moin — Software Engineering Consultant & Corporate Trainer",
  ctas: [
    { href: "#what-i-do", label: "Explore Services", primary: true },
    { href: "/assets/resume.pdf", label: "Download CV", primary: false, external: true },
  ],
  proofs: [
    { value: 15000, suffix: "+", label: "Engineers Trained" },
    { value: 350, suffix: "+", label: "Sessions Delivered" },
    { value: 14, suffix: "+", label: "Years in Production" },
    { value: 30, suffix: "+", label: "Technologies" },
  ],
};

export const whatIDo = {
  kicker: "01 — What I Do",
  title: "Consulting and training, built on the same engineering depth",
  subtitle:
    "Whether I'm embedded with a delivery team or leading a corporate cohort, the goal is the same: production-ready capability that lasts after the engagement ends.",
  items: [
    {
      href: "/consulting/",
      title: "Consulting Engagements",
      description:
        "End-to-end web and mobile delivery — architecture through deployment — for distributed teams.",
    },
    {
      href: "/engineering/frontend-architecture/",
      title: "Architecture Advisory",
      description: "Scalable frontend systems, design systems, and modernization roadmaps.",
    },
    {
      href: "/training/",
      title: "Corporate Training",
      description: "Enterprise upskilling programs for cohorts of 20–50 experienced engineers.",
    },
    {
      href: "/training/",
      title: "Curriculum Design",
      description: "Custom tracks across React, Angular, NestJS, TypeScript, and GenAI/.NET.",
    },
  ],
};

export const projects = {
  kicker: "02 — Selected Work",
  title: "Products, platforms, and long-term practice",
  subtitle:
    "Representative engineering work spanning product builds, platform architecture, and independent consulting delivery.",
  items: [
    {
      tag: "Featured Build",
      title: "AquaTrack",
      description:
        "Water consumption and billing platform for residential society operations — readings, analytics, billing workflows, and admin tooling.",
      tech: ["React", "Firebase", "Tailwind", "Charts"],
      link: { href: "https://github.com/mdmoin7/AquaTrack", label: "View on GitHub →", external: true },
      span: "2" as const,
    },
    {
      tag: "Platform",
      title: "E-commerce Architecture",
      titleHref: "/consulting/",
      description:
        "Modern commerce stack covering product catalog, cart state, auth, and responsive UI with a contemporary React toolchain.",
      tech: ["React", "Redux Toolkit", "Firebase", "Vite"],
      link: { href: "https://github.com/mdmoin7", label: "GitHub profile →", external: true },
      span: "1" as const,
    },
    {
      tag: "Practice",
      title: "Independent Consulting",
      titleHref: "/consulting/",
      description:
        "Architecture, build, and delivery for clients end to end — remote-first collaboration across time zones.",
      tech: ["Architecture", "Delivery", "Training"],
      link: { href: "/consulting/", label: "Consulting profile →" },
      span: "1" as const,
    },
  ],
};

export const pillars = {
  kicker: "03 — Engineering Pillars",
  title: "Depth across the stack — the same foundation behind delivery and teaching",
  intro:
    "Five core pillars anchor both consulting work and training curricula. Each maps to dedicated authority pages with architecture patterns, delivery practices, and related programs.",
  cards: [
    {
      href: "/engineering/frontend-architecture/",
      title: "Frontend Engineering",
      description: "Component-driven UI, performance, and scalable application architecture.",
      tags: ["React", "Angular", "TypeScript"],
    },
    {
      href: "/engineering/react-native/",
      title: "Mobile Development",
      description: "Cross-platform apps with React Native, Expo, and native integrations.",
      tags: ["React Native", "Expo", "Ionic"],
    },
    {
      href: "/consulting/",
      title: "Backend & APIs",
      description: "Node.js services, NestJS, GraphQL, and secure enterprise integrations.",
      tags: ["Node.js", "NestJS", "GraphQL"],
    },
    {
      href: "/engineering/terraform/",
      title: "DevOps & Cloud",
      description: "Terraform, Azure, CI/CD pipelines, and infrastructure as code.",
      tags: ["Terraform", "Azure", "Docker"],
    },
    {
      href: "/engineering/frontend-architecture/",
      title: "Architecture & Design",
      description: "System design, Nx monorepos, microfrontends, and platform thinking.",
      tags: ["Nx", "Module Federation", "DDD"],
    },
  ],
  stackGroups: [
    {
      title: "Development stack",
      blocks: [
        {
          label: "Frontend & Mobile",
          badges: ["Angular", "React", "Next.js", "React Native", "TypeScript"],
        },
        {
          label: "Backend & Data",
          badges: ["Node.js", "NestJS", "GraphQL", "PostgreSQL", "MongoDB"],
        },
        {
          label: "Infra & Tooling",
          badges: ["Terraform", "Azure", "Docker", "Nx", "GitHub Actions"],
        },
      ],
    },
    {
      title: "Training focus",
      blocks: [
        {
          label: "Formats",
          badges: ["Corporate workshops", "Cohort programs", "Stack migration", "1:1 mentoring"],
        },
        {
          label: "Subjects",
          badges: ["Angular internals", "React & RN", "Terraform", "Nx architecture", "Code quality"],
        },
      ],
    },
  ],
};

export const experience = {
  kicker: "04 — Experience",
  title: "Production engineering, consulting, and enterprise training",
  subtitle: "Fourteen years across delivery, architecture, and upskilling — often in the same week.",
  items: [
    {
      tag: "Consulting",
      title: "Independent Consultant — Web & Mobile",
      period: ["2014", "Present"],
      description:
        "Full-stack delivery for clients end to end — architecture, implementation, and deployment with distributed teams.",
    },
    {
      tag: "Engineering",
      title: "React Consultant — JLL",
      period: ["2024", "2025"],
      description:
        "Re-architected legacy AEM/Java components to React across a multi-country team; led a shared design system translated into React and Angular.",
    },
    {
      tag: "Training",
      title: "Freelance Corporate Trainer",
      period: ["2014", "Present"],
      description:
        "Upskilling programs for IBM, Amazon, Walmart, SAP, and Dell — cohorts of 20–50 engineers with repeat engagements.",
    },
    {
      tag: "Training",
      title: "Technical Trainer — Institutes",
      period: ["2012", "2014"],
      description: "Foundational web development training for early-career engineers.",
    },
  ],
};

export const about = {
  kicker: "05 — About",
  title: "At the intersection of building and teaching",
  subtitle:
    "I don't treat consulting and training as separate careers — they're two expressions of the same craft.",
  paragraphs: [
    "I'm Mohammad Moin, an independent software engineering consultant and corporate technology trainer. I design and ship web and mobile applications across the JavaScript ecosystem — Angular, React, Vue, Node, React Native — leading delivery from architecture through production.",
    "That same production experience becomes structured upskilling: guiding backend engineers into frontend roles, migrating Vue teams onto Angular, and building curricula that engineers can execute without me in the room.",
  ],
  quote:
    "The measure of good training isn't the slide deck — it's the engineer who ships confidently in the new stack.",
  highlights: [
    { value: "14+", label: "Years in production" },
    { value: "15k+", label: "Engineers trained" },
    { value: "350+", label: "Sessions delivered" },
  ],
  cta: { href: "/about/", label: "Full professional profile →" },
};

export const clients = {
  label: "Engineers trained at",
  names: ["IBM", "Amazon", "Walmart", "SAP", "Dell"],
};

export const footer = {
  eyebrow: "Let's work together",
  title: "Have a project, a team, or a technical challenge?",
  cta: { href: "mailto:mohammad.nicoll@gmail.com", label: "Get in touch" },
  note: "Independent consulting for web & mobile delivery, and corporate technology training — grounded in 14+ years of production engineering.",
  links: [
    { href: "/training/", label: "Training" },
    { href: "/consulting/", label: "Consulting" },
    { href: "https://www.linkedin.com/in/mohammadmoin/", label: "LinkedIn", external: true },
    { href: "mailto:mohammad.nicoll@gmail.com", label: "Email" },
  ],
  location: {
    label: "Based in",
    city: "Bengaluru, India",
    note: "Available for remote engagements",
  },
  bottom: [
    "© 2026 Mohammad Moin",
    "Independent Consultant · Corporate Trainer",
    "Built with intention.",
  ],
};

export const navActions = [
  { href: "/assets/resume.pdf", label: "CV", primary: false, external: true },
  { href: "/assets/Mohammad Moin-Consultant.pdf", label: "Profile", primary: true, external: true },
];
