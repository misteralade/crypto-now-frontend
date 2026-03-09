import { motion } from "framer-motion";
import AppSimCard from "./AppSimCard.tsx";

const SPRING = { type: "spring", stiffness: 120, damping: 18, mass: 1 };
const EASE_OUT = { type: "spring", stiffness: 80, damping: 20 };

const HeroSectionNew = () => {
  return (
    <section
      className="relative overflow-hidden isolate"
      style={{ background: "#FAF9F7", height: "calc(100vh - 64px)" }}
    >

      {/* Purple glow — tight, bottom-center only */}
      <div
        className="pointer-events-none absolute z-0 left-1/2"
        style={{
          bottom: "-60px",
          transform: "translateX(-50%)",
          width: "600px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(148,142,238,0.28) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Concentric purple arcs */}
      <div
        className="pointer-events-none absolute left-1/2 z-0"
        style={{ bottom: "-80px", transform: "translateX(-50%)", width: "860px", height: "860px" }}
      >
        <div className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(148,142,238,0.10)" }} />
        <div className="absolute rounded-full" style={{ inset: "80px", border: "1px solid rgba(148,142,238,0.13)" }} />
        <div className="absolute rounded-full" style={{ inset: "180px", border: "1px solid rgba(148,142,238,0.18)" }} />
      </div>

      {/* ── Headline — absolutely top-anchored, always above card ── */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-40 flex flex-col items-center pt-6 sm:pt-8 px-4 text-center pointer-events-none"
        initial={{ opacity: 0, y: -28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING, delay: 0.1 }}
      >
        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-tight tracking-tight"
          style={{ fontFamily: "'Zen Dots', cursive", color: "#0E0F0C" }}
        >
          BUY{" "}
          <span style={{ fontFamily: "'Delius', cursive", fontSize: "0.65em", color: "#0E0F0C", verticalAlign: "middle" }}>
            &amp;
          </span>{" "}
          SELL
        </h1>
      </motion.div>

      {/* ── BTC coin — bottom-left corner, slides in from further left+down ── */}
      <motion.div
        className="absolute z-10 hidden sm:block"
        style={{ bottom: "-40px", left: "-2vw" }}
        initial={{ opacity: 0, x: -140, y: 120 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ ...SPRING, delay: 0.3 }}
      >
        <motion.img
          src="/decorations/btc-coin.png"
          alt="Bitcoin"
          className="w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] object-contain"
          style={{ filter: "none" }}
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
        />
      </motion.div>

      {/* ── Naira coin — bottom-right corner, slides in from further right+down ── */}
      <motion.div
        className="absolute z-10 hidden sm:block"
        style={{ bottom: "-40px", right: "-2vw" }}
        initial={{ opacity: 0, x: 140, y: 120 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ ...SPRING, delay: 0.45 }}
      >
        <motion.img
          src="/decorations/naira-coin.png"
          alt="Naira"
          className="w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] object-contain"
          style={{ filter: "none", transform: "scaleX(-1)" }}
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.9, repeatType: "loop" }}
        />
      </motion.div>

      {/* ── Phone card — centered, slides up through the bottom blur ── */}
      <motion.div
        className="absolute z-10"
        style={{ bottom: 0, left: "50%", x: "-50%" }}
        initial={{ opacity: 0, y: 260 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 1.0, delay: 0.15 }}
      >
        <div style={{ transform: "translateY(180px)" }}>
          <AppSimCard />
        </div>
      </motion.div>

      {/* ── Bottom fade overlay ── */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-30"
        style={{
          height: "180px",
          background: "linear-gradient(to bottom, transparent 0%, #FAF9F7 85%)",
        }}
      />

      {/* Fast • Simple • Secure */}
      <div
        className="absolute left-1/2 z-40 text-center"
        style={{ bottom: "20px", transform: "translateX(-50%)" }}
      >
        <p
          className="text-sm sm:text-base text-gray-500 whitespace-nowrap"
          style={{ fontFamily: "'Delius', cursive" }}
        >
          Fast &bull; Simple &bull; Secure
        </p>
      </div>
    </section>
  );
};

export default HeroSectionNew;
