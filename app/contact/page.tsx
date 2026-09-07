import { ContactCard } from "@/components/subpage/ContactCard";
import { PROFILE_IMAGE, SITE_URL } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connect with Mohammad Moin — Digital Professional Card",
  description:
    "Connect with Mohammad Moin and save his professional details, portfolio, LinkedIn and GitHub from a digital professional card.",
  authors: [{ name: "Mohammad Moin" }],
  alternates: { canonical: `${SITE_URL}/contact/` },
  openGraph: {
    type: "profile",
    title: "Connect with Mohammad Moin — Digital Professional Card",
    description:
      "Connect with Mohammad Moin and save his professional details, portfolio, LinkedIn and GitHub.",
    url: `${SITE_URL}/contact/`,
    siteName: "Mohammad Moin",
    images: [{ url: PROFILE_IMAGE, width: 164, height: 164, alt: "Mohammad Moin" }],
  },
};

export default function ContactPage() {
  return <ContactCard />;
}
