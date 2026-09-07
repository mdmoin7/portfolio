import type { SubpageContent } from "./types";

export const aboutPage: SubpageContent = {
  path: "/about/",
  metadata: {
    title:
      "About Mohammad Moin — Independent Software Engineering Consultant & Corporate Technology Trainer",
    description:
      "About Mohammad Moin, an independent software engineering consultant and corporate technology trainer based in Bengaluru, India. He works at the intersection of building and teaching, specializing in frontend architecture, Angular, React, React Native and Terraform/Azure.",
    ogType: "profile",
  },
  navActive: "about",
  hero: {
    eyebrow: "01 · About Mohammad Moin",
    title: "Independent software engineering consultant & corporate technology trainer.",
    lede: "Mohammad Moin is an independent software engineering consultant and corporate technology trainer based in Bengaluru, India. He works at the intersection of building and teaching — delivering production web and mobile applications while helping engineering teams develop practical, industry-relevant capabilities.",
    actions: [
      { href: "/consulting/", label: "Explore consulting", primary: true },
      { href: "/training/", label: "Explore training" },
    ],
  },
  sections: [
    {
      type: "intro",
      kicker: "Who I am",
      title: "Building software. Developing people.",
      intro:
        "With 14+ years of production engineering experience underpinning both practices, Mohammad Moin combines hands-on delivery with technical enablement. His work spans application architecture, development, modernization, deployment and enterprise training.",
      callout: {
        title: "The intersection of building and teaching",
        body: "Consulting keeps the work grounded in production engineering. Training turns that experience into practical programs for engineers and organizations. Both practices are centered on maintainable systems, current engineering standards and useful outcomes.",
      },
    },
    {
      type: "cards",
      kicker: "Professional identity",
      title: "One practice, two complementary disciplines.",
      muted: true,
      cards: [
        {
          title: "Independent Software Engineering Consultant",
          description:
            "Hands-on delivery across web and mobile applications, frontend architecture, modernization and engineering enablement. The focus is on scalable systems, clear architecture and production-ready implementation.",
          topics: [
            "Frontend Architecture",
            "React",
            "Angular",
            "React Native",
            "Terraform",
            "Azure",
          ],
          actions: [{ href: "/consulting/", label: "Consulting practice →" }],
        },
        {
          title: "Corporate Technology Trainer",
          description:
            "Designs and delivers practical technical upskilling programs for enterprise engineering teams, with curricula spanning modern frontend, backend, mobile and cloud engineering.",
          topics: ["React", "Angular", "Node.js", "TypeScript", "Architecture", "GenAI"],
          actions: [{ href: "/training/", label: "Training practice →" }],
        },
      ],
    },
    {
      type: "topics",
      kicker: "Core expertise",
      title: "What Mohammad Moin is known for",
      intro:
        "Primary areas of practice first, followed by the engineering technologies and architectural disciplines that support them.",
      topics: [
        "Frontend Architecture",
        "Angular",
        "React",
        "React Native",
        "Terraform & Azure",
        "Corporate Technology Training",
        "TypeScript",
        "Node.js",
        "NestJS",
        "Nx Monorepo",
        "Microfrontends",
        "Module Federation",
        "Stack Migration",
        "Curriculum Design",
      ],
    },
    {
      type: "links",
      kicker: "Professional presence",
      title: "Find Mohammad Moin elsewhere",
      intro:
        "The portfolio is the central professional profile. These external profiles provide additional context and corroborate the same professional identity.",
      muted: true,
      links: [
        {
          href: "https://www.linkedin.com/in/mohammadmoin/",
          label: "LinkedIn",
          external: true,
        },
        { href: "https://github.com/mdmoin7", label: "GitHub", external: true },
        { href: "/assets/resume.pdf", label: "Training Profile", external: true },
        {
          href: "/assets/Mohammad Moin-Consultant.pdf",
          label: "Consultant Profile",
          external: true,
        },
      ],
    },
    {
      type: "links",
      kicker: "Explore",
      title: "Mohammad Moin's work",
      links: [
        { href: "/engineering/frontend-architecture/", label: "Frontend Architecture" },
        { href: "/engineering/angular/", label: "Angular" },
        { href: "/engineering/react/", label: "React" },
        { href: "/engineering/react-native/", label: "React Native" },
        { href: "/engineering/terraform/", label: "Terraform & Azure" },
      ],
    },
  ],
  footer: "simple",
};
