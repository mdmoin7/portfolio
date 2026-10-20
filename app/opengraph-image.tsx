import { ImageResponse } from "next/og";

/* Share card for every route that doesn't define its own. Rendered at build
   time with the bundled default font only — no remote font fetch, so the
   build never depends on network availability. Palette and motifs (console
   dark, gold corner ticks, orbital rings) mirror the MOIN.OS hero. */

export const alt = "Mohammad Moin — Independent Software Engineering Consultant & Corporate Technology Trainer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0a0d14";
const TEXT = "#e9edf5";
const MUTED = "#8c97ad";
const SIG = "#7c9cd9";
const GOLD = "#d8b477";
const MONO = "ui-monospace, Menlo, monospace";

function CornerTicks() {
  const tick = (pos: Record<string, string>) => (
    <div
      style={{
        position: "absolute",
        width: 34,
        height: 34,
        border: `3px solid ${GOLD}`,
        ...pos,
      }}
    />
  );
  return (
    <>
      {tick({ top: "34px", left: "34px", borderRight: "0px", borderBottom: "0px" })}
      {tick({ bottom: "34px", right: "34px", borderLeft: "0px", borderTop: "0px" })}
    </>
  );
}

function OrbitalRings() {
  return (
    <>
      <div
        style={{
          position: "absolute",
          right: -140,
          top: -160,
          width: 620,
          height: 620,
          borderRadius: 9999,
          border: `1px solid ${SIG}`,
          opacity: 0.28,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -40,
          top: -60,
          width: 420,
          height: 420,
          borderRadius: 9999,
          border: `1px solid ${GOLD}`,
          opacity: 0.22,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 40,
          width: 220,
          height: 220,
          borderRadius: 9999,
          background: `radial-gradient(circle at 50% 50%, ${SIG} 0%, rgba(124,156,217,0.18) 46%, rgba(10,13,20,0) 62%)`,
          opacity: 0.8,
        }}
      />
    </>
  );
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: BG,
          color: TEXT,
          overflow: "hidden",
        }}
      >
        {/* Ambient light */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 78% 22%, rgba(124,156,217,0.16), rgba(10,13,20,0) 46%)," +
              "radial-gradient(circle at 12% 92%, rgba(216,180,119,0.10), rgba(10,13,20,0) 42%)",
          }}
        />
        <OrbitalRings />
        <CornerTicks />

        {/* Top slug */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: MONO,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 6,
              color: MUTED,
            }}
          >
            MOIN.OS
            <span style={{ color: GOLD }}>{"///"}</span>
            PORTFOLIO
          </div>
          <div
            style={{
              flex: 1,
              height: 1,
              maxWidth: 260,
              background: "rgba(255,255,255,0.16)",
            }}
          />
        </div>

        {/* Name block */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 104,
              fontWeight: 700,
              letterSpacing: -3,
              lineHeight: 1,
            }}
          >
            <span>MOHAMMAD</span>
            <span>MOIN</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 27,
              fontWeight: 600,
              letterSpacing: 2,
              color: SIG,
            }}
          >
            Independent Software Engineering Consultant
            <span style={{ color: GOLD }}>×</span>
            Corporate Technology Trainer
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: MONO,
            fontSize: 21,
            fontWeight: 700,
            letterSpacing: 5,
            color: MUTED,
          }}
        >
          <span>CONSULT · BUILD · TRAIN</span>
          <span>mohammadmoin.vercel.app</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
