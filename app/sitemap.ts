import type { MetadataRoute } from "next";
import { getPublicSitePaths, sitePath } from "@/lib/site-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return getPublicSitePaths().map((path, index) => ({
    url: sitePath(path),
    lastModified,
    changeFrequency: "monthly",
    priority: index === 0 ? 1 : path.startsWith("engineering/") ? 0.7 : 0.8,
  }));
}
