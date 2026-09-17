export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mohammadmoin.vercel.app";

export const PROFILE_IMAGE =
  "https://cdn.jsdelivr.net/gh/mdmoin7/portfolio@b4e402c3adbefe8714c71c5917299d758f86ee9a/assets/profile.webp";

export const siteMetadata = {
  title:
    "Mohammad Moin | Independent Consultant, Software Engineer & Corporate Technology Trainer",
  description:
    "Mohammad Moin is an independent technology consultant, software engineer and corporate technology trainer who helps organizations turn technology into capability through production engineering, frontend architecture, enterprise applications, AI and RAG systems, and hands-on training.",
  keywords: [
    "Mohammad Moin",
    "Mohammad Moin Bengaluru",
    "independent technology consultant",
    "software engineering consultant",
    "corporate technology trainer",
    "frontend architect",
    "frontend architecture",
    "React consultant",
    "Angular consultant",
    "React Native consultant",
    "TypeScript consultant",
    "Node.js consultant",
    "Azure consultant",
    "Terraform Azure",
    "enterprise application architecture",
    "AI engineer",
    "RAG systems",
    "AI and RAG training",
    "corporate technology training",
  ],
};

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Mohammad Moin",
  alternateName: ["Mohammad Moin", "mdmoin7"],
  url: SITE_URL,
  image: PROFILE_IMAGE,
  email: "mailto:mohammad.nicoll@gmail.com",
  sameAs: [
    "https://github.com/mdmoin7",
    "https://www.linkedin.com/in/mohammadmoin/",
  ],
  jobTitle: "Independent Consultant · Corporate Technology Trainer",
  description:
    "Mohammad Moin is an independent technology consultant, software engineer and corporate technology trainer based in Bengaluru, India. He combines production engineering, frontend architecture, enterprise technology, AI and RAG systems, and practical technology training to help organizations turn technology into capability.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bengaluru",
    addressCountry: "IN",
  },
  knowsAbout: [
    "Software Engineering",
    "Frontend Architecture",
    "React",
    "Angular",
    "React Native",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "NestJS",
    "Next.js",
    "Nx Monorepo",
    "Micro Frontends",
    "Design Systems",
    "Microsoft Azure",
    "Terraform",
    "GitHub Actions",
    "Microsoft Entra ID",
    "MSAL",
    "Dynamics 365",
    "Dataverse",
    "Enterprise Applications",
    "Artificial Intelligence",
    "Large Language Models",
    "Retrieval-Augmented Generation",
    "RAG Systems",
    "Embeddings",
    "Vector Search",
    "AI Workflows",
    "Corporate Technology Training",
    "Curriculum Design",
  ],
};

export const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/#profile`,
  url: SITE_URL,
  name: "Mohammad Moin — Professional Profile",
  mainEntity: { "@id": `${SITE_URL}/#person` },
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Mohammad Moin",
  alternateName: "Mohammad Moin — Independent Consultant & Corporate Technology Trainer",
  description: siteMetadata.description,
  publisher: { "@id": `${SITE_URL}/#person` },
  inLanguage: "en-IN",
};

export function getJsonLd() {
  return [personSchema, profilePageSchema, websiteSchema];
}
