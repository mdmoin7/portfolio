"use client";

import { useCallback, useState } from "react";
import { IntroGate3D } from "@/components/hero/IntroGate3D";
import { HeroSection } from "@/components/hero/HeroSection";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AboutSection } from "@/components/sections/AboutSection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { PillarsSection } from "@/components/sections/PillarsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { WhatIDoSection } from "@/components/sections/WhatIDoSection";

export default function HomePage() {
  const [entered, setEntered] = useState(false);
  const onEnter = useCallback(() => setEntered(true), []);

  return (
    <>
      {!entered ? <IntroGate3D onEnter={onEnter} /> : null}
      <Navbar />
      <main>
        <HeroSection play={entered} />
        <WhatIDoSection />
        <ProjectsSection />
        <PillarsSection />
        <ExperienceSection />
        <AboutSection />
        <ClientsSection />
      </main>
      <Footer />
    </>
  );
}
