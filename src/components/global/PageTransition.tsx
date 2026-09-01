import type { ReactNode } from "react";
import { useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  // Key only by the top-level section (e.g. "dashboard", "profile") so
  // switching tabs still replays the enter animation once, but navigating
  // within a section (deeper routes, ?section= changes, etc.) doesn't
  // unmount/remount the subtree — that was discarding React Query's cached
  // instant-render and re-triggering the fade/offset on every sub-navigation,
  // which is what read as "glitter".
  const topLevelSection = location.pathname.split("/")[1] || "root";

  return (
    <motion.div
      key={topLevelSection}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ willChange: "opacity" }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
