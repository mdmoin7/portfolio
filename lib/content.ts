import { PROFILE_IMAGE } from "./seo";

export const navLinks = [
  { href: "#about", label: "01. About" },
  { href: "#what-i-do", label: "02. What I Do" },
  { href: "#stack", label: "03. Pillars" },
  { href: "#projects", label: "04. Projects" },
  { href: "#experience", label: "05. Experience" },
  { href: "#contact", label: "06. Contact" },
] as const;

export const roles = [
  "Corporate Trainer",
  "Web & Mobile Engineer",
  "Curriculum Designer",
] as const;

export const hero = {
  name: "Mohammad Moin",
  headline: {
    before: "I build scalable",
    accent1: "software",
    middle: "and develop",
    accent2: "people.",
  },
  lede:
    "Mohammad Moin is an independent software engineering consultant and corporate technology trainer based in Bengaluru, India. I specialize in frontend architecture, Angular, React, React Native and Terraform/Azure, while helping individuals and engineering teams build production systems and develop modern technical capabilities. Available for freelance consulting engagements and remote collaboration across time zones.",
  profileImage: PROFILE_IMAGE,
  profileAlt:
    "Mohammad Moin - Corporate Trainer and Independent Consultant",
  ctas: [
    { href: "#projects", label: "↗ Explore Engineering Work", primary: true },
    {
      href: "/assets/resume.pdf",
      label: "Download Engineering CV",
      primary: false,
      external: true,
    },
  ],
  proofs: [
    { value: 15000, suffix: "+", label: "Engineers Trained" },
    { value: 350, suffix: "+", label: "Training Sessions" },
    { value: 14, suffix: "+", label: "Years Experience" },
    { value: 30, suffix: "+", label: "Technologies" },
  ],
  focusAreas: [
    {
      title: "Architecture",
      description: "Scalable frontend systems",
    },
    {
      title: "Enterprise Upskilling",
      description: "Corporate training programs",
    },
    {
      title: "Mobile",
      description: "React Native & Ionic apps",
    },
    {
      title: "Infrastructure",
      description: "Terraform & Azure cloud",
    },
  ],
  terminalLines: [
    "Consulting — end-to-end delivery for distributed teams",
    "Training — 15,000+ engineers upskilled since 2014",
    "Clients — IBM · Amazon · Walmart · SAP · Dell",
    "Curricula — React, Angular, NestJS, GenAI/.NET",
  ],
};

export const whatIDo = {
  kicker: "02 — What I Do",
  items: [
    {
      href: "/consulting/",
      title: "Consulting Engagements",
      description: "End-to-end delivery for clients",
    },
    {
      href: "/engineering/frontend-architecture/",
      title: "Architecture Advisory",
      description: "Frontend & systems architecture",
    },
    {
      href: "/training/",
      title: "Corporate Training Programs",
      description: "Enterprise upskilling, cohorts of 20–50",
    },
    {
      href: "/training/",
      title: "Curriculum Design",
      description: "React, Angular, NestJS & GenAI courses",
    },
  ],
};

export const pillars = {
  kicker: "03 — Core Engineering Pillars",
  title: "Technology expertise and architecture focus",
  notes: [
    "5 core pillars",
    "Enterprise stacks",
    "Architecture-led",
    "Hands-on training",
    "+ More across the stack",
  ],
  intro:
    "These five areas are the technical foundation behind both practices — the same depth that goes into client delivery also goes into the curricula I teach. Each has a dedicated authority page covering the technology, architecture patterns, delivery practices, and related training or consulting work.",
  cards: [
    {
      href: "/engineering/frontend-architecture/",
      title: "Frontend Engineering",
      description: "Component-driven UI with performance and scalability.",
      tags: ["React", "Angular", "Vue.js", "+ More"],
    },
    {
      href: "/engineering/react-native/",
      title: "Mobile Development",
      description: "Cross-platform mobile apps with native performance.",
      tags: ["React Native", "Ionic", "Expo", "+ More"],
    },
    {
      href: "/consulting/",
      title: "Backend Engineering",
      description: "Robust APIs, microservices and secure integrations.",
      tags: ["Node.js", "Express", "NestJS", "+ More"],
    },
    {
      href: "/engineering/terraform/",
      title: "DevOps & Cloud",
      description: "Infrastructure as code, CI/CD and cloud automation.",
      tags: ["Terraform", "Azure", "Docker", "+ More"],
    },
    {
      href: "/engineering/frontend-architecture/",
      title: "Architecture & Design",
      description: "System design, patterns and scalable architecture.",
      tags: ["Nx", "DDD", "Design Patterns", "+ More"],
    },
  ],
  stackGroups: [
    {
      title: "Broader development stack",
      blocks: [
        {
          label: "Frontend & Mobile",
          badges: [
            { label: "Angular", lead: true },
            { label: "React & Redux Toolkit", lead: true },
            { label: "Vue.js" },
            { label: "Next.js" },
            { label: "React Native", lead: true },
            { label: "Ionic" },
            { label: "Stencil.js" },
            { label: "TypeScript", lead: true },
          ],
        },
        {
          label: "Backend & APIs",
          badges: [
            { label: "Node.js", lead: true },
            { label: "NestJS" },
            { label: "Express" },
            { label: "GraphQL" },
            { label: "PHP / Laravel" },
            { label: "Python / Django" },
          ],
        },
        {
          label: "Data, Infra & Tooling",
          badges: [
            { label: "MongoDB" },
            { label: "PostgreSQL" },
            { label: "AWS" },
            { label: "Azure" },
            { label: "Terraform" },
            { label: "Docker" },
            { label: "Nx Monorepo" },
            { label: "Webpack 5 / esbuild" },
            { label: "GitHub Actions" },
          ],
        },
      ],
    },
    {
      title: "Training focus — upskilling individuals & corporates",
      blocks: [
        {
          label: "Programs & formats",
          badges: [
            { label: "Stack migration curricula", lead: true },
            { label: "Backend → Frontend upskilling", lead: true },
            { label: "Corporate workshops" },
            { label: "1:1 mentoring" },
            { label: "Cohort-based training" },
            { label: "+ Many More", more: true },
          ],
        },
        {
          label: "Subjects taught",
          badges: [
            { label: "Angular internals", lead: true },
            { label: "React & React Native" },
            { label: "Terraform & Azure" },
            { label: "Vue → Angular migration" },
            { label: "TypeScript fundamentals" },
            { label: "Nx & monorepo architecture" },
            { label: "Code quality & CI/CD" },
            { label: "+ Many More", more: true },
          ],
        },
      ],
    },
  ],
};

export const projects = {
  kicker: "04 — Selected Projects",
  title: "Products and engineering work",
  notes: [
    "Featured builds",
    "React",
    "Firebase",
    "Production patterns",
    "+ More projects & engagements",
  ],
  items: [
    {
      tag: "Featured Build",
      title: "AquaTrack",
      description:
        "Water consumption tracking platform for residential society operations, covering readings, monthly analytics, billing configuration, reporting and administrative workflows.",
      tech: ["React", "Firebase", "Tailwind", "Charts"],
      link: {
        href: "https://github.com/mdmoin7/AquaTrack",
        label: "View source on GitHub →",
        external: true,
      },
      visual: "dashboard" as const,
    },
    {
      tag: "Selected Engineering Work",
      title: "E-commerce Platform",
      titleHref: "/consulting/",
      description:
        "Modern e-commerce application architecture covering product data, cart state, authentication and responsive application UI using a contemporary React stack.",
      tech: ["React", "Redux Toolkit", "Firebase", "Vite"],
      link: {
        href: "https://github.com/mdmoin7",
        label: "View GitHub profile →",
        external: true,
      },
      visual: "shop" as const,
    },
    {
      tag: "Long-term Practice",
      title: "Independent Consulting",
      titleHref: "/consulting/",
      description:
        "Full-stack web and mobile delivery for clients end to end — architecture, build and deployment — working remotely and asynchronously with distributed teams.",
      tech: ["Architecture", "Consulting", "Delivery", "Training"],
      link: {
        href: "/consulting/",
        label: "View consulting profile →",
      },
      visual: "consulting" as const,
    },
  ],
};

export const about = {
  kicker: "01 — About",
  title: "Building and teaching",
  signals: ["Build", "Teach", "Mentor", "Modernize"],
  paragraphs: [
    "I'm Mohammad Moin, an independent software engineering consultant and corporate technology trainer. I work at the intersection of building and teaching. As a full stack engineer, I design and ship web and mobile applications across the JavaScript ecosystem — Angular, React, Vue, Node, React Native — leading delivery from architecture through production.",
    "As a corporate technology trainer, I take that same production experience and turn it into structured upskilling programs — helping individuals and engineering teams move onto modern stacks they haven't worked in before. Recent work includes guiding Java/backend engineers into frontend roles, and migrating Vue teams onto Angular through contrastive, hands-on curricula. I also remain available for freelance consulting engagements where hands-on delivery, architecture or modernization expertise is required.",
  ],
  quote:
    "The goal of training isn't a slide deck — it's an engineer who can ship in the new stack without me in the room.",
  cta: { href: "/about/", label: "About Mohammad Moin →" },
};

export const experience = {
  kicker: "05 — Experience",
  title: "Engineering, consulting and training",
  notes: [
    "14+ years",
    "Consulting",
    "Training",
    "Distributed teams",
    "+ More experience",
  ],
  items: [
    {
      tag: "Consulting",
      title: "Independent Consultant — Web & Mobile Development",
      period: ["2014", "Present"],
      description:
        "Full-stack web and mobile delivery for clients end to end — architecture, build, and deployment — working remotely and asynchronously with distributed teams.",
    },
    {
      tag: "Engineering",
      title: "React Consultant — JLL",
      period: ["Jan 2024", "Mar 2025"],
      description:
        "Re-architected legacy AEM/Java-based web components to React within a 10–15 engineer team spanning multiple countries. Led Java/AEM ↔ React integration across globally distributed teams and orchestrated a shared design system built in SolidJS, translated into React, Angular, and other framework components.",
    },
    {
      tag: "Training",
      title: "Freelance Corporate Trainer",
      period: ["2014", "Present"],
      description:
        "Designing and delivering upskilling programs — Angular, React, Vue, Node, TypeScript — for enterprise engineering teams at IBM, Amazon, Walmart, SAP, and Dell. Cohorts of 20–50 engineers, each with 5+ years' experience, with repeat engagements from returning clients.",
    },
    {
      tag: "Training",
      title: "Technical Trainer — Training Institutes",
      period: ["2012", "2014"],
      description:
        "Delivered technical training on web development fundamentals to early-career engineers.",
    },
  ],
};

export const clients = {
  label: "Engineers & teams trained at",
  names: ["IBM", "Amazon", "Walmart", "SAP", "Dell", "+ Many more"],
};

export const footer = {
  eyebrow: "Let's work together",
  title: "Have a project, a team, or a technical challenge?",
  cta: {
    href: "mailto:mohammad.nicoll@gmail.com",
    label: "Get in touch",
  },
  note: "Independent consulting for web & mobile delivery, and corporate technology training — grounded in 14+ years of production engineering.",
  links: [
    { href: "/training/", label: "Training" },
    { href: "/consulting/", label: "Consulting" },
    {
      href: "https://www.linkedin.com/in/mohammadmoin/",
      label: "LinkedIn",
      external: true,
    },
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
  {
    href: "/assets/resume.pdf",
    label: "Training Profile",
    primary: false,
    external: true,
  },
  {
    href: "/assets/Mohammad Moin-Consultant.pdf",
    label: "Consultant Profile",
    primary: true,
    external: true,
  },
];
