import Link from "next/link";
import "./system-fallback.css";

export default function NotFound() {
  return (
    <main className="mo-fallback">
      <section className="mo-fallback-card" aria-labelledby="fb-title">
        <p className="mo-fallback-slug">
          MOIN.OS <i>{"///"}</i> NAVIGATION
        </p>
        <p className="mo-fallback-code" aria-hidden="true">
          4<em>0</em>4
        </p>
        <h1 id="fb-title">This coordinate isn&apos;t on the map.</h1>
        <p>
          The trajectory you followed doesn&apos;t lead anywhere in this
          system. Head back to base and re-plot from there.
        </p>
        <div className="mo-fallback-actions">
          <Link className="mo-fallback-btn mo-fallback-btn--solid" href="/">
            Return to base <span aria-hidden="true">→</span>
          </Link>
          <Link
            className="mo-fallback-btn mo-fallback-btn--ghost"
            href="/#work"
          >
            Case files <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="mo-fallback-foot">
          <span>BUILD · CONSULT · TRAIN</span>
          <span>mohammadmoin.vercel.app</span>
        </div>
      </section>
    </main>
  );
}
