import { getAllEngineeringSlugs } from "@/lib/subpages/engineering";
import { SITE_URL } from "@/lib/seo";

/** Build a canonical URL with trailing slash (matches vercel.json). */
export function sitePath(path = ""): string {
  if (!path) return `${SITE_URL}/`;
  return `${SITE_URL}/${path.replace(/^\/|\/$/g, "")}/`;
}

export function getPublicSitePaths(): string[] {
  const staticPaths = ["", "about", "training", "consulting", "contact"];
  const engineeringPaths = getAllEngineeringSlugs().map(
    (slug) => `engineering/${slug}`,
  );

  return [...staticPaths, ...engineeringPaths];
}
