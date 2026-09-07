import type { Metadata } from "next";
import { PROFILE_IMAGE, SITE_URL } from "@/lib/seo";
import type { SubpageContent } from "./types";

export function buildSubpageMetadata(page: SubpageContent): Metadata {
  const url = `${SITE_URL}${page.path}`;

  return {
    title: page.metadata.title,
    description: page.metadata.description,
    authors: [{ name: "Mohammad Moin" }],
    alternates: { canonical: url },
    openGraph: {
      type: page.metadata.ogType ?? "website",
      title: page.metadata.title,
      description: page.metadata.description,
      url,
      siteName: "Mohammad Moin",
      images: [{ url: PROFILE_IMAGE, width: 164, height: 164, alt: "Mohammad Moin" }],
    },
    twitter: {
      card: "summary",
      title: page.metadata.title,
      description: page.metadata.description,
      images: [PROFILE_IMAGE],
    },
  };
}
