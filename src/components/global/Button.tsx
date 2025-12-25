import { Link } from "@tanstack/react-router";
import { type ReactNode } from "react";

type ButtonVariant = "button" | "link";

interface BaseProps {
  children?: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  buttonText?: string;
}

interface ButtonProps extends BaseProps {
  variant?: "button";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

interface LinkProps extends BaseProps {
  variant: "link";
  to: string;
  onClick?: () => void;
  buttonText?: string;
}

type CustomButtonProps = ButtonProps | LinkProps;

const CustomButton = (props: CustomButtonProps) => {
  const { children, className = "", variant = "button", buttonText } = props;

  // Base styles for both button and link variants
  const baseStyles =
    `bg-[#03034D] cursor-pointer text-white px-6 py-3 rounded-full font-medium hover:bg-[#03034D]/90 transition-colors inline-block text-center no-underline disabled:opacity-50 disabled:cursor-not-allowed break-words`;

  // Link variant styles (more subtle, underlined)
  const linkStyles =
    "bg-transparent text-lg font-semibold flex justify-center items-center  text-[#03034D] px-0 py-0 rounded-none hover:bg-transparent hover:underline";

  const finalClassName =
    variant === "link"
      ? `${linkStyles} ${className}`
      : `${baseStyles} ${className}`;

  if (variant === "link") {
    const linkProps = props as LinkProps;
    return (
      <Link
        to={linkProps.to}
        className={finalClassName}
        onClick={linkProps.onClick}
      >
        {children ? children : buttonText}
      </Link>
    );
  }

  // Button variant
  const buttonProps = props as ButtonProps;

  return (
    <button
      className={finalClassName}
      onClick={buttonProps.onClick}
      type={buttonProps.type || "button"}
      disabled={buttonProps.disabled}
    >
      {children ? children : buttonText}
    </button>
  );
};

export default CustomButton;
