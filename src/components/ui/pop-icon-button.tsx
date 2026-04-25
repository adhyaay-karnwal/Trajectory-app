import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import {
  PopButtonBaseProps,
  buttonColors,
  buttonOutlineColors,
  buttonGhostColors,
  buttonSoftColors,
  baseClasses,
  buttonSizes,
  type ButtonVariant,
  type Color,
  type SizeVariant,
} from "./pop-button";
import * as React from "react";

export interface PopIconButtonProps
  extends Omit<PopButtonBaseProps, "leftIcon" | "rightIcon" | "children"> {
  icon: React.ReactNode;
  iconOnly?: boolean;
}

export const PopIconButton = React.forwardRef<
  HTMLButtonElement,
  PopIconButtonProps
>(
  (
    {
      className,
      color = "default",
      size = "default",
      variant = "solid",
      asChild = false,
      loading = false,
      icon,
      iconOnly = true,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    const variantStyles: Record<ButtonVariant, Record<Color, string>> = {
      solid: buttonColors,
      outline: buttonOutlineColors,
      ghost: buttonGhostColors,
      soft: buttonSoftColors,
      dashed: buttonOutlineColors,
    };

    const colorClasses = variantStyles[variant][color];
    const sizeClasses = buttonSizes[size];

    const iconSizeMap: Record<SizeVariant, string> = {
      xs: "w-4 h-4",
      sm: "w-4 h-4",
      default: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-6 h-6",
    };

    const paddingClasses: Record<SizeVariant, string> = {
      xs: "w-7 h-7 p-1",
      sm: "w-9 h-9 p-1.5",
      default: "w-10 h-10 p-2",
      lg: "w-12 h-12 p-2.5",
      xl: "w-14 h-14 p-3",
    };

    const iconClass = iconSizeMap[size];
    const paddingClass = iconOnly ? paddingClasses[size] : sizeClasses;

    return (
      <Comp
        ref={ref}
        className={cn(
          baseClasses,
          colorClasses,
          paddingClass,
          iconOnly && "aspect-square",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <svg
            className={cn("animate-spin", iconClass)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <span className={cn(iconClass, "flex items-center justify-center")}>
            {icon}
          </span>
        )}
      </Comp>
    );
  }
);

PopIconButton.displayName = "PopIconButton";
