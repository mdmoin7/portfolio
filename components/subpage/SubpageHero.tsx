import { MagneticButton } from "@/components/motion/MagneticButton";
import { FadeIn } from "@/components/ui/primitives";
import type { SubpageContent } from "@/lib/subpages/types";

export function SubpageHero({ hero }: { hero: SubpageContent["hero"] }) {
  return (
    <header className="subpage-hero relative overflow-hidden border-b border-line">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-[430px] w-[430px] rounded-full border border-blue/10 shadow-[0_0_0_35px_rgba(36,84,216,0.025),0_0_0_72px_rgba(36,84,216,0.015)]"
      />
      <div className="wrap relative py-14 md:py-16">
        <FadeIn>
          <div className="max-w-[1000px]">
            <div className="subpage-eyebrow">{hero.eyebrow}</div>
            <h1 className="mt-4 font-display text-[clamp(36px,5vw,62px)] font-semibold leading-[1.06] tracking-[-0.035em] text-navy">
              {hero.title}
            </h1>
            <p className="mt-4 max-w-[800px] text-[15px] leading-relaxed text-muted">{hero.lede}</p>
            {hero.actions?.length ? (
              <div className="mt-6 flex flex-wrap gap-2.5">
                {hero.actions.map((action) => (
                  <MagneticButton
                    key={action.label}
                    href={action.href}
                    external={action.external}
                    variant={action.primary ? "primary" : "outline"}
                    className="px-3.5 py-2.5 text-xs"
                  >
                    {action.label}
                  </MagneticButton>
                ))}
              </div>
            ) : null}
          </div>
        </FadeIn>
      </div>
    </header>
  );
}
