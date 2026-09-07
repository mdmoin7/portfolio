import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SubpageAction, SubpageTopic } from "@/lib/subpages/types";

export function TopicPills({
  topics,
  className,
}: {
  topics: SubpageTopic[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {topics.map((topic) => {
        const label = typeof topic === "string" ? topic : topic.label;
        const href = typeof topic === "string" ? undefined : topic.href;
        const external = typeof topic === "string" ? false : topic.external;

        if (href) {
          return (
            <Link
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="subpage-topic subpage-topic-link"
            >
              {label}
            </Link>
          );
        }

        return (
          <span key={label} className="subpage-topic">
            {label}
          </span>
        );
      })}
    </div>
  );
}

export function SubpageActions({ actions }: { actions: SubpageAction[] }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {actions.map((action) => (
        <a
          key={action.label}
          href={action.href}
          target={action.external ? "_blank" : undefined}
          rel={action.external ? "noopener noreferrer" : undefined}
          className={cn(
            "inline-flex items-center rounded-lg px-3.5 py-2.5 text-xs font-extrabold no-underline transition-colors",
            action.primary
              ? "border border-blue/30 bg-blue text-white hover:bg-blue-deep"
              : "border border-line bg-white text-navy hover:border-blue/30 hover:bg-blue-soft",
          )}
        >
          {action.label}
        </a>
      ))}
    </div>
  );
}

export function SubpageCallout({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="subpage-callout">
      <strong className="block font-display text-base font-semibold text-navy">{title}</strong>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">{body}</p>
    </div>
  );
}
