import { motion, useReducedMotion } from "framer-motion";

const STATUS_ICON_TYPE = { BUY: "buy", SELL: "sell" } as const;

type TransactionStatusIconProps = {
  type: "buy" | "sell";
  active?: boolean;
  size?: number;
};

export function TransactionStatusIcon({ type, active = true, size = 32 }: TransactionStatusIconProps) {
  const reducedMotion = useReducedMotion();
  const animate = active && !reducedMotion;

  return (
    <motion.svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {type === STATUS_ICON_TYPE.BUY ? (
        <motion.g animate={animate ? { scale: [1, 1.08, 0.98, 1] } : { scale: 1 }} transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1.8 }} style={{ transformBox: "view-box", transformOrigin: "center" }}>
          <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
          <path d="M14 2v5a1 1 0 0 0 1 1h5" />
          <motion.g animate={animate ? { x: [0, -1.4, -0.4, 0.7, 0], y: [0, 0.3, -1.3, -0.4, 0] } : { x: 0, y: 0 }} transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}>
            <circle cx="11.5" cy="14.5" r="2.5" />
            <path d="M13.3 16.3 15 18" />
          </motion.g>
        </motion.g>
      ) : (
        <>
          <path d="M20 8V6a2 2 0 0 0-2-2H6a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h12a2 2 0 0 0 2-2v-2" />
          <path d="M3 8h15a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-3a4 4 0 0 1 0-8h3" />
          <motion.circle cx="15" cy="12" r="0.8" fill="currentColor" stroke="none" animate={animate ? { opacity: [1, 0.25, 1], scale: [1, 1.4, 1] } : { opacity: 1, scale: 1 }} transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 0.8 }} />
          <motion.path d="M6 11v5" animate={animate ? { x: [0, 5, 0], opacity: [0, 0.7, 0] } : { opacity: 0 }} transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 0.7, ease: "easeInOut" }} />
        </>
      )}
    </motion.svg>
  );
}
