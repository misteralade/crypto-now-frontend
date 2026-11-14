import { useEffect, useState, type CSSProperties } from "react";

export interface UserAvatarProps {
  src?: string | null;
  firstName?: string;
  lastName?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  className?: string;
  style?: CSSProperties;
  alt?: string;
  shadow?: boolean;
}

const getInitials = (firstName?: string, lastName?: string): string => {
  if (!firstName && !lastName) return "CN";
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "CN";
};

const SIZE_PRESETS = {
  xs: { size: "w-7 h-7", text: "text-[10px]" },
  sm: { size: "w-8 h-8", text: "text-xs" },
  md: { size: "w-10 h-10", text: "text-sm" },
  lg: { size: "w-16 h-16", text: "text-lg" },
  xl: { size: "w-20 h-20", text: "text-2xl" },
} as const;

export const UserAvatar = ({
  src,
  firstName,
  lastName,
  size = "md",
  className = "",
  style,
  alt,
  shadow = false,
}: UserAvatarProps) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const initials = getInitials(firstName, lastName);
  const isCustomSize = typeof size === "number";
  const sizeConfig = !isCustomSize ? SIZE_PRESETS[size] : null;

  const dynamicStyle: CSSProperties = {
    ...(isCustomSize ? { width: size, height: size } : {}),
    ...(shadow ? { boxShadow: "0 8px 24px rgba(87,90,229,0.28)" } : {}),
    ...style,
  };

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={alt || `${firstName ?? ""} ${lastName ?? ""}`.trim() || "User Profile"}
        onError={() => setHasError(true)}
        className={`${!isCustomSize ? sizeConfig?.size : ""} rounded-full object-cover shrink-0 border border-white/20 ${className}`}
        style={dynamicStyle}
      />
    );
  }

  return (
    <div
      className={`${!isCustomSize ? sizeConfig?.size : ""} ${!isCustomSize ? sizeConfig?.text : ""} rounded-full flex items-center justify-center font-black text-white shrink-0 select-none ${className}`}
      style={{
        background: "linear-gradient(135deg, #6DD5FA 0%, #2980B9 40%, #948EEE 75%, #575AE5 100%)",
        ...dynamicStyle,
      }}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;
