import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShieldCheck, LockSimple, Lightning } from "@phosphor-icons/react";

const features = [
  {
    icon: ShieldCheck,
    label: "Human-verified",
    title: "Every trade, checked by our team.",
    body: "No bots making judgment calls on your money. Our team reviews every transaction before funds move — accuracy and speed without shortcuts.",
    align: "left" as const,
  },
  {
    icon: LockSimple,
    label: "Rate locked",
    title: "Your rate, frozen for 5 minutes.",
    body: "CoinGecko-sourced rates lock the moment you start. No slippage, no surprises — the price you see is the price you pay, every time.",
    align: "right" as const,
  },
  {
    icon: Lightning,
    label: "Fast settlement",
    title: "Money moves before you blink.",
    body: "Automated settlement kicks off the moment your payment confirms. Most trades complete in under 3 minutes, day or night.",
    align: "left" as const,
  },
];

const FeatureRow = ({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = feature.icon;
  const isRight = feature.align === "right";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isRight ? 48 : -48 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      className={`flex items-start gap-5 ${isRight ? "flex-row-reverse text-right" : "text-left"}`}
    >
      {/* Icon pill */}
      <div
        className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: "#F3F2FD", border: "1px solid rgba(148,142,238,0.2)" }}
      >
        <Icon size={22} weight="duotone" color="#948EEE" />
      </div>

      {/* Text */}
      <div className="flex-1">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: "#948EEE", fontFamily: "'DM Sans', sans-serif" }}
        >
          {feature.label}
        </p>
        <h3
          className="text-lg font-semibold mb-1.5 leading-snug"
          style={{ color: "#0E0F0C", fontFamily: "'DM Sans', sans-serif" }}
        >
          {feature.title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "#6B6E6B", fontFamily: "'DM Sans', sans-serif" }}
        >
          {feature.body}
        </p>
      </div>
    </motion.div>
  );
};

const WhyCryptoNowNew = () => {
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-60px" });

  return (
    <section
      className="relative py-20 px-4 overflow-hidden"
      style={{ background: "#FAF9F7" }}
    >
      {/* Faint arc decoration — bottom-left */}
      <div
        className="pointer-events-none absolute left-0 bottom-0 z-0"
        style={{ width: "320px", height: "320px", transform: "translate(-40%, 40%)" }}
      >
        <div className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(148,142,238,0.10)" }} />
        <div className="absolute rounded-full" style={{ inset: "48px", border: "1px solid rgba(148,142,238,0.13)" }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14"
        >
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-3"
            style={{ color: "#948EEE", fontFamily: "'Delius', cursive" }}
          >
            Why us ✦
          </p>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
            style={{ color: "#0E0F0C", fontFamily: "'DM Sans', sans-serif" }}
          >
            Built different,
            <br />
            for a reason.
          </h2>
          <p
            className="mt-3 text-base max-w-md"
            style={{ color: "#6B6E6B", fontFamily: "'DM Sans', sans-serif" }}
          >
            Every design decision at CryptoNow was made to protect you and move fast.
          </p>
        </motion.div>

        {/* Feature rows */}
        <div className="flex flex-col gap-10">
          {features.map((f, i) => (
            <div key={f.label}>
              <FeatureRow feature={f} index={i} />
              {i < features.length - 1 && (
                <div
                  className="mt-10 h-px"
                  style={{ background: "rgba(148,142,238,0.12)" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyCryptoNowNew;
