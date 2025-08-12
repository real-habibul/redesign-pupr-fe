import React, { ReactNode, MouseEventHandler } from "react";

type Size = "ExtraSmall" | "Small" | "Medium" | "Large" | "ExtraLarge";
type Variant =
  | "solid_blue"
  | "solid_yellow"
  | "outlined_blue"
  | "outlined_yellow"
  | "blue_text"
  | "red_text"
  | "outlined_icon"
  | "disabled";

interface ButtonProps {
  children: ReactNode;
  size?: Size;
  variant?: Variant;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "Medium",
  variant = "solid_blue",
  onClick,
  disabled = false,
  className = "",
  iconLeft = null,
  iconRight = null,
}) => {
  const sizes: Record<Size, string> = {
    ExtraSmall: className.includes("custom-padding")
      ? "text-ExtraSmall rounded-[8px]"
      : "px-3 py-1 text-ExtraSmall rounded-[8px]",
    Small: className.includes("custom-padding")
      ? "text-Small rounded-[12px]"
      : "px-5 py-1.5 text-Small rounded-[12px]",
    Medium: className.includes("custom-padding")
      ? "text-Medium rounded-[16px]"
      : "px-6 py-3 text-Medium rounded-[16px]",
    Large: className.includes("custom-padding")
      ? "text-Large rounded-[20px]"
      : "px-5 py-2.5 text-Large rounded-[20px]",
    ExtraLarge: className.includes("custom-padding")
      ? "text-ExtraLarge rounded-[24px]"
      : "px-6 py-3 text-ExtraLarge rounded-[24px]",
  };

  const variants: Record<Variant, string> = {
    solid_blue:
      "bg-solid_basic_blue_500 text-emphasis_light_on_high hover:bg-solid_basic_blue_600 active:bg-solid_basic_blue_700 focus:outline-none focus:ring-2 focus:ring-solid_basic_blue_300",
    solid_yellow:
      "bg-solid_basic_yellow_500 text-emphasis_light_on_surface_high hover:bg-solid_basic_yellow_600 active:bg-solid_basic_yellow_700 focus:outline-none focus:ring-2 focus:ring-solid_basic_yellow_300",

    outlined_blue:
      "ring-2 ring-solid_basic_blue_500 text-solid_basic_blue_500 hover:bg-solid_basic_blue_500/10 active:bg-solid_basic_blue_500/20 focus:outline-none focus:ring-2 focus:ring-solid_basic_blue_300",

    outlined_yellow:
      "ring-2 ring-solid_basic_yellow_500 text-solid_basic_yellow_500 hover:bg-solid_basic_yellow_500/10 active:bg-solid_basic_yellow_500/20 focus:outline-none focus:ring-2 focus:ring-solid_basic_yellow_300",

    blue_text:
      "text-solid_basic_blue_500 hover:text-solid_basic_blue_600 active:text-solid_basic_blue_700 focus:outline-none focus:ring-2 focus:ring-solid_basic_blue_300",

    red_text:
      "text-solid_basic_red_500 hover:text-solid_basic_red_600 active:text-solid_basic_red_700 focus:outline-none focus:ring-2 focus:ring-solid_basic_red_300",

    outlined_icon:
      "ring-2 ring-solid_basic_blue_500 text-solid_basic_blue_500 hover:bg-solid_basic_blue_500/10 active:bg-solid_basic_blue_500/20 focus:outline-none focus:ring-2 focus:ring-solid_basic_blue_300 flex justify-center items-center rounded-full h-10 w-10",

    disabled:
      "bg-solid_basic_neutral_100 text-emphasis_light_on_surface_small cursor-not-allowed opacity-50",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${sizes[size]} ${
        disabled ? variants["disabled"] : variants[variant]
      } flex justify-center items-center transition-all duration-200 ease-in-out ${className}`}>
      {iconLeft && <span className="mr-2">{iconLeft}</span>}
      {children}
      {iconRight && <span className="ml-2">{iconRight}</span>}
    </button>
  );
};

export default Button;
