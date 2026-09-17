export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://mohammadmoin.vercel.app";

export const PROFILE_IMAGE =
  "https://cdn.jsdelivr.net/gh/mdmoin7/portfolio@b4e402c3adbefe8714c71c5917299d758f86ee9a/assets/profile.webp";

export const siteMetadata = {
  title:
    "Mohammad Moin | Independent Software Engineering Consultant & Corporate Technology Trainer",
  description:
    "Mohammad Moin is an independent software engineering consultant and corporate technology trainer in Bengaluru, India. He helps organizations turn technology into capability through frontend architecture, enterprise engineering, practical training, and AI/RAG systems.",
  keywords: [
    "Mohammad Moin",
    "Mohammad Moin software engineer",
    "Mohammad Moin consultant",
    "software engineering consultant Bengaluru",
    "independent software engineering consultant",
    "corporate technology trainer",
    "frontend architecture consultant",
    "React consultant",
    "Angular consultant",
    "React Native consultant",
    "TypeScript consultant",
    "Node.js consultant",
    "Azure Terraform consultant",
    "AI RAG consultant",
    "RAG systems",
    "enterprise application architecture",
  ],
};

const personId = `${SITE_URL}/#person`;

export const personSchema = {
  "@type": "Person",
  "@id": personId,
  name: "Mohammad Moin",
  alternateName: "Moin",
  url: SITE_URL,
  image: PROFILE_IMAGE,
  email: "mailto:mohammad.nicoll@gmail.com",
  sameAs: [
    "https://github.com/mdmoin7",
    "https://www.linkedin.com/in/mohammadmoin/",
  ],
  jobTitle: "Independent Software Engineering Consultant & Corporate Technology Trainer",
  description:
    "Mohammad Moin is an independent software engineering consultant and corporate technology trainer who combines production engineering, enterprise application architecture, practical engineering training, and AI/RAG systems.",
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
    "TypeScript",
    "JavaScript",
    "Node.js",
    "NestJS",
    "Next.js",
    "Nx Monorepo",
    "Micro Frontends",
    "Module Federation",
    "Microsoft Azure",
    "Terraform",
    "Microsoft Entra ID",
    "Dataverse",
    "Enterprise Application Architecture",
    "Artificial Intelligence",
    "Large Language Models",
    "Retrieval-Augmented Generation",
    "RAG Systems",
    "Vector Search",
    "Corporate Technology Training",
    "Engineering Enablement",
    "Curriculum Design",
  ],
};

export const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/about/#profile`,
  url: `${SITE_URL}/about/`,
  name: "About Mohammad Moin",
  description:
    "Professional profile of Mohammad Moin, an independent software engineering consultant and corporate technology trainer.",
  mainEntity: { "@id": personId },
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Mohammad Moin",
  description: siteMetadata.description,
  publisher: { "@id": personId },
};

export function getJsonLd() {
  return [
    { "@context": "https://schema.org", ...personSchema },
    profilePageSchema,
    { "@context": "https://schema.org", ...websiteSchema },
  ];
}
