import fs from "node:fs";
import path from "node:path";

type KnowledgeSection = {
  id: string;
  title: string;
  content: string;
  url?: string;
};

type AiProfile = {
  name?: string;
  jobTitle?: string;
  description?: string;
  knowsAbout?: string[];
  address?: { addressLocality?: string; addressCountry?: string };
};

const PUBLIC_DIR = path.join(process.cwd(), "public");

function readJsonProfile(): AiProfile {
  try {
    return JSON.parse(
      fs.readFileSync(path.join(PUBLIC_DIR, "ai-profile.json"), "utf8"),
    ) as AiProfile;
  } catch {
    return {};
  }
}

function readLlms(): string {
  return fs.readFileSync(path.join(PUBLIC_DIR, "llms.txt"), "utf8");
}

function parseLlmsSections(markdown: string): KnowledgeSection[] {
  const lines = markdown.split(/\r?\n/);
  const sections: KnowledgeSection[] = [];
  let current: { title: string; lines: string[] } | null = null;

  for (const line of lines) {
    const heading = line.match(/^##\s+(.+)$/);
    if (heading) {
      if (current) sections.push(toSection(current));
      current = { title: heading[1].trim(), lines: [] };
      continue;
    }
    if (current) current.lines.push(line);
  }

  if (current) sections.push(toSection(current));
  return sections;
}

function toSection(section: { title: string; lines: string[] }): KnowledgeSection {
  const content = section.lines.join("\n").trim();
  const firstUrl = content.match(/https?:\/\/[^)\s]+/);
  const id = section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return {
    id,
    title: section.title,
    content,
    ...(firstUrl ? { url: firstUrl[0] } : {}),
  };
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+.#×→-]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

export function getMoinKnowledge() {
  const profile = readJsonProfile();
  const profileText = [
    profile.name,
    profile.jobTitle,
    profile.description,
    ...(profile.knowsAbout ?? []),
    profile.address?.addressLocality,
    profile.address?.addressCountry,
  ]
    .filter(Boolean)
    .join(". ");

  return {
    profileText,
    sections: parseLlmsSections(readLlms()),
  };
}

export function searchMoinKnowledge(query: string, limit = 5) {
  const { profileText, sections } = getMoinKnowledge();
  const tokens = tokenize(query);
  const queryText = query.toLowerCase();

  const scored = sections
    .map((section) => {
      const haystack = tokenize(
        [section.title, section.content, profileText].join(" "),
      );
      const haystackSet = new Set(haystack);
      let score = 0;

      for (const token of tokens) {
        if (haystackSet.has(token)) score += 2;
        else if (haystack.some((value) => value.includes(token))) score += 1;
      }

      if (/who|what does/.test(queryText) && /identity|primary pages/i.test(section.title)) {
        score += 8;
      }

      if (/training|trainer|learn|course|upskill/.test(queryText) && /training/i.test(section.title)) {
        score += 10;
      }

      if (/react|frontend|angular|mobile|typescript|node|azure|terraform|entra|dataverse|ai|rag/.test(queryText) && /engineering|technology/i.test(section.title)) {
        score += 5;
      }

      if (/project|work|aquatrack|income tracker/.test(queryText) && /work/i.test(section.title)) {
        score += 8;
      }

      return { section, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(({ section, score }) => ({
    id: section.id,
    title: section.title,
    content: section.content,
    url: section.url,
    relevance: score,
  }));
}

export function getMoinSourceSummary() {
  const { profileText, sections } = getMoinKnowledge();
  return {
    sourceFiles: ["public/llms.txt", "public/ai-profile.json"],
    profileText,
    sections: sections.map(({ id, title, url }) => ({ id, title, url })),
  };
}
