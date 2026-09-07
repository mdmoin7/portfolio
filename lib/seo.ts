export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mohammadmoin.vercel.app";

export const PROFILE_IMAGE =
  "https://cdn.jsdelivr.net/gh/mdmoin7/portfolio@b4e402c3adbefe8714c71c5917299d758f86ee9a/assets/profile.webp";

export const siteMetadata = {
  title:
    "Mohammad Moin — Independent Software Engineering Consultant & Corporate Trainer",
  description:
    "Mohammad Moin — Independent Software Engineering Consultant and Corporate Technology Trainer with 14+ years of production engineering. Specializes in frontend architecture, Angular, React, React Native and Terraform/Azure, with corporate training and freelance consulting engagements.",
  keywords: [
    "Mohammad Moin",
    "software engineering consultant",
    "corporate technology trainer",
    "frontend architect",
    "Angular consultant",
    "React consultant",
    "React Native",
    "Terraform Azure",
    "frontend architecture",
  ],
};

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Mohammad Moin",
  url: SITE_URL,
  image: PROFILE_IMAGE,
  sameAs: [
    "https://github.com/mdmoin7",
    "https://www.linkedin.com/in/mohammadmoin/",
  ],
  jobTitle:
    "Independent Software Engineering Consultant & Corporate Technology Trainer",
  description:
    "Mohammad Moin is an independent software engineering consultant and corporate technology trainer based in Bengaluru, India, combining production engineering, frontend architecture and practical enterprise technology training.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressCountry: "IN",
  },
  knowsAbout: [
    "Frontend Architecture",
    "Angular",
    "React",
    "React Native",
    "Terraform",
    "Microsoft Azure",
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
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Mohammad Moin",
  description: siteMetadata.description,
  publisher: { "@id": `${SITE_URL}/#person` },
};

export function getJsonLd() {
  return [personSchema, websiteSchema];
}
