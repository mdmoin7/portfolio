"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const DeferredCanvas = dynamic(
  () => import("@/components/reimagine/ThreeDSystem").then((module) => module.ThreeDSystem),
  { ssr: false, loading: () => <div className="three-d-system-placeholder" aria-hidden="true" /> },
);

export function DeferredThreeDSystem() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const enable = () => {
      if (!cancelled) setEnabled(true);
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(enable, { timeout: 1200 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(id);
      };
    }

    const id = window.setTimeout(enable, 650);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, []);

  return enabled ? <DeferredCanvas /> : <div className="three-d-system-placeholder" aria-hidden="true" />;
}
