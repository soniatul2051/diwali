"use client";

import React, { useState, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Firecracker from "@/components/Firecracker";
import DiyaSection, { DIYA_ITEMS } from "@/components/DiyaSection";
import FireworksCanvas from "@/components/FireworksCanvas";
import Rangoli from "@/components/Rangoli";
import Wishes from "@/components/Wishes";
import MusicToggle from "@/components/MusicToggle";
import Footer from "@/components/Footer";
import { soundEngine } from "@/lib/sound";

export default function DiwaliCelebrationPage() {
  const [litDiyaIds, setLitDiyaIds] = useState<number[]>([]);
  const staggerTimeoutsRef = useRef<number[]>([]);

  const clearStaggerTimeouts = () => {
    staggerTimeoutsRef.current.forEach((t) => clearTimeout(t));
    staggerTimeoutsRef.current = [];
  };

  const handleToggleDiya = useCallback((id: number) => {
    soundEngine.enableSoundOnInteraction();
    setLitDiyaIds((prev) => {
      const exists = prev.includes(id);
      if (!exists) {
        soundEngine.playDiyaChime(id - 3);
        return [...prev, id];
      } else {
        return prev.filter((item) => item !== id);
      }
    });
  }, []);

  const handleLightAllDiyas = useCallback(() => {
    soundEngine.enableSoundOnInteraction();
    clearStaggerTimeouts();

    DIYA_ITEMS.forEach((diya, index) => {
      const timeoutId = window.setTimeout(() => {
        setLitDiyaIds((prev) => {
          if (prev.includes(diya.id)) return prev;
          return [...prev, diya.id];
        });
        soundEngine.playDiyaChime(index - 2);
      }, index * 150);
      staggerTimeoutsRef.current.push(timeoutId);
    });
  }, []);

  const handleResetDiyas = useCallback(() => {
    clearStaggerTimeouts();
    setLitDiyaIds([]);
  }, []);

  const allDiyasLit = litDiyaIds.length === DIYA_ITEMS.length;

  return (
    <main className="relative min-h-screen w-full bg-[#05020a] text-amber-50 selection:bg-amber-500 selection:text-slate-950 overflow-x-hidden">
      {/* Floating Minimal Navbar */}
      <Navbar
        litDiyasCount={litDiyaIds.length}
        totalDiyas={DIYA_ITEMS.length}
      />

      {/* 1. Full-Screen Magical Diwali Hero */}
      <Hero allDiyasLit={allDiyasLit} />

      {/* 2. Interactive Firecracker – Main Attraction */}
      <Firecracker
        onExplosionComplete={handleLightAllDiyas}
        allDiyasLit={allDiyasLit}
      />

      {/* 3. Interactive Clay Diyas Section */}
      <DiyaSection
        litIds={litDiyaIds}
        onToggleDiya={handleToggleDiya}
        onLightAllDiyas={handleLightAllDiyas}
        onResetDiyas={handleResetDiyas}
      />

      {/* 4. Interactive Night Sky Fireworks Playground */}
      <FireworksCanvas />

      {/* 5. Animated Sacred Geometric Rangoli */}
      <Rangoli />

      {/* 6. Animated Diwali Wishes & Blessings Cards */}
      <Wishes />

      {/* 7. Festive Footer */}
      <Footer />

      {/* Floating Music & Sound Effects Toggle */}
      <MusicToggle variant="floating" />
    </main>
  );
}
