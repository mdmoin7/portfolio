import Link from "next/link";

export function SubpageSimpleFooter({ note }: { note?: string }) {
  return (
    <footer className="border-t border-line bg-white py-5">
      <div className="wrap flex flex-col gap-2 text-[11px] font-bold text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 Mohammad Moin</span>
        {note ? <span className="text-center sm:flex-1">{note}</span> : <span className="hidden sm:block sm:flex-1" />}
        <span className="text-center sm:text-right">
          <Link href="/" className="text-muted no-underline transition hover:text-blue">
            Portfolio
          </Link>
          {" · "}
          <a
            href="https://www.linkedin.com/in/mohammadmoin/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted no-underline transition hover:text-blue"
          >
            LinkedIn
          </a>
        </span>
      </div>
    </footer>
  );
}
