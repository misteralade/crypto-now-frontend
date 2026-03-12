import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Plus, Minus } from "@phosphor-icons/react";
import { faqs } from "../../../data/faqs.ts";
import { ROUTES } from "../../../util/constants.util.ts";

type FAQItemProps = {
  index: number;
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
  isLast: boolean;
};

const FAQItem = ({ index, question, answer, open, onToggle, isLast }: FAQItemProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [maxH, setMaxH] = useState("0px");

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    setMaxH(open ? `${el.scrollHeight}px` : "0px");
    if (open) {
      const ro = new ResizeObserver(() => setMaxH(`${el.scrollHeight}px`));
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [open, question, answer]);

  return (
    <div id={index === 0 ? ROUTES.HOMEPAGE_TAG_IDS.FAQ : undefined}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`faq-panel-${index}`}
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-6 text-left group"
      >
        <span
          className="text-base leading-6 font-medium transition-colors duration-200"
          style={{
            color: open ? "#948EEE" : "rgba(255,255,255,0.88)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {question}
        </span>

        <span
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200"
          style={{
            background: open ? "#948EEE" : "rgba(255,255,255,0.08)",
            border: "1px solid",
            borderColor: open ? "#948EEE" : "rgba(255,255,255,0.12)",
          }}
        >
          {open ? (
            <Minus size={13} weight="bold" color="#fff" />
          ) : (
            <Plus size={13} weight="bold" color="rgba(255,255,255,0.65)" />
          )}
        </span>
      </button>

      {/* Animated answer */}
      <div
        id={`faq-panel-${index}`}
        role="region"
        aria-hidden={!open}
        style={{ maxHeight: maxH, overflow: "hidden", transition: "max-height 0.3s cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div ref={panelRef}>
          <p
            className="pr-10 pb-6 text-sm leading-relaxed"
            style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'DM Sans', sans-serif" }}
          >
            {answer}
          </p>
        </div>
      </div>

      {!isLast && (
        <div style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />
      )}
    </div>
  );
};

const FAQsNew = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  const leftRef = useRef<HTMLDivElement>(null);
  const leftInView = useInView(leftRef, { once: true, margin: "-60px" });
  const rightRef = useRef<HTMLDivElement>(null);
  const rightInView = useInView(rightRef, { once: true, margin: "-60px" });

  return (
    <section
      className="relative py-20 px-4 overflow-hidden"
      style={{ background: "#0E0F0C" }}
    >
      {/* Decorative arc rings — top-right */}
      <div
        className="pointer-events-none absolute right-0 top-0 z-0"
        style={{ width: "300px", height: "300px", transform: "translate(40%, -40%)" }}
      >
        <div className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(148,142,238,0.12)" }} />
        <div className="absolute rounded-full" style={{ inset: "48px", border: "1px solid rgba(148,142,238,0.08)" }} />
      </div>

      {/* Purple glow — bottom-left */}
      <div
        className="pointer-events-none absolute left-0 bottom-0 z-0"
        style={{
          width: "400px",
          height: "300px",
          background: "radial-gradient(ellipse, rgba(148,142,238,0.10) 0%, transparent 70%)",
          filter: "blur(40px)",
          transform: "translate(-30%, 30%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 items-start">

          {/* Left: sticky heading */}
          <motion.div
            ref={leftRef}
            initial={{ opacity: 0, x: -32 }}
            animate={leftInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-24"
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#948EEE", fontFamily: "'Delius', cursive" }}
            >
              Got questions?
            </p>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-5"
              style={{ color: "#ffffff", fontFamily: "'DM Sans', sans-serif" }}
            >
              Everything
              <br />
              you need
              <br />
              to know.
            </h2>
            <p
              className="text-sm mb-8"
              style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif" }}
            >
              Can't find what you're looking for?{" "}
              <a
                href={ROUTES.CONTACT}
                className="underline transition-colors"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                Chat with us.
              </a>
            </p>

            {/* Decorative dot + rings */}
            <div className="relative w-16 h-16">
              <div
                className="absolute inset-0 rounded-full"
                style={{ border: "1px solid rgba(148,142,238,0.2)" }}
              />
              <div
                className="absolute rounded-full"
                style={{ inset: "8px", border: "1px solid rgba(148,142,238,0.3)" }}
              />
              <div
                className="absolute rounded-full"
                style={{ inset: "16px", background: "#948EEE" }}
              />
            </div>
          </motion.div>

          {/* Right: accordion */}
          <motion.div
            ref={rightRef}
            initial={{ opacity: 0, x: 32 }}
            animate={rightInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}
          >
            <div className="px-6 sm:px-8">
              {faqs.map((item, index) => (
                <FAQItem
                  key={index}
                  index={index}
                  question={item.question}
                  answer={item.answer}
                  open={openIndex === index}
                  onToggle={() => toggle(index)}
                  isLast={index === faqs.length - 1}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FAQsNew;
