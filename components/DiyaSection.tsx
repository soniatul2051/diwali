"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Sparkles, RotateCcw } from "lucide-react";
import Diya, { DiyaProps } from "./Diya";

export interface DiyaItemData {
  id: number;
  label: string;
  sanskritLabel: string;
  variant: DiyaProps["variant"];
  blessing: string;
}

export const DIYA_ITEMS: DiyaItemData[] = [
  {
    id: 1,
    label: "Harmony",
    sanskritLabel: "समन्वय",
    variant: "saffron",
    blessing: "Warmth and unity in every home",
  },
  {
    id: 2,
    label: "Wisdom",
    sanskritLabel: "प्रज्ञा",
    variant: "royal",
    blessing: "Clarity of mind and inner light",
  },
  {
    id: 3,
    label: "Abundance",
    sanskritLabel: "ऐश्वर्य",
    variant: "crimson",
    blessing: "Boundless fortune and auspicious growth",
  },
  {
    id: 4,
    label: "Radiance",
    sanskritLabel: "तेजस",
    variant: "royal",
    blessing: "Courage that outshines the deepest night",
  },
  {
    id: 5,
    label: "Devotion",
    sanskritLabel: "भक्ति",
    variant: "emerald",
    blessing: "Gratitude and sacred serenity",
  },
  {
    id: 6,
    label: "Prosperity",
    sanskritLabel: "लक्ष्मी",
    variant: "amethyst",
    blessing: "Success in every noble endeavor",
  },
  {
    id: 7,
    label: "Serenity",
    sanskritLabel: "शान्ति",
    variant: "saffron",
    blessing: "Peaceful hearts and joyful mornings",
  },
];

interface DiyaSectionProps {
  litIds: number[];
  onToggleDiya: (id: number) => void;
  onLightAllDiyas: () => void;
  onResetDiyas: () => void;
}

export default function DiyaSection({
  litIds,
  onToggleDiya,
  onLightAllDiyas,
  onResetDiyas,
}: DiyaSectionProps) {
  const allLit = litIds.length === DIYA_ITEMS.length;

  return (
    <section
      id="diyas"
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-24 px-4 sm:px-8 overflow-hidden"
    >
      {/* Ambient Background Glow that intensifies as more diyas are lit */}
      <div
        style={{
          opacity: 0.25 + (litIds.length / DIYA_ITEMS.length) * 0.75,
        }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.18)_0%,rgba(15,6,28,0.92)_65%,#05020a_100%)] transition-opacity duration-1000 -z-20"
      />

      {/* Decorative Golden Arch / Mandapa Border */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/15 border border-amber-400/35 text-amber-300 text-xs uppercase tracking-[0.25em] mb-3"
        >
          <Flame className="w-3.5 h-3.5 text-amber-400" />
          <span>Sacred Illumination • {litIds.length} of {DIYA_ITEMS.length} Lit</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-bold font-serif text-center bg-gradient-to-r from-amber-100 via-yellow-300 to-orange-400 bg-clip-text text-transparent"
        >
          Sacred Clay Diyas of Blessing
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-3 max-w-2xl text-center text-sm sm:text-base text-amber-100/75"
        >
          Each handcrafted terracotta diya carries an ancient Diwali blessing.
          Click individual diyas to awaken their flame or illuminate the entire
          mandapa in a golden cascade.
        </motion.p>

        {/* Action Buttons: LIGHT ALL DIYAS + Reset */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 35px rgba(245, 158, 11, 0.7)",
            }}
            whileTap={{ scale: 0.96 }}
            onClick={onLightAllDiyas}
            className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm sm:text-base tracking-wider text-slate-950 bg-gradient-to-r from-amber-300 via-yellow-400 to-orange-500 border border-amber-100 shadow-[0_0_25px_rgba(245,158,11,0.5)] cursor-pointer overflow-hidden"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            <Flame className="w-5 h-5 text-orange-950 fill-orange-950" />
            <span>LIGHT ALL DIYAS</span>
          </motion.button>

          {litIds.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onResetDiyas}
              className="inline-flex items-center gap-2 px-5 py-4 rounded-full text-xs sm:text-sm font-medium text-amber-200/85 bg-white/5 border border-amber-400/30 hover:border-amber-400/60 hover:text-amber-100 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Extinguish &amp; Relight</span>
            </motion.button>
          )}
        </motion.div>

        {/* 7 Traditional Clay Diyas Grid / Crescent Arrangement */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-6 sm:gap-8 w-full justify-items-center items-end">
          {DIYA_ITEMS.map((item, idx) => {
            const isLit = litIds.includes(item.id);
            // Subtle crescent elevation on large screens
            const arcOffset =
              idx === 3
                ? "lg:-translate-y-6"
                : idx === 2 || idx === 4
                ? "lg:-translate-y-3"
                : idx === 1 || idx === 5
                ? "lg:-translate-y-1"
                : "";

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`flex flex-col items-center p-4 rounded-3xl transition-all duration-500 border ${arcOffset} ${
                  isLit
                    ? "bg-gradient-to-b from-amber-500/15 via-orange-950/25 to-transparent border-amber-400/45 shadow-[0_0_35px_rgba(245,158,11,0.2)]"
                    : "bg-white/[0.02] border-white/10 hover:border-amber-500/30"
                }`}
              >
                <Diya
                  id={item.id}
                  isLit={isLit}
                  onToggle={onToggleDiya}
                  label={item.label}
                  sanskritLabel={item.sanskritLabel}
                  variant={item.variant}
                  size="md"
                />
                <p className="mt-2 text-[11px] text-center text-amber-100/60 max-w-[140px] leading-snug">
                  {item.blessing}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* All Diyas Lit Banner */}
        <AnimatePresence>
          {allLit && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="mt-12 flex flex-col sm:flex-row items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/25 to-amber-500/20 border border-amber-300/60 shadow-[0_0_40px_rgba(245,158,11,0.35)] text-center"
            >
              <Sparkles className="w-6 h-6 text-amber-300 shrink-0 animate-spin" />
              <span className="text-sm sm:text-lg font-serif font-semibold text-amber-100">
                All Seven Sacred Diyas are Illuminated! Darkness yields to the
                eternal radiance of Diwali. 🪔
              </span>
              <Sparkles className="w-6 h-6 text-amber-300 shrink-0 animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
