import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import * as React from "react";

export type KeyVariant = "default" | "solid" | "disabled";

const keyIconSizes = {
  xs: "h-3.5 min-w-[14px] px-0.5 text-[8px]",
  sm: "h-4 min-w-[16px] px-1 text-[9px]",
  default: "h-4.5 min-w-[18px] px-1 text-xs",
  lg: "h-5 min-w-[20px] px-1.5 text-sm",
  xl: "h-6 min-w-[24px] px-2 text-base",
};

const keyIconBaseClasses =
  "font-pop inline-flex items-center justify-center rounded-sm ring-offset-background border border-b origin-bottom text-primary-foreground font-medium align-middle";

const keyIconColors = {
  default:
    "bg-gray-200 border-neutral-400 text-neutral-700 dark:bg-neutral-700 dark:border-neutral-500 dark:text-neutral-300",
  solid:
    "bg-neutral-300 border-neutral-500 text-neutral-900 dark:bg-neutral-600 dark:border-neutral-400 dark:text-neutral-100",
  disabled:
    "bg-gray-100 border-gray-300 text-gray-400 dark:bg-neutral-800 dark:border-neutral-600 dark:text-neutral-500",
};

export interface KeyIconProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: KeyVariant;
  size?: "xs" | "sm" | "default" | "lg" | "xl";
  inline?: boolean;
}

const KeyIcon = React.forwardRef<HTMLDivElement, KeyIconProps>(
  ({ className, variant = "default", size = "default", inline = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          inline ? "inline-flex align-middle" : keyIconBaseClasses, 
          keyIconColors[variant], 
          keyIconSizes[size], 
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

KeyIcon.displayName = "KeyIcon";

export { KeyIcon, keyIconColors, keyIconSizes };