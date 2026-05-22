import { motion } from "framer-motion";
import AppSimCard from "./AppSimCard.tsx";

const SPRING = { type: "spring" as const, stiffness: 120, damping: 18, mass: 1 };

const HeroSectionNew = () => {
  return (
    <section
      className="relative isolate"
      style={{ background: "#FAF9F7", paddingBottom: "60px", overflowX: "clip" }}
    >

      {/* Purple glow — tight, bottom-center only */}
      <div
        className="pointer-events-none absolute z-0 left-1/2"
        style={{
          bottom: "0px",
          transform: "translateX(-50%)",
          width: "700px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(148,142,238,0.22) 0%, transparent 70%)",
          filter: "blur(48px)",
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

      {/* ── BTC coin — bottom-left corner ── */}
      <motion.div
        className="absolute z-10 hidden sm:block"
        style={{ bottom: "0px", left: "-2vw" }}
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
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatType: "loop" as const }}
        />
      </motion.div>

      {/* ── Naira coin — bottom-right corner ── */}
      <motion.div
        className="absolute z-10 hidden sm:block"
        style={{ bottom: "0px", right: "-2vw" }}
        initial={{ opacity: 0, x: 140, y: 120 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ ...SPRING, delay: 0.45 }}
      >
        <motion.img
          src="/decorations/naira-coin.png"
          alt="Naira"
          className="w-64 h-64 md:w-80 md:h-80 lg:w-[400px] lg:h-[400px] object-contain"
          style={{ filter: "none" }}
          initial={{ scaleX: -1 }}
          animate={{ y: [0, -18, 0], scaleX: -1 }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.9, repeatType: "loop" as const }}
        />
      </motion.div>

      {/* ── Page content: headline + card, stacked in flow ── */}
      <div className="relative z-20 flex flex-col items-center gap-8 pt-10 sm:pt-14 px-6">

        {/* Headline */}
        <motion.div
          className="text-center flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: -28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...SPRING, delay: 0.1 }}
        >
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight"
            style={{ fontFamily: "'DM Sans', sans-serif", color: "#0E0F0C" }}
          >
            Buy &amp; Sell Crypto
            <br />
            with{" "}
            <span style={{ color: "#948EEE" }}>Naira</span>
          </h1>
          <p
            className="text-sm sm:text-base text-gray-400 font-normal max-w-xs"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Fast, simple, secure. Try a guest trade right now.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 1.0, delay: 0.15 }}
        >
          <AppSimCard />
        </motion.div>

        {/* Fast • Simple • Secure */}
        <p
          className="text-sm sm:text-base text-[#6B6E6B] relative z-40"
          style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.02em" }}
        >
          Fast, simple, and clear.
        </p>
      </div>
    </section>
  );
};

export default HeroSectionNew;
