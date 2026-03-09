import { motion } from "framer-motion";
import AppSimCard from "./AppSimCard.tsx";

const SPRING = { type: "spring", stiffness: 120, damping: 18, mass: 1 };
const EASE_OUT = { type: "spring", stiffness: 80, damping: 20 };

const HeroSectionNew = () => {
  return (
    <section
      className="relative overflow-hidden isolate"
      style={{ background: "#f5f0e8", height: "calc(100vh - 72px)" }}
    >
      {/* Noise grain */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
          opacity: 0.5,
        }}
      />

      {/* Purple glow — bottom-left */}
      <div
        className="pointer-events-none absolute z-0"
        style={{
          left: "-100px", bottom: "0",
          width: "520px", height: "520px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(148,142,238,0.40) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />

      {/* Gold glow — bottom-right */}
      <div
        className="pointer-events-none absolute z-0"
        style={{
          right: "-100px", bottom: "0",
          width: "520px", height: "520px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(247,166,0,0.32) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />

      {/* Concentric purple arcs */}
      <div
        className="pointer-events-none absolute left-1/2 z-0"
        style={{ bottom: "-80px", transform: "translateX(-50%)", width: "860px", height: "860px" }}
      >
        <div className="absolute inset-0 rounded-full" style={{ border: "1.5px solid rgba(148,142,238,0.11)" }} />
        <div className="absolute rounded-full" style={{ inset: "80px", border: "1.5px solid rgba(148,142,238,0.16)", background: "radial-gradient(ellipse at center, rgba(148,142,238,0.06) 0%, transparent 70%)" }} />
        <div className="absolute rounded-full" style={{ inset: "180px", border: "1.5px solid rgba(148,142,238,0.22)", background: "radial-gradient(ellipse at center, rgba(148,142,238,0.10) 0%, transparent 70%)" }} />
      </div>

      {/* ── Headline ── */}
      <motion.div
        className="relative z-30 flex flex-col items-center pt-14 px-4 text-center"
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
        <p
          className="text-xs sm:text-sm font-normal tracking-[0.3em] mt-1"
          style={{ fontFamily: "'Zen Dots', cursive", color: "#948EEE" }}
        >
          CRYPTO
        </p>
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
          className="w-56 h-56 md:w-72 md:h-72 lg:w-[340px] lg:h-[340px] object-contain"
          style={{ filter: "drop-shadow(0 12px 40px rgba(247,166,0,0.38))" }}
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
          className="w-56 h-56 md:w-72 md:h-72 lg:w-[340px] lg:h-[340px] object-contain"
          style={{ filter: "drop-shadow(0 12px 40px rgba(148,142,238,0.38))" }}
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.9, repeatType: "loop" }}
        />
      </motion.div>

      {/* ── Phone card — centered, slides up through the bottom blur ── */}
      <motion.div
        className="absolute z-20"
        style={{ bottom: 0, left: "50%", x: "-50%" }}
        initial={{ opacity: 0, y: 220 }}
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
          background: "linear-gradient(to bottom, transparent 0%, #f5f0e8 85%)",
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
