import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useSound } from "@/lib/use-sound";

export type Color =
  | "default"
  | "blue"
  | "purple"
  | "sky"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "teal"
  | "cyan"
  | "indigo"
  | "violet"
  | "rose"
  | "amber"
  | "lime"
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone"
  | "fuchsia"
  | "emerald";

export type SizeVariant = "xs" | "sm" | "default" | "lg" | "xl";

export type ButtonVariant =
  | "solid"
  | "outline"
  | "ghost"
  | "soft"
  | "dashed";

export type IconPosition = "left" | "right" | "both";

export interface IconConfig {
  icon: React.ReactNode;
  position?: IconPosition;
}

export interface PopButtonBaseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: Color;
  size?: SizeVariant;
  variant?: ButtonVariant;
  asChild?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  keybind?: "enter" | "escape" | "backspace" | "shift" | "ctrl" | "alt" | "tab" | "m" | "e" | string;
}

export const buttonColors = {
  default:
    "bg-white hover:bg-gray-50 border-neutral-400 text-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:border-neutral-500 dark:text-neutral-100",
  blue: "bg-blue-500 hover:bg-blue-600 border-blue-800 text-white",
  purple: "bg-purple-500 hover:bg-purple-600 border-purple-800 text-white",
  sky: "bg-sky-500 hover:bg-sky-600 border-sky-800 text-black dark:text-white disabled:bg-sky-300 disabled:border-sky-400 disabled:text-gray-500 dark:disabled:bg-sky-900/50 dark:disabled:border-sky-700 dark:disabled:text-sky-300",
  red: "bg-red-500 hover:bg-red-600 border-red-800 text-white",
  orange: "bg-orange-500 hover:bg-orange-600 border-orange-800 text-white",
  yellow: "bg-yellow-500 hover:bg-yellow-600 border-yellow-800 text-white",
  green: "bg-green-500 hover:bg-green-600 border-green-800 text-white",
  teal: "bg-teal-500 hover:bg-teal-600 border-teal-800 text-white",
  cyan: "bg-cyan-500 hover:bg-cyan-600 border-cyan-800 text-white",
  indigo: "bg-indigo-500 hover:bg-indigo-600 border-indigo-800 text-white",
  violet: "bg-violet-500 hover:bg-violet-600 border-violet-800 text-white",
  rose: "bg-rose-500 hover:bg-rose-600 border-rose-800 text-white",
  amber: "bg-amber-500 hover:bg-amber-600 border-amber-800 text-white",
  lime: "bg-lime-500 hover:bg-lime-600 border-lime-800 text-white",
  slate: "bg-slate-500 hover:bg-slate-600 border-slate-800 text-white",
  gray: "bg-gray-500 hover:bg-gray-600 border-gray-800 text-white",
  zinc: "bg-zinc-500 hover:bg-zinc-600 border-zinc-800 text-white",
  neutral: "bg-neutral-500 hover:bg-neutral-600 border-neutral-800 text-white",
  stone: "bg-stone-500 hover:bg-stone-600 border-stone-800 text-white",
  fuchsia: "bg-fuchsia-500 hover:bg-fuchsia-600 border-fuchsia-800 text-white",
  emerald: "bg-emerald-500 hover:bg-emerald-600 border-emerald-800 text-white",
} as const;

export const buttonOutlineColors: Record<Color, string> = {
  default:
    "border-neutral-400 text-neutral-900 hover:bg-gray-50 dark:border-neutral-500 dark:text-neutral-100 dark:hover:bg-neutral-800",
  blue: "border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30",
  purple: "border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30",
  sky: "border-sky-600 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/30",
  red: "border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30",
  orange: "border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30",
  yellow: "border-yellow-600 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30",
  green: "border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30",
  teal: "border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30",
  cyan: "border-cyan-600 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/30",
  indigo: "border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30",
  violet: "border-violet-600 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30",
  rose: "border-rose-600 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30",
  amber: "border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30",
  lime: "border-lime-600 text-lime-600 hover:bg-lime-50 dark:hover:bg-lime-900/30",
  slate: "border-slate-600 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900/30",
  gray: "border-gray-600 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900/30",
  zinc: "border-zinc-600 text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900/30",
  neutral: "border-neutral-600 text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900/30",
  stone: "border-stone-600 text-stone-600 hover:bg-stone-50 dark:hover:bg-stone-900/30",
  fuchsia: "border-fuchsia-600 text-fuchsia-600 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30",
  emerald: "border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30",
} as const;

export const buttonGhostColors: Record<Color, string> = {
  default: "text-neutral-900 bg-transparent hover:bg-gray-100 dark:text-neutral-100 dark:hover:bg-neutral-800",
  blue: "text-blue-600 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-900/30",
  purple: "text-purple-600 bg-transparent hover:bg-purple-50 dark:hover:bg-purple-900/30",
  sky: "text-sky-600 bg-transparent hover:bg-sky-50 dark:hover:bg-sky-900/30",
  red: "text-red-600 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/30",
  orange: "text-orange-600 bg-transparent hover:bg-orange-50 dark:hover:bg-orange-900/30",
  yellow: "text-yellow-600 bg-transparent hover:bg-yellow-50 dark:hover:bg-yellow-900/30",
  green: "text-green-600 bg-transparent hover:bg-green-50 dark:hover:bg-green-900/30",
  teal: "text-teal-600 bg-transparent hover:bg-teal-50 dark:hover:bg-teal-900/30",
  cyan: "text-cyan-600 bg-transparent hover:bg-cyan-50 dark:hover:bg-cyan-900/30",
  indigo: "text-indigo-600 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-900/30",
  violet: "text-violet-600 bg-transparent hover:bg-violet-50 dark:hover:bg-violet-900/30",
  rose: "text-rose-600 bg-transparent hover:bg-rose-50 dark:hover:bg-rose-900/30",
  amber: "text-amber-600 bg-transparent hover:bg-amber-50 dark:hover:bg-amber-900/30",
  lime: "text-lime-600 bg-transparent hover:bg-lime-50 dark:hover:bg-lime-900/30",
  slate: "text-slate-600 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-900/30",
  gray: "text-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-900/30",
  zinc: "text-zinc-600 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/30",
  neutral: "text-neutral-600 bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-900/30",
  stone: "text-stone-600 bg-transparent hover:bg-stone-50 dark:hover:bg-stone-900/30",
  fuchsia: "text-fuchsia-600 bg-transparent hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30",
  emerald: "text-emerald-600 bg-transparent hover:bg-emerald-50 dark:hover:bg-emerald-900/30",
} as const;

export const buttonSoftColors: Record<Color, string> = {
  default: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600 border-transparent disabled:bg-transparent",
  blue: "bg-blue-200 text-blue-800 hover:bg-blue-300 dark:bg-blue-900/50 dark:text-blue-200 dark:hover:bg-blue-900/70 border-transparent",
  purple: "bg-purple-200 text-purple-800 hover:bg-purple-300 dark:bg-purple-900/50 dark:text-purple-200 dark:hover:bg-purple-900/70 border-transparent",
  sky: "bg-sky-200 text-sky-800 hover:bg-sky-300 dark:bg-sky-900/50 dark:text-sky-200 dark:hover:bg-sky-900/70 border-transparent",
  red: "bg-red-200 text-red-800 hover:bg-red-300 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900/70 border-transparent",
  orange: "bg-orange-200 text-orange-800 hover:bg-orange-300 dark:bg-orange-900/50 dark:text-orange-200 dark:hover:bg-orange-900/70 border-transparent",
  yellow: "bg-yellow-200 text-yellow-800 hover:bg-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-200 dark:hover:bg-yellow-900/70 border-transparent",
  green: "bg-green-200 text-green-800 hover:bg-green-300 dark:bg-green-900/50 dark:text-green-200 dark:hover:bg-green-900/70 border-transparent",
  teal: "bg-teal-200 text-teal-800 hover:bg-teal-300 dark:bg-teal-900/50 dark:text-teal-200 dark:hover:bg-teal-900/70 border-transparent",
  cyan: "bg-cyan-200 text-cyan-800 hover:bg-cyan-300 dark:bg-cyan-900/50 dark:text-cyan-200 dark:hover:bg-cyan-900/70 border-transparent",
  indigo: "bg-indigo-200 text-indigo-800 hover:bg-indigo-300 dark:bg-indigo-900/50 dark:text-indigo-200 dark:hover:bg-indigo-900/70 border-transparent",
  violet: "bg-violet-200 text-violet-800 hover:bg-violet-300 dark:bg-violet-900/50 dark:text-violet-200 dark:hover:bg-violet-900/70 border-transparent",
  rose: "bg-rose-200 text-rose-800 hover:bg-rose-300 dark:bg-rose-900/50 dark:text-rose-200 dark:hover:bg-rose-900/70 border-transparent",
  amber: "bg-amber-200 text-amber-800 hover:bg-amber-300 dark:bg-amber-900/50 dark:text-amber-200 dark:hover:bg-amber-900/70 border-transparent",
  lime: "bg-lime-200 text-lime-800 hover:bg-lime-300 dark:bg-lime-900/50 dark:text-lime-200 dark:hover:bg-lime-900/70 border-transparent",
  slate: "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-900/50 dark:text-slate-200 dark:hover:bg-slate-900/70 border-transparent",
  gray: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-900/50 dark:text-gray-200 dark:hover:bg-gray-900/70 border-transparent",
  zinc: "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-900/50 dark:text-zinc-200 dark:hover:bg-zinc-900/70 border-transparent",
  neutral: "bg-neutral-200 text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-900/50 dark:text-neutral-200 dark:hover:bg-neutral-900/70 border-transparent",
  stone: "bg-stone-200 text-stone-800 hover:bg-stone-300 dark:bg-stone-900/50 dark:text-stone-200 dark:hover:bg-stone-900/70 border-transparent",
  fuchsia: "bg-fuchsia-200 text-fuchsia-800 hover:bg-fuchsia-300 dark:bg-fuchsia-900/50 dark:text-fuchsia-200 dark:hover:bg-fuchsia-900/70 border-transparent",
  emerald: "bg-emerald-200 text-emerald-800 hover:bg-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-200 dark:hover:bg-emerald-900/70 border-transparent",
} as const;

export const buttonSizes = {
  xs: "h-7 px-2 text-xs",
  sm: "h-9 px-3 text-sm",
  default: "h-10 px-4",
  lg: "h-12 px-6 text-lg",
  xl: "h-14 px-8 text-xl",
} as const;

export const baseClasses =
  "font-pop inline-flex select-none transition-all items-center justify-center whitespace-nowrap rounded-xl ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:border-none disabled:bg-transparent disabled:opacity-50 text-primary-foreground active:border-b-2 active:scale-y-95 border-x-2 border-t-2 border-b-[5px] origin-bottom shadow-sm";

export const iconBaseClasses = "inline-flex items-center justify-center shrink-0";

export function getIconSize(size: SizeVariant) {
  if (size === "xs" || size === "sm") return "w-3.5 h-3.5";
  if (size === "lg" || size === "xl") return "w-5 h-5";
  return "w-4 h-4";
}

const PopButton = React.forwardRef<
  HTMLButtonElement,
  PopButtonBaseProps
>(
  (
    {
      className,
      color = "default",
      size = "default",
      variant = "solid",
      children,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      keybind,
      disabled,
      onClick,
      ...props
    },
    ref,
  ) => {
    const { playClick } = useSound();
    const Comp = asChild ? Slot : "button";

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      playClick();
      onClick?.(e);
    };

    const keybindSymbols: Record<string, string> = {
      enter: "↵",
      escape: "esc",
      backspace: "⌫",
      shift: "⇧",
      ctrl: "ctrl",
      alt: "alt",
      tab: "tab",
      m: "M",
      e: "E",
    };

    const getKeybindDisplay = (key: string) => {
      return keybindSymbols[key.toLowerCase()] || key.toUpperCase();
    };

    const getKeybindSize = (btnSize: SizeVariant) => {
      if (btnSize === "xs" || btnSize === "sm") return "h-4 min-w-[16px] px-1 text-[8px]";
      if (btnSize === "lg" || btnSize === "xl") return "h-5 min-w-[20px] px-1.5 text-xs";
      return "h-4.5 min-w-[18px] px-1 text-[9px]";
    };

    const keybindClass = getKeybindSize(size);

    const variantStyles: Record<ButtonVariant, Record<Color, string>> = {
      solid: buttonColors,
      outline: buttonOutlineColors,
      ghost: buttonGhostColors,
      soft: buttonSoftColors,
      dashed: {
        ...buttonOutlineColors,
        default:
          "border-dashed border-neutral-300 text-neutral-900 hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-800",
        blue: "border-dashed border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30",
        purple: "border-dashed border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30",
        sky: "border-dashed border-sky-600 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/30",
        red: "border-dashed border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30",
        orange: "border-dashed border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30",
        yellow: "border-dashed border-yellow-600 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30",
        green: "border-dashed border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30",
        teal: "border-dashed border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30",
        cyan: "border-dashed border-cyan-600 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/30",
        indigo: "border-dashed border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30",
        violet: "border-dashed border-violet-600 text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30",
        rose: "border-dashed border-rose-600 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30",
        amber: "border-dashed border-amber-600 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30",
        lime: "border-dashed border-lime-600 text-lime-600 hover:bg-lime-50 dark:hover:bg-lime-900/30",
        slate: "border-dashed border-slate-600 text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-900/30",
        gray: "border-dashed border-gray-600 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900/30",
        zinc: "border-dashed border-zinc-600 text-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900/30",
        neutral: "border-dashed border-neutral-600 text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-900/30",
        stone: "border-dashed border-stone-600 text-stone-600 hover:bg-stone-50 dark:hover:bg-stone-900/30",
        fuchsia: "border-dashed border-fuchsia-600 text-fuchsia-600 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/30",
        emerald: "border-dashed border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30",
      },
    };

    const colorClasses = variantStyles[variant][color];
    const sizeClasses = buttonSizes[size];
    const iconClass = getIconSize(size);

    return (
      <Comp
        ref={ref}
        className={cn(baseClasses, colorClasses, sizeClasses, className)}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
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
            {children}
          </span>
        ) : (
          <span className="flex items-center gap-2">
            {leftIcon && <span className={iconClass}>{leftIcon}</span>}
            {children}
            {rightIcon && <span className={iconClass}>{rightIcon}</span>}
            {keybind && (
              <span
                className={cn(
                  "inline-flex items-center justify-center rounded-sm border border-b origin-bottom font-pop font-medium text-neutral-700 dark:text-neutral-300 bg-gray-200 dark:bg-neutral-700 border-neutral-400 dark:border-neutral-500",
                  keybindClass
                )}
              >
                {getKeybindDisplay(keybind)}
              </span>
            )}
          </span>
        )}
      </Comp>
    );
  },
);

PopButton.displayName = "PopButton";

export { PopButton };
