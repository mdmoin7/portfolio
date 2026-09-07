import { SubpageView } from "@/components/subpage/SubpageView";
import { buildSubpageMetadata } from "@/lib/subpages/metadata";
import { trainingPage } from "@/lib/subpages/training";

export const metadata = buildSubpageMetadata(trainingPage);

export default function TrainingPage() {
  return <SubpageView page={trainingPage} />;
}
