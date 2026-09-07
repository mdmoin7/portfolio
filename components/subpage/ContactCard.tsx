"use client";

import Link from "next/link";
import { SITE_URL } from "@/lib/seo";

const vcard = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  "N:Moin;Mohammad;;;",
  "FN:Mohammad Moin",
  "TITLE:Full Stack Engineer & Frontend Architect",
  "TEL;TYPE=CELL:+919886145843",
  "EMAIL;TYPE=INTERNET:mohammad.nicoll@gmail.com",
  "NOTE:Corporate Technology Trainer & Consultant",
  `URL:${SITE_URL}/`,
  "URL;type=LinkedIn:https://www.linkedin.com/in/mohammadmoin/",
  "URL;type=GitHub:https://github.com/mdmoin7",
  "END:VCARD",
].join("\r\n");

export function ContactCard() {
  const saveContact = () => {
    const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = "Mohammad-Moin.vcf";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(anchor.href), 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4 md:p-7">
      <main className="contact-card w-full max-w-[720px] overflow-hidden rounded-[22px] border border-line bg-white shadow-[0_18px_55px_rgba(10,22,40,0.08)]">
        <header className="border-b border-line bg-[linear-gradient(135deg,#fbfcfe,#eef4ff)] px-7 py-8 md:px-10 md:py-9">
          <p className="kicker mb-2.5">Connect</p>
          <h1 className="font-display text-[clamp(32px,6vw,42px)] font-semibold leading-[1.1] text-navy">
            Mohammad Moin
          </h1>
          <p className="mt-2 max-w-lg text-base text-muted">
            Full Stack Engineer · Frontend Architect · Corporate Technology Trainer · Consultant
          </p>
        </header>

        <section className="px-7 py-8 md:px-10">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_180px]">
            <div>
              <p className="text-sm leading-relaxed text-muted">
                Save my professional details or connect with me through LinkedIn, GitHub and my
                portfolio.
              </p>
              <div className="mt-5 grid gap-2">
                <a
                  href="mailto:mohammad.nicoll@gmail.com"
                  className="text-sm text-navy no-underline"
                >
                  <span className="mr-4 inline-block w-[65px] text-[11px] font-bold uppercase tracking-[0.06em] text-muted">
                    Email
                  </span>
                  mohammad.nicoll@gmail.com
                </a>
                <a href="tel:+919886145843" className="text-sm text-navy no-underline">
                  <span className="mr-4 inline-block w-[65px] text-[11px] font-bold uppercase tracking-[0.06em] text-muted">
                    Phone
                  </span>
                  +91 98861 45843
                </a>
              </div>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={saveContact}
                  className="inline-flex items-center rounded-lg border border-blue bg-blue px-4 py-2.5 text-[13px] font-bold text-white"
                >
                  ＋ Save My Details
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center rounded-lg border border-line bg-white px-4 py-2.5 text-[13px] font-bold text-navy no-underline"
                >
                  View Portfolio
                </Link>
              </div>
            </div>

            <div className="rounded-[14px] border border-line bg-white p-3 text-center md:justify-self-end">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/contact/contact-qr.svg"
                alt="QR code to open Mohammad Moin's Connect card"
                width={150}
                height={150}
                className="mx-auto block"
              />
              <small className="mt-2 block text-[10px] text-muted">Scan to connect</small>
            </div>
          </div>

          <div className="mt-7 grid gap-2.5 border-t border-line pt-6 sm:grid-cols-3">
            <a
              href="https://www.linkedin.com/in/mohammadmoin/"
              rel="me noopener noreferrer"
              className="rounded-lg border border-line bg-surface px-3 py-3 text-center text-xs font-bold text-navy no-underline"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/mdmoin7"
              rel="me noopener noreferrer"
              className="rounded-lg border border-line bg-surface px-3 py-3 text-center text-xs font-bold text-navy no-underline"
            >
              GitHub
            </a>
            <a
              href="/consulting/"
              className="rounded-lg border border-line bg-surface px-3 py-3 text-center text-xs font-bold text-navy no-underline"
            >
              Consulting
            </a>
          </div>

          <p className="mt-5 text-[11px] leading-relaxed text-muted">
            This QR points to the permanent Connect page, so the details can be updated without
            changing the QR destination.
          </p>
        </section>

        <footer className="px-7 pb-7 text-center text-[11px] text-muted md:px-10">
          Mohammad Moin · mohammadmoin.vercel.app
        </footer>
      </main>
    </div>
  );
}
