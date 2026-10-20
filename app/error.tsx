"use client";

import "./system-fallback.css";

/* Error boundary for route-level crashes. `reset` re-renders the failed
   segment, which resolves transient errors without a full reload. */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mo-fallback">
      <section className="mo-fallback-card" aria-labelledby="fb-error-title">
        <p className="mo-fallback-slug">
          MOIN.OS <i>{"///"}</i> SIGNAL LOST
        </p>
        <p className="mo-fallback-code" aria-hidden="true">
          <em>!</em>
        </p>
        <h1 id="fb-error-title">Something went wrong mid-orbit.</h1>
        <p>
          The system hit an unexpected fault rendering this page. Retrying
          usually clears it; if it persists, reach Mohammad directly.
        </p>
        <div className="mo-fallback-actions">
          <button
            type="button"
            className="mo-fallback-btn mo-fallback-btn--solid"
            onClick={reset}
          >
            Retry transmission <span aria-hidden="true">→</span>
          </button>
          <a
            className="mo-fallback-btn mo-fallback-btn--ghost"
            href="mailto:mohammadmoin.tech@gmail.com"
          >
            Email Mohammad <span aria-hidden="true">→</span>
          </a>
        </div>
        {error?.digest ? (
          <div className="mo-fallback-foot">
            <span>FAULT DIGEST · {error.digest}</span>
          </div>
        ) : null}
      </section>
    </main>
  );
}
