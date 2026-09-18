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

    const idleWindow = globalThis as typeof globalThis & {
      requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof idleWindow.requestIdleCallback === "function") {
      const idleId = idleWindow.requestIdleCallback(enable, { timeout: 1200 });
      return () => {
        cancelled = true;
        idleWindow.cancelIdleCallback?.(idleId);
      };
    }

    const timeoutId = globalThis.setTimeout(enable, 650);
    return () => {
      cancelled = true;
      globalThis.clearTimeout(timeoutId);
    };
  }, []);

  return enabled ? <DeferredCanvas /> : <div className="three-d-system-placeholder" aria-hidden="true" />;
}
