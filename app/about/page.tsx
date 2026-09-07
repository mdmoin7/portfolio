import { SubpageView } from "@/components/subpage/SubpageView";
import { aboutPage } from "@/lib/subpages/about";
import { buildSubpageMetadata } from "@/lib/subpages/metadata";

export const metadata = buildSubpageMetadata(aboutPage);

export default function AboutPage() {
  return <SubpageView page={aboutPage} />;
}
