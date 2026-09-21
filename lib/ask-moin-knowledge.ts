export type KnowledgeChunk = {
  id: string;
  title: string;
  topics: string[];
  content: string;
  url?: string;
};

export const MOIN_KNOWLEDGE: KnowledgeChunk[] = [
  {
    id: "identity",
    title: "Identity and positioning",
    topics: ["who", "identity", "role", "about", "moin", "mohammad"],
    content:
      "Mohammad Moin is an Independent Software Engineering Consultant & Corporate Technology Trainer based in Bengaluru, India. His positioning is Engineering × People × AI. His core statement is Build People. Solve Problems. Innovate. His professional practice connects consulting, software engineering, architecture, AI/RAG solutions, and corporate technology training.",
    url: "https://mohammadmoin.vercel.app/",
  },
  {
    id: "engineering",
    title: "Engineering practice",
    topics: ["engineering", "consulting", "development", "architecture", "frontend", "full stack"],
    content:
      "Mohammad works across production software engineering, frontend architecture, enterprise application architecture, modernization, identity-aware applications, and AI-enabled systems. His approach connects PEOPLE → PROBLEM → DESIGN → BUILD → IMPACT.",
    url: "https://mohammadmoin.vercel.app/consulting/",
  },
  {
    id: "react",
    title: "React engineering",
    topics: ["react", "typescript", "vite", "state", "testing", "frontend"],
    content:
      "React expertise represented on the portfolio includes application architecture, TypeScript, state management, performance, testing, Vite, and scalable enterprise application development.",
    url: "https://mohammadmoin.vercel.app/engineering/react/",
  },
  {
    id: "angular",
    title: "Angular engineering",
    topics: ["angular", "signals", "rxjs", "standalone", "testing", "frontend"],
    content:
      "Angular expertise represented on the portfolio includes application architecture, standalone components, signals, RxJS, performance, testing, and enterprise delivery.",
    url: "https://mohammadmoin.vercel.app/engineering/angular/",
  },
  {
    id: "mobile",
    title: "React Native engineering",
    topics: ["react native", "mobile", "expo", "native", "performance"],
    content:
      "React Native work includes cross-platform mobile architecture, Expo, native integration, debugging, performance, and production delivery.",
    url: "https://mohammadmoin.vercel.app/engineering/react-native/",
  },
  {
    id: "architecture",
    title: "Frontend architecture",
    topics: ["architecture", "nx", "monorepo", "microfrontend", "module federation", "design system"],
    content:
      "Frontend architecture work covers application boundaries, component architecture, state and data flow, Nx monorepos, microfrontends, Module Federation, design systems, performance, testing, and delivery practices.",
    url: "https://mohammadmoin.vercel.app/engineering/frontend-architecture/",
  },
  {
    id: "cloud",
    title: "Azure and Terraform",
    topics: ["azure", "terraform", "infrastructure", "iac", "github actions", "cicd"],
    content:
      "Terraform and Azure engineering includes Infrastructure as Code, reusable modules, state management, Azure infrastructure, CI/CD, GitHub Actions, and infrastructure security.",
    url: "https://mohammadmoin.vercel.app/engineering/terraform/",
  },
  {
    id: "microsoft",
    title: "Microsoft enterprise stack",
    topics: ["entra", "entra id", "msal", "dataverse", "dynamics", "microsoft"],
    content:
      "The Microsoft ecosystem represented on the portfolio includes Microsoft Entra ID, MSAL, Dynamics 365, and Dataverse. Enterprise React work includes identity-aware interfaces using React, Entra ID, MSAL, and Dataverse.",
    url: "https://mohammadmoin.vercel.app/engineering/react/",
  },
  {
    id: "ai",
    title: "AI and RAG",
    topics: ["ai", "artificial intelligence", "llm", "genai", "rag", "embeddings", "vector search"],
    content:
      "AI capabilities represented on the portfolio include LLM applications, retrieval-augmented generation (RAG), embeddings, vector search, and AI workflows. AI/RAG solutions are part of the broader engineering and consulting practice.",
    url: "https://mohammadmoin.vercel.app/consulting/",
  },
  {
    id: "training",
    title: "Corporate technology training",
    topics: ["training", "trainer", "corporate", "learning", "upskilling", "curriculum"],
    content:
      "Mohammad provides hands-on corporate technology training designed around production scenarios and capability development rather than syntax-only instruction. The training model is ASSESS → FOUNDATION → APPLIED → PRODUCTION → OWNERSHIP. Topics include React, Angular, React Native, TypeScript, enterprise frontend architecture, AI/GenAI, and Terraform/Azure.",
    url: "https://mohammadmoin.vercel.app/training/",
  },
  {
    id: "credibility",
    title: "Training and production experience",
    topics: ["15k", "15000", "350", "14 years", "experience", "sessions"],
    content:
      "The portfolio states: 15K+ engineers trained, 350+ sessions delivered, and 14+ years in production. These figures should be reported exactly and not extrapolated.",
    url: "https://mohammadmoin.vercel.app/training/",
  },
  {
    id: "aquatrack",
    title: "AquaTrack",
    topics: ["aquatrack", "water", "consumption", "billing", "expenses", "analytics"],
    content:
      "AquaTrack is a water-consumption system covering water readings, analytics, billing, expenses, reporting, and alerts.",
    url: "https://mohammadmoin.vercel.app/",
  },
  {
    id: "income",
    title: "Income Tracker",
    topics: ["income tracker", "authentication", "token", "ttl", "refresh", "persistence"],
    content:
      "Income Tracker is represented as a system involving authentication, token lifecycle, TTL, refresh, and data persistence.",
    url: "https://mohammadmoin.vercel.app/",
  },
  {
    id: "contact",
    title: "Working with Mohammad",
    topics: ["work", "hire", "contact", "engage", "consulting", "training"],
    content:
      "Visitors can engage Mohammad through the site's consulting, engineering/architecture, AI/RAG, and corporate training areas. The portfolio provides a Contact page for professional conversations. Do not invent pricing, availability, contracts, or guarantees.",
    url: "https://mohammadmoin.vercel.app/contact/",
  },
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+.#×→]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function searchMoinKnowledge(query: string, limit = 5) {
  const queryTokens = new Set(normalize(query));
  const queryText = query.toLowerCase();
  const scored = MOIN_KNOWLEDGE.map((chunk) => {
    const haystack = normalize(
      [chunk.title, chunk.topics.join(" "), chunk.content].join(" "),
    );
    let score = 0;
    for (const token of queryTokens) {
      if (chunk.topics.some((topic) => topic.toLowerCase().includes(token))) score += 6;
      if (haystack.includes(token)) score += 1;
    }
    for (const phrase of chunk.topics) {
      if (queryText.includes(phrase.toLowerCase())) score += 8;
    }
    return { chunk, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ chunk, score }) => ({
    id: chunk.id,
    title: chunk.title,
    content: chunk.content,
    url: chunk.url,
    relevance: score,
  }));
}
