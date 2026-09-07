"use client";

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
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <WhatIDoSection />
        <PillarsSection />
        <ProjectsSection />
        <ExperienceSection />
        <ClientsSection />
      </main>
      <Footer />
    </>
  );
}
