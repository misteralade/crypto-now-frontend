import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X, Play } from "@phosphor-icons/react";
import { usePublishedTestimonialsQuery } from "../../../queries/testimonial.query.ts";
import { TESTIMONIAL_CONTENT_TYPES } from "../../../util/constants.util.ts";
import type { TestimonialResponse } from "../../../types/response.payload.types.ts";

/* ── Fallback testimonials ── */
const FALLBACK_TESTIMONIALS: TestimonialResponse[] = [
  {
    id: "f1", creatorId: "", isPublished: true,
    contentType: TESTIMONIAL_CONTENT_TYPES.TEXT, contentLink: "",
    name: "Chukwuemeka A.",
    description: "I sent BTC and the naira came through a few minutes later. It was straightforward and did what I needed.",
    createdAt: "", updatedAt: "",
  },
  {
    id: "f2", creatorId: "", isPublished: true,
    contentType: TESTIMONIAL_CONTENT_TYPES.TEXT, contentLink: "",
    name: "Amara O.",
    description: "The rate stayed the same from start to finish, which was the main thing I was looking for.",
    createdAt: "", updatedAt: "",
  },
  {
    id: "f3", creatorId: "", isPublished: true,
    contentType: TESTIMONIAL_CONTENT_TYPES.TEXT, contentLink: "",
    name: "Tunde B.",
    description: "I had a question on one transaction and support replied without dragging it out.",
    createdAt: "", updatedAt: "",
  },
];

/* ── YouTube embed helper ── */
const toEmbedUrl = (url: string, autoplay = false) => {
  try {
    const u = new URL(url.trim());
    let videoId = "";
    if (u.hostname.includes("youtube.com") && u.searchParams.has("v"))
      videoId = u.searchParams.get("v")!;
    else if (u.hostname.includes("youtu.be"))
      videoId = u.pathname.slice(1);
    else if (url.includes("/embed/"))
      return autoplay ? `${url}?autoplay=1` : url;
    if (videoId)
      return `https://www.youtube.com/embed/${videoId}${autoplay ? "?autoplay=1" : ""}`;
  } catch {}
  return url;
};

/* ── Review label ── */
const ReviewLabel = () => (
  <div className="inline-flex items-center gap-2 rounded-full border border-[#E9E9F2] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6B6E6B]">
    <span className="h-1.5 w-1.5 rounded-full bg-[#948EEE]" />
    Customer note
  </div>
);

/* ── Skeleton ── */
const SkeletonCard = () => (
  <div className="rounded-[24px] p-6 animate-pulse" style={{ background: "#fff", border: "1px solid rgba(15,23,42,0.06)" }}>
    <div className="inline-flex h-7 w-28 rounded-full bg-gray-100 mb-5" />
    <div className="space-y-2 mb-6">
      <div className="h-3 bg-gray-100 rounded w-full" /><div className="h-3 bg-gray-100 rounded w-4/5" /><div className="h-3 bg-gray-100 rounded w-3/5" />
    </div>
    <div className="h-3 bg-gray-200 rounded w-1/3" />
  </div>
);

/* ── Full-screen video/image modal (desktop only) ── */
const ImmersiveModal = ({
  testimonial,
  onClose,
}: {
  testimonial: TestimonialResponse;
  onClose: () => void;
}) => {
  // Lock body scroll while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const isVideo = testimonial.contentType === TESTIMONIAL_CONTENT_TYPES.VIDEO;
  const isImage = testimonial.contentType === TESTIMONIAL_CONTENT_TYPES.IMAGE;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        {/* Dark backdrop */}
        <motion.div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.92)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Media — animates up from bottom */}
        <motion.div
          className="relative w-full h-full flex items-center justify-center"
          initial={{ y: 60, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {isVideo && (
            <iframe
              src={toEmbedUrl(testimonial.contentLink, true)}
              title={testimonial.name || "Testimonial"}
              className="w-full h-full"
              style={{ maxWidth: "min(100vw, 1200px)", maxHeight: "min(100vh, 675px)", borderRadius: 0 }}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          )}
          {isImage && (
            <img
              src={testimonial.contentLink}
              alt={testimonial.name || "Testimonial"}
              className="w-full h-full object-contain"
              style={{ maxWidth: "min(100vw, 1200px)", maxHeight: "min(100vh, 675px)" }}
            />
          )}
        </motion.div>

        {/* Close button */}
        <motion.button
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.2 }}
          onClick={onClose}
          whileHover={{ background: "rgba(255,255,255,0.2)" }}
        >
          <X size={18} weight="bold" color="#fff" />
        </motion.button>

        {/* Author label at bottom */}
        {testimonial.name && (
          <motion.div
            className="absolute bottom-6 left-1/2 flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ transform: "translateX(-50%)", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)" }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: "#948EEE" }}>
              {(testimonial.name).split(" ").slice(0, 2).map((w) => w[0] || "").join("").toUpperCase() || "?"}
            </div>
            <span className="text-sm font-medium text-white whitespace-nowrap" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {testimonial.name}
            </span>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

/* ── Individual card ── */
const TestimonialCard = ({
  testimonial,
  index,
  onExpand,
}: {
  testimonial: TestimonialResponse;
  index: number;
  onExpand: (t: TestimonialResponse) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const rotate = [-0.8, 0, 0.8][index % 3];

  const isMedia =
    testimonial.contentType === TESTIMONIAL_CONTENT_TYPES.VIDEO ||
    testimonial.contentType === TESTIMONIAL_CONTENT_TYPES.IMAGE;

  const handleMediaClick = () => {
    // Only expand on desktop (md+)
    if (window.innerWidth >= 768 && isMedia) {
      onExpand(testimonial);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.07 }}
      style={{
        background: "#fff",
        border: "1px solid rgba(148,142,238,0.1)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        borderRadius: "16px",
        transform: `rotate(${rotate}deg)`,
      }}
      whileHover={{
        scale: 1.02,
        rotate: 0,
        boxShadow: "0 8px 32px rgba(148,142,238,0.15)",
        transition: { duration: 0.2 },
      }}
      className="p-6 flex flex-col gap-4"
    >
      <ReviewLabel />

      {/* Video thumbnail — desktop: clickable to expand; mobile: inline iframe */}
      {testimonial.contentType === TESTIMONIAL_CONTENT_TYPES.VIDEO && (
        <>
          {/* Desktop: thumbnail with play overlay */}
          <div
            className="hidden md:block relative w-full h-44 rounded-xl overflow-hidden bg-gray-900 cursor-pointer group"
            onClick={handleMediaClick}
          >
            <img
              src={`https://img.youtube.com/vi/${(() => {
                try {
                  const u = new URL(testimonial.contentLink.trim());
                  if (u.searchParams.has("v")) return u.searchParams.get("v");
                  if (u.hostname.includes("youtu.be")) return u.pathname.slice(1);
                  const m = testimonial.contentLink.match(/embed\/([^?&]+)/);
                  return m ? m[1] : "";
                } catch { return ""; }
              })()}/hqdefault.jpg`}
              alt=""
              className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-200"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: "rgba(0,0,0,0.65)", border: "2px solid rgba(255,255,255,0.3)" }}
                whileHover={{ scale: 1.1, background: "rgba(148,142,238,0.85)" }}
                transition={{ duration: 0.15 }}
              >
                <Play size={22} weight="fill" color="#fff" />
              </motion.div>
            </div>
          </div>
          {/* Mobile: inline iframe */}
          <div className="md:hidden w-full h-44 rounded-xl overflow-hidden bg-gray-100">
            <iframe
              src={toEmbedUrl(testimonial.contentLink)}
              title={testimonial.name || "Testimonial"}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </>
      )}

      {/* Image — desktop: click to expand; mobile: inline */}
      {testimonial.contentType === TESTIMONIAL_CONTENT_TYPES.IMAGE && (
        <div
          className={`w-full h-44 rounded-xl overflow-hidden bg-gray-100 ${window.innerWidth >= 768 ? "cursor-pointer" : ""}`}
          onClick={handleMediaClick}
        >
          <img
            src={testimonial.contentLink}
            alt={testimonial.name || "Testimonial"}
            className="w-full h-full object-cover hover:opacity-90 transition-opacity duration-200"
          />
        </div>
      )}

      <p
        className="text-[15px] leading-7 flex-1"
        style={{ color: "#3F4340", fontFamily: "'DM Sans', sans-serif" }}
      >
        {testimonial.description}
      </p>

      <div className="flex items-center gap-2 pt-2" style={{ borderTop: "1px solid rgba(15,23,42,0.06)" }}>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ background: "linear-gradient(135deg,#948EEE,#6F63E8)" }}
        >
          {(testimonial.name || "?").split(" ").slice(0, 2).map((w) => w[0] || "").join("").toUpperCase() || "?"}
        </div>
        <div>
          <span className="block text-sm font-semibold" style={{ color: "#0E0F0C", fontFamily: "'DM Sans', sans-serif" }}>
            {testimonial.name}
          </span>
          <span className="block text-[12px] text-[#6B6E6B]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Customer review
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Section ── */
const TestimonialsNew = () => {
  const { testimonials, isLoading } = usePublishedTestimonialsQuery(1, 100);
  const headRef = useRef<HTMLDivElement>(null);
  const headInView = useInView(headRef, { once: true, margin: "-60px" });
  const [activeModal, setActiveModal] = useState<TestimonialResponse | null>(null);

  const displayList = !isLoading && testimonials.length === 0 ? FALLBACK_TESTIMONIALS : testimonials;

  return (
    <section className="relative py-20 px-4" style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #FBFBFE 100%)" }}>
      {/* Subtle noise grain */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#948EEE", fontFamily: "'DM Sans', sans-serif" }}>
            Customer feedback
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight" style={{ color: "#0E0F0C", fontFamily: "'DM Sans', sans-serif" }}>
            What people say<br />after using it.
          </h2>
          <p className="mt-3 text-base" style={{ color: "#6B6E6B", fontFamily: "'DM Sans', sans-serif" }}>
            A few short notes from recent customers.
          </p>
        </motion.div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
            {displayList.map((t, i) => (
              <TestimonialCard
                key={t.id}
                testimonial={t}
                index={i}
                onExpand={setActiveModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* Immersive modal — desktop only */}
      {activeModal && (
        <ImmersiveModal
          testimonial={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}
    </section>
  );
};

export default TestimonialsNew;
