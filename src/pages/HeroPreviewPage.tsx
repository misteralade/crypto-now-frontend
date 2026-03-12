import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeroSectionNew from "../components/pages/homepage/HeroSectionNew.tsx";
import WhyCryptoNowNew from "../components/pages/homepage/WhyCryptoNowNew.tsx";
import TestimonialsNew from "../components/pages/homepage/TestimonialsNew.tsx";
import FAQsNew from "../components/pages/homepage/FAQsNew.tsx";
import FooterNew from "../components/pages/homepage/FooterNew.tsx";
import { ROUTES } from "../util/constants.util.ts";

const AuthButtons = () => (
  <div className="flex items-stretch" style={{ borderRadius: "9999px", border: "1px solid rgba(148,142,238,0.35)", overflow: "hidden", flexShrink: 0 }}>
    <Link
      to={ROUTES.SIGNIN}
      className="px-4 py-2 text-sm font-semibold text-[#0E0F0C] bg-white hover:bg-gray-50 transition-colors whitespace-nowrap flex items-center"
      style={{ borderRight: "1px solid rgba(148,142,238,0.25)" }}
    >
      Login
    </Link>
    <Link
      to={ROUTES.SIGNUP}
      className="px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity whitespace-nowrap flex items-center"
      style={{ background: "#948EEE" }}
    >
      Sign up
    </Link>
  </div>
);

const NAVBAR_H = 56; // px — reserved height so section doesn't jump when navbar exits

const HeroPreviewPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "#FAF9F7" }}>

      {/* Reserved space so HeroSection doesn't jump when inline navbar exits */}
      <div style={{ height: NAVBAR_H, position: "relative" }}>
        <AnimatePresence>
          {!scrolled && (
            <motion.header
              className="absolute inset-x-0 top-0 z-50 flex items-center justify-between"
              style={{ height: NAVBAR_H, paddingLeft: "16px", paddingRight: "16px" }}
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <Link to={ROUTES.HOMEPAGE} className="flex-shrink-0">
                <img src="/logo.svg" alt="CryptoNow" className="h-8 w-auto" />
              </Link>
              <AuthButtons />
            </motion.header>
          )}
        </AnimatePresence>
      </div>

      {/* ── Floating pill navbar — perfectly centered, fades in on scroll ── */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            className="fixed z-50 inset-x-0 flex justify-center pointer-events-none"
            style={{ top: "12px" }}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
          >
            <nav
              className="flex items-center justify-between pointer-events-auto"
              style={{
                height: "48px",
                width: "min(calc(100vw - 24px), 560px)",
                paddingLeft: "16px",
                paddingRight: "4px",
                background: "rgba(255,255,255,0.92)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderRadius: "9999px",
                border: "1px solid rgba(148,142,238,0.2)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              }}
            >
              <Link to={ROUTES.HOMEPAGE} className="flex-shrink-0">
                <img src="/logo.svg" alt="CryptoNow" className="h-6 w-auto" />
              </Link>
              <AuthButtons />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <HeroSectionNew />
      <WhyCryptoNowNew />
      <TestimonialsNew />
      <FAQsNew />
      <FooterNew />
    </div>
  );
};

export default HeroPreviewPage;
