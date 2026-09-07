import type { SubpageNavId } from "./types";

export const subpageNavLinks = [
  { href: "/", label: "Home", id: "home" as const },
  { href: "/about/", label: "About", id: "about" as const },
  { href: "/training/", label: "Training", id: "training" as const },
  { href: "/consulting/", label: "Consulting", id: "consulting" as const },
  { href: "/engineering/frontend-architecture/", label: "Engineering", id: "engineering" as const },
] as const;

export const subpageNavCta = {
  href: "mailto:mohammad.nicoll@gmail.com?subject=Consulting%20or%20Training%20Enquiry",
  label: "Let's talk",
};

export function isNavActive(linkId: SubpageNavId, active: SubpageNavId) {
  if (linkId === active) return true;
  if (linkId === "engineering" && active === "engineering") return true;
  return false;
}
