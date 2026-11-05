"use client";

import React from "react";
import { Flame, ArrowUp, Sparkles } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative w-full border-t border-amber-500/25 bg-[#06020d] py-14 px-4 sm:px-8 overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-28 bg-radial from-amber-500/15 to-transparent blur-2xl" />

      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Emblem */}
        <div className="flex items-center gap-2.5 mb-3">
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.5)]">
            <Flame className="w-5 h-5" />
          </span>
          <span className="text-2xl font-serif font-bold bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
            ✨ शुभ दीपावली ✨
          </span>
        </div>

        <p className="max-w-md text-xs sm:text-sm text-amber-100/65 leading-relaxed">
          May the divine light of Diwali spread peace, prosperity, happiness,
          and good health in your life.
        </p>

        {/* Quick Links */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-amber-200/70">
          <a href="#home" className="hover:text-amber-300 transition-colors">
            Home
          </a>
          <a
            href="#celebration"
            className="hover:text-amber-300 transition-colors"
          >
            Celebration
          </a>
          <a href="#diyas" className="hover:text-amber-300 transition-colors">
            Sacred Diyas
          </a>
          <a
            href="#fireworks"
            className="hover:text-amber-300 transition-colors"
          >
            Fireworks
          </a>
          <a href="#rangoli" className="hover:text-amber-300 transition-colors">
            Rangoli
          </a>
          <a href="#wishes" className="hover:text-amber-300 transition-colors">
            Wishes
          </a>
        </div>

        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className="mt-8 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-400/30 text-xs font-medium text-amber-200 hover:bg-amber-500/20 transition-all cursor-pointer"
        >
          <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
          <span>Back to Starlit Sky</span>
        </button>

        <div className="mt-8 pt-6 border-t border-white/10 w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-amber-200/45">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Crafted with light, motion &amp; festive joy
          </span>
          <span>ॐ असतो मा सद्गमय । तमसो मा ज्योतिर्गमय ॥</span>
        </div>
      </div>
    </footer>
  );
}
