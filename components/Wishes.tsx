"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Sun,
  Coins,
  Feather,
  Trophy,
  Heart,
  Check,
  Copy,
} from "lucide-react";
import { soundEngine } from "@/lib/sound";

interface WishCardData {
  id: string;
  title: string;
  sanskrit: string;
  subtitle: string;
  message: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  borderGlow: string;
  accentText: string;
  hoverEffect: "float" | "shimmer" | "pulse" | "tilt" | "heartbeat";
}

const WISH_CARDS: WishCardData[] = [
  {
    id: "happiness",
    title: "Happiness",
    sanskrit: "आनंद • Ananda",
    subtitle: "Radiant Joy & Laughter",
    message:
      "May your home echo with the laughter of loved ones and every moment shimmer with pure, Golden Diwali joy.",
    icon: Sun,
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    borderGlow: "hover:border-amber-400 hover:shadow-[0_0_40px_rgba(245,158,11,0.4)]",
    accentText: "text-amber-300",
    hoverEffect: "float",
  },
  {
    id: "prosperity",
    title: "Prosperity",
    sanskrit: "समृद्धि • Samriddhi",
    subtitle: "Abundance & Good Fortune",
    message:
      "May Goddess Lakshmi bless your household with overflowing wealth, auspicious beginnings, and golden opportunities.",
    icon: Coins,
    gradient: "from-yellow-500/20 via-amber-600/10 to-transparent",
    borderGlow: "hover:border-yellow-300 hover:shadow-[0_0_40px_rgba(253,224,71,0.4)]",
    accentText: "text-yellow-300",
    hoverEffect: "shimmer",
  },
  {
    id: "peace",
    title: "Peace",
    sanskrit: "शान्ति • Shanti",
    subtitle: "Serenity & Inner Light",
    message:
      "Like a tranquil diya flame in a quiet sanctuary, may calm and spiritual harmony illuminate your heart.",
    icon: Feather,
    gradient: "from-sky-500/20 via-indigo-500/10 to-transparent",
    borderGlow: "hover:border-sky-400 hover:shadow-[0_0_40px_rgba(56,189,248,0.4)]",
    accentText: "text-sky-300",
    hoverEffect: "pulse",
  },
  {
    id: "success",
    title: "Success",
    sanskrit: "सफलता • Saphalata",
    subtitle: "Triumph & New Horizons",
    message:
      "May Lord Ganesha remove every obstacle from your path and crown your endeavors with extraordinary victory.",
    icon: Trophy,
    gradient: "from-orange-500/20 via-red-500/10 to-transparent",
    borderGlow: "hover:border-orange-400 hover:shadow-[0_0_40px_rgba(249,115,22,0.45)]",
    accentText: "text-orange-300",
    hoverEffect: "tilt",
  },
  {
    id: "love",
    title: "Love",
    sanskrit: "प्रेम • Prema",
    subtitle: "Warmth & Togetherness",
    message:
      "May the sweetness of festive mithai and the warmth of deep affection bind your family closer than ever.",
    icon: Heart,
    gradient: "from-rose-500/20 via-pink-600/10 to-transparent",
    borderGlow: "hover:border-rose-400 hover:shadow-[0_0_40px_rgba(244,63,94,0.45)]",
    accentText: "text-rose-300",
    hoverEffect: "heartbeat",
  },
];

export default function Wishes() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyWish = (card: WishCardData, index: number) => {
    soundEngine.enableSoundOnInteraction();
    soundEngine.playDiyaChime(index);
    const fullText = `✨ Happy Diwali! Wishing you ${card.title} (${card.sanskrit}): ${card.message} 🪔`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(fullText).catch(() => {});
    }
    setCopiedId(card.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section
      id="wishes"
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-24 px-4 sm:px-8 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(245,158,11,0.16)_0%,rgba(12,5,26,0.95)_65%,#05020a_100%)] -z-20" />

      <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/15 border border-amber-400/35 text-amber-300 text-xs uppercase tracking-[0.25em] mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Five Sacred Blessings • Pancha Ratna</span>
        </motion.div>

        {/* Required Main Message */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl text-2xl sm:text-4xl md:text-5xl font-bold font-serif leading-snug bg-gradient-to-r from-amber-100 via-yellow-300 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(245,158,11,0.3)]"
        >
          &ldquo;May this Diwali bring new hopes, new dreams and endless
          happiness into your life.&rdquo;
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-3 text-sm sm:text-base text-amber-100/70 max-w-xl"
        >
          Hover over each blessing card to awaken its aura, or click any card to
          copy and share its festive wish with your loved ones.
        </motion.p>

        {/* 5 Animated Blessing Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 w-full">
          {WISH_CARDS.map((card, index) => {
            const Icon = card.icon;
            const isCopied = copiedId === card.id;

            const hoverMotion =
              card.hoverEffect === "float"
                ? { y: -12, scale: 1.03 }
                : card.hoverEffect === "shimmer"
                ? { y: -10, rotateZ: 1.2, scale: 1.03 }
                : card.hoverEffect === "pulse"
                ? { y: -10, scale: 1.04 }
                : card.hoverEffect === "tilt"
                ? { y: -10, rotateZ: -1.2, scale: 1.03 }
                : { y: -10, scale: 1.04 };

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                whileHover={hoverMotion}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCopyWish(card, index)}
                className={`group relative flex flex-col justify-between p-6 rounded-3xl bg-gradient-to-b ${card.gradient} bg-[#110622]/90 backdrop-blur-xl border border-amber-400/25 ${card.borderGlow} transition-all duration-300 text-left cursor-pointer overflow-hidden`}
              >
                {/* Animated Corner Mandala Glow */}
                <div className="pointer-events-none absolute -top-12 -right-12 w-32 h-32 rounded-full bg-amber-400/10 blur-2xl group-hover:bg-amber-400/30 transition-all duration-500" />

                {/* Shimmer Sweep on Hover */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                <div>
                  {/* Icon & Sanskrit Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.15 }}
                      className="flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/35 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                    >
                      <Icon className={`w-6 h-6 ${card.accentText}`} />
                    </motion.div>
                    <span className="text-[11px] font-serif tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-amber-200/80">
                      {card.sanskrit}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-2xl font-bold font-serif text-amber-100 group-hover:text-amber-300 transition-colors">
                    {card.title}
                  </h3>
                  <p className={`text-xs font-medium mt-0.5 ${card.accentText}`}>
                    {card.subtitle}
                  </p>

                  {/* Card Blessing Message */}
                  <p className="mt-4 text-sm text-amber-100/75 leading-relaxed">
                    {card.message}
                  </p>
                </div>

                {/* Interactive Footer inside Card */}
                <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-amber-200/60 group-hover:text-amber-200 transition-colors">
                  <AnimatePresence mode="wait">
                    {isCopied ? (
                      <motion.span
                        key="copied"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="inline-flex items-center gap-1.5 text-emerald-300 font-semibold"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Blessing Copied!</span>
                      </motion.span>
                    ) : (
                      <motion.span
                        key="copy"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="inline-flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Click to Copy Wish</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span className="text-amber-400">🪔</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
