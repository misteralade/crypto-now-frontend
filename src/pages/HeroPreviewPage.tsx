import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSectionNew from "../components/pages/homepage/HeroSectionNew.tsx";
import { ROUTES } from "../util/constants.util.ts";

const AuthButtons = () => (
  <div
    className="flex items-stretch overflow-hidden"
    style={{
      borderRadius: "9999px",
      border: "1px solid rgba(148, 142, 238, 0.35)",
      boxShadow: "0 2px 8px rgba(148, 142, 238, 0.15), inset 0 1px 0 rgba(255,255,255,0.9)",
    }}
  >
    <Link
      to={ROUTES.SIGNIN}
      className="px-6 py-2.5 text-sm font-semibold text-[#0E0F0C] transition-colors border-r border-[#948EEE]/30 hover:bg-white/80"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(245,240,232,0.85) 100%)",
        borderRadius: "9999px 0 0 9999px",
      }}
    >
      Login
    </Link>
    <Link
      to={ROUTES.SIGNUP}
      className="px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      style={{
        background: "linear-gradient(135deg, #a8a4f0 0%, #948EEE 50%, #7b74e8 100%)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
        borderRadius: "0 9999px 9999px 0",
      }}
    >
      Sign up
    </Link>
  </div>
);

const HeroPreviewPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "#FAF9F7", minHeight: "100vh" }}>

      {/* ── Inline navbar — visible at top, fades out on scroll ── */}
      <AnimatePresence>
        {!scrolled && (
          <motion.header
            className="relative z-50 flex items-center justify-between px-6 md:px-10 py-4"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <Link to={ROUTES.HOMEPAGE}>
              <img src="/logo.svg" alt="CryptoNow" className="h-8 w-auto" />
            </Link>
            <AuthButtons />
          </motion.header>
        )}
      </AnimatePresence>

      {/* ── Sticky floating pill — fades in on scroll ── */}
      <AnimatePresence>
        {scrolled && (
          <motion.nav
            className="fixed top-4 left-1/2 z-50 flex items-center justify-between px-5 py-3"
            style={{
              transform: "translateX(-50%)",
              width: "min(92vw, 860px)",
              background: "rgba(255, 255, 255, 0.72)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              borderRadius: "9999px",
              border: "1px solid rgba(148, 142, 238, 0.18)",
              boxShadow: "0 4px 24px rgba(3, 3, 77, 0.10), 0 1px 4px rgba(148, 142, 238, 0.12)",
            }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <Link to={ROUTES.HOMEPAGE}>
              <img src="/logo.svg" alt="CryptoNow" className="h-8 w-auto" />
            </Link>
            <AuthButtons />
          </motion.nav>
        )}
      </AnimatePresence>

      <HeroSectionNew />
    </div>
  );
};

export default HeroPreviewPage;
