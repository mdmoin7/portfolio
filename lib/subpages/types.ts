export type SubpageNavId = "home" | "about" | "training" | "consulting" | "engineering";

export type SubpageAction = {
  href: string;
  label: string;
  primary?: boolean;
  external?: boolean;
};

export type SubpageTopic = string | { label: string; href?: string; external?: boolean };

export type SubpageCard = {
  tag?: string;
  title: string;
  description: string;
  topics?: SubpageTopic[];
  actions?: SubpageAction[];
};

export type SubpageSection =
  | {
      type: "intro";
      kicker: string;
      title: string;
      intro?: string;
      callout?: { title: string; body: string };
      facts?: { strong: string; span: string }[];
      muted?: boolean;
    }
  | {
      type: "cards";
      kicker: string;
      title: string;
      intro?: string;
      cards: SubpageCard[];
      callout?: { title: string; body: string };
      muted?: boolean;
    }
  | {
      type: "topics";
      kicker: string;
      title: string;
      intro?: string;
      topics: SubpageTopic[];
      callout?: { title: string; body: string };
      muted?: boolean;
    }
  | {
      type: "steps";
      kicker: string;
      title: string;
      intro?: string;
      steps: { number: string; title: string; body: string }[];
      muted?: boolean;
    }
  | {
      type: "decisions";
      kicker: string;
      title: string;
      intro?: string;
      items: { title: string; body: string }[];
      muted?: boolean;
    }
  | {
      type: "flow";
      kicker: string;
      title: string;
      items: { title: string; subtitle: string }[];
      topics?: SubpageTopic[];
      muted?: boolean;
    }
  | {
      type: "links";
      kicker: string;
      title: string;
      intro?: string;
      links: SubpageAction[];
      muted?: boolean;
    }
  | {
      type: "related";
      kicker: string;
      title: string;
      links: { href: string; label: string }[];
      muted?: boolean;
    }
  | {
      type: "cta";
      kicker: string;
      title: string;
      intro?: string;
      actions: SubpageAction[];
    };

export type SubpageContent = {
  path: string;
  metadata: {
    title: string;
    description: string;
    ogType?: "website" | "article" | "profile";
  };
  navActive: SubpageNavId;
  hero: {
    eyebrow: string;
    title: string;
    lede: string;
    actions?: SubpageAction[];
  };
  sections: SubpageSection[];
  footer: "rich" | "simple" | "none";
  footerNote?: string;
};

export type EngineeringSlug =
  | "react"
  | "angular"
  | "react-native"
  | "frontend-architecture"
  | "terraform";
