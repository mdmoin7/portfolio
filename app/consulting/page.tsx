import { SubpageView } from "@/components/subpage/SubpageView";
import { consultingPage } from "@/lib/subpages/consulting";
import { buildSubpageMetadata } from "@/lib/subpages/metadata";

export const metadata = buildSubpageMetadata(consultingPage);

export default function ConsultingPage() {
  return <SubpageView page={consultingPage} />;
}
