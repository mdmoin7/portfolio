import { notFound } from "next/navigation";
import { SubpageView } from "@/components/subpage/SubpageView";
import { getAllEngineeringSlugs, getEngineeringPage } from "@/lib/subpages/engineering";
import { buildSubpageMetadata } from "@/lib/subpages/metadata";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllEngineeringSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = getEngineeringPage(slug);
  if (!page) return {};
  return buildSubpageMetadata(page);
}

export default async function EngineeringPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getEngineeringPage(slug);

  if (!page) {
    notFound();
  }

  return <SubpageView page={page} />;
}
