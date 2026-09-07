import { Footer } from "@/components/layout/Footer";
import type { SubpageContent } from "@/lib/subpages/types";
import { SubpageHero } from "./SubpageHero";
import { SubpageNav } from "./SubpageNav";
import { SubpageSections } from "./SubpageSections";
import { SubpageSimpleFooter } from "./SubpageSimpleFooter";

export function SubpageView({ page }: { page: SubpageContent }) {
  return (
    <>
      <SubpageNav active={page.navActive} />
      <SubpageHero hero={page.hero} />
      <SubpageSections sections={page.sections} />
      {page.footer === "rich" ? <Footer /> : null}
      {page.footer === "simple" ? <SubpageSimpleFooter note={page.footerNote} /> : null}
    </>
  );
}
