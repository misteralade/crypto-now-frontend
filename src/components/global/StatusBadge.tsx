import clsx from "clsx";
import { transactionStatusStyles } from "../../util/constants.util";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const variant = transactionStatusStyles[status.toUpperCase()] ?? {
    text: status,
    bg: "bg-gray-50",
    dot: "bg-gray-400",
    textColor: "text-gray-700",
  };
  
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
        variant.bg,
        variant.textColor
      )}
    >
      <span className={clsx("h-2 w-2 rounded-full", variant.dot)} />
      {variant.text}
    </span>
  );
};
