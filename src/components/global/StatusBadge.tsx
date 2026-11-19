import clsx from "clsx";
import { getStatusConfig } from "../../util/transaction.util.ts";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = getStatusConfig(status);
  
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
        config.bgColor,
        config.textColor
      )}
    >
      <span className={clsx("h-2 w-2 rounded-full", config.dotColor)} />
      {config.displayName}
    </span>
  );
};
