"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Sparkles, Menu, X } from "lucide-react";
import MusicToggle from "./MusicToggle";

interface NavbarProps {
  litDiyasCount: number;
  totalDiyas: number;
}

const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Celebration", href: "#celebration" },
  { label: "Diyas", href: "#diyas" },
  { label: "Fireworks", href: "#fireworks" },
  { label: "Rangoli", href: "#rangoli" },
  { label: "Wishes", href: "#wishes" },
];

export default function Navbar({ litDiyasCount, totalDiyas }: NavbarProps) {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = NAV_ITEMS.map((item) => item.href.replace("#", ""));
      const scrollPos = window.scrollY + window.innerHeight * 0.32;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const id = href.replace("#", "");
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 pointer-events-none">
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`pointer-events-auto flex items-center justify-between gap-2 sm:gap-6 px-4 sm:px-6 py-2.5 rounded-full transition-all duration-500 border ${
          scrolled
            ? "bg-[#090414]/85 backdrop-blur-xl border-amber-500/35 shadow-[0_10px_40px_rgba(0,0,0,0.75),0_0_25px_rgba(245,158,11,0.18)]"
            : "bg-[#0d061c]/65 backdrop-blur-md border-amber-400/20 shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
        }`}
      >
        {/* Brand Emblem */}
        <a
          href="#home"
          onClick={(e) => scrollToSection(e, "#home")}
          className="flex items-center gap-2 pr-2 group"
        >
          <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 p-0.5 shadow-[0_0_15px_rgba(251,191,36,0.5)]">
            <span className="flex items-center justify-center w-full h-full rounded-full bg-[#0b0416]">
              <Flame className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </span>
          </span>
          <span className="font-serif text-base sm:text-lg font-bold tracking-wider bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
            दीपावली
          </span>
        </a>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const id = item.href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`relative px-3.5 py-1.5 rounded-full text-xs lg:text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-amber-200"
                      : "text-amber-100/65 hover:text-amber-200"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavPill"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500/25 via-orange-500/20 to-amber-500/25 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.25)] -z-10"
                    />
                  )}
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Right Controls: Lit Diya Counter + Inline Sound Toggle + Mobile Menu */}
        <div className="flex items-center gap-2">
          <a
            href="#diyas"
            onClick={(e) => scrollToSection(e, "#diyas")}
            title="Diyas illuminated across the celebration"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-xs font-medium text-amber-200 hover:bg-amber-500/20 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {litDiyasCount}/{totalDiyas}
            </span>
            <span className="hidden lg:inline text-amber-300/75">Diyas</span>
          </a>

          <MusicToggle variant="inline" />

          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-200"
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto md:hidden fixed top-20 left-4 right-4 rounded-2xl bg-[#0e061f]/95 backdrop-blur-xl border border-amber-400/35 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
          >
            <ul className="grid grid-cols-2 gap-2">
              {NAV_ITEMS.map((item) => {
                const id = item.href.replace("#", "");
                const isActive = activeSection === id;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={(e) => scrollToSection(e, item.href)}
                      className={`flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-medium border transition-all ${
                        isActive
                          ? "bg-amber-500/20 border-amber-400/50 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.25)]"
                          : "bg-white/5 border-white/10 text-amber-100/75 hover:text-amber-200"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
