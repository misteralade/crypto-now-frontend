import type { ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
}

const isDetailRoute = (pathname: string): boolean => {
  return (
    pathname.includes("/transactions/") ||
    pathname.includes("/dispute/") ||
    pathname.includes("/notifications")
  );
};

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const isDetail = isDetailRoute(location.pathname);

  const variants = isDetail
    ? {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -16 },
      }
    : {
        initial: { opacity: 0, scale: 0.988 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.988 },
      };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{
          duration: isDetail ? 0.22 : 0.18,
          ease: [0.32, 0.72, 0, 1],
        }}
        style={{ willChange: "transform, opacity" }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
