import { cn } from "@/lib/utils";
import { PopButton } from "./pop-button";
import {
  PopButtonBaseProps,
  getIconSize,
  baseClasses,
  buttonSizes,
  buttonColors,
  buttonOutlineColors,
  buttonGhostColors,
  buttonSoftColors,
  type ButtonVariant,
  type Color,
  type SizeVariant,
} from "./pop-button";
import * as React from "react";
import { createPortal } from "react-dom";

export interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
  danger?: boolean;
}

export interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onSelect?: () => void;
  danger?: boolean;
  items?: DropdownOption[];
}

export interface PopDropdownButtonProps
  extends Omit<PopButtonBaseProps, "leftIcon" | "rightIcon"> {
  triggerIcon?: React.ReactNode;
  options: DropdownOption[];
  onOptionSelect?: (value: string, option: DropdownOption) => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  defaultOpen?: boolean;
  align?: "start" | "center" | "end";
  sideOffset?: number;
  portal?: boolean;
}

const itemStyles =
  "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer hover:bg-gray-100 dark:hover:bg-neutral-800";

const itemDangerStyles = "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:text-red-400";

function DropdownContent({
  options,
  onOptionSelect,
  align,
  sideOffset,
  iconClass,
}: {
  options: DropdownOption[];
  onOptionSelect: (value: string, option: DropdownOption) => void;
  align: "start" | "center" | "end";
  sideOffset: number;
  iconClass: string;
}) {
  const alignClass =
    align === "start"
      ? "left-0"
      : align === "end"
        ? "right-0"
        : "left-1/2 -translate-x-1/2";

    const handleSelect = (value: string, option: DropdownOption) => {
      if (option.disabled) return;
      if (option.onSelect) {
        option.onSelect();
      }
      onOptionSelect(value, option);
    };

  return (
    <div
      className={cn(
        "absolute z-50 min-w-[180px] overflow-hidden rounded-xl border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900",
        "animate-in fade-in-0 zoom-in-95",
        alignClass
      )}
      style={{
        top: `calc(100% + ${sideOffset}px)`,
        [align === "start" ? "left" : align === "end" ? "right" : "left"]:
          align === "center" ? "50%" : "0",
        transform:
          align === "center"
            ? "translateX(-50%) scale(1)"
            : "scale(1)",
      }}
    >
      {options.map((option) => (
        <div
          key={option.value}
          onClick={() => handleSelect(option.value, option)}
          className={cn(
            itemStyles,
            option.disabled && "pointer-events-none opacity-50",
            option.danger && itemDangerStyles
          )}
        >
          {option.icon && (
            <span className={cn("mr-2 flex items-center", iconClass)}>
              {option.icon}
            </span>
          )}
          {option.label}
        </div>
      ))}
    </div>
  );
}

export const PopDropdownButton = React.forwardRef<
  HTMLButtonElement,
  PopDropdownButtonProps
>(
  (
    {
      className,
      color = "default",
      size = "default",
      variant = "solid",
      children,
      triggerIcon,
      options,
      onOptionSelect,
      onOpenChange,
      open: controlledOpen,
      defaultOpen = false,
      align = "center",
      sideOffset = 8,
      portal = true,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const [activeHighlight, setActiveHighlight] = React.useState<string | null>(null);
    
    const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
    const isControlled = controlledOpen !== undefined;
    
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const iconClass = getIconSize(size);

    const setOpen = (value: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(value);
      }
      onOpenChange?.(value);
    };

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setOpen(false);
          triggerRef.current?.focus();
        }
      };

      const handleKeyDown = (event: KeyboardEvent) => {
        if (!isOpen) return;
        
        const items = options.map(o => o.value);
        const currentIndex = activeHighlight ? items.indexOf(activeHighlight) : -1;
        
        if (event.key === "ArrowDown") {
          event.preventDefault();
          const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
          setActiveHighlight(items[nextIndex]);
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
          setActiveHighlight(items[prevIndex]);
        } else if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (activeHighlight) {
            const option = options.find(o => o.value === activeHighlight);
            if (option && !option.disabled) {
              handleOptionSelect(option.value, option);
            }
          }
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
        document.addEventListener("keydown", handleKeyDown);
        setActiveHighlight(options[0]?.value || null);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [isOpen, options, activeHighlight]);

    const handleOptionSelect = (value: string, option: DropdownOption) => {
      if (option.disabled) return;
      if (option.onSelect) {
        option.onSelect();
      }
      onOptionSelect?.(value, option);
      setOpen(false);
      triggerRef.current?.focus();
    };

    const handleButtonClick = () => {
      if (disabled) return;
      setOpen(!isOpen);
    };

    const handleButtonKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "ArrowDown" && !isOpen) {
        event.preventDefault();
        setOpen(true);
      }
    };

    const variantStyles: Record<ButtonVariant, Record<Color, string>> = {
      solid: buttonColors,
      outline: buttonOutlineColors,
      ghost: buttonGhostColors,
      soft: buttonSoftColors,
      dashed: buttonOutlineColors,
    };

    const buttonColorClass = variantStyles[variant][color];

    const dropdownContent = (
      <DropdownContent
        options={options}
        onOptionSelect={handleOptionSelect}
        align={align}
        sideOffset={sideOffset}
        iconClass={iconClass}
      />
    );

    return (
      <div ref={dropdownRef} className={cn("relative inline-flex", className)}>
        <PopButton
          ref={(node) => {
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            triggerRef.current = node;
          }}
          color={color}
          size={size}
          variant={variant}
          onClick={handleButtonClick}
          onKeyDown={handleButtonKeyDown}
          className="gap-2"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          rightIcon={
            triggerIcon || (
              <svg
                className={cn(iconClass, "transition-transform", isOpen && "rotate-180")}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )
          }
          {...props}
        >
          {children}
        </PopButton>

        {isOpen && (
          portal ? createPortal(dropdownContent, document.body) : dropdownContent
        )}
      </div>
    );
  }
);

PopDropdownButton.displayName = "PopDropdownButton";

export interface PopSplitButtonProps
  extends Omit<PopButtonBaseProps, "leftIcon" | "rightIcon"> {
  onOptionSelect?: (value: string, option: DropdownOption) => void;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
  defaultOpen?: boolean;
  options: DropdownOption[];
}

export const PopSplitButton = React.forwardRef<
  HTMLButtonElement,
  PopSplitButtonProps
>(
  (
    {
      className,
      color = "default",
      size = "default",
      variant = "solid",
      children,
      onOptionSelect,
      onOpenChange,
      open: controlledOpen,
      defaultOpen = false,
      options,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const primaryRef = React.useRef<HTMLButtonElement>(null);
    const splitRef = React.useRef<HTMLButtonElement>(null);
    const iconClass = getIconSize(size);

    const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
    const isControlled = controlledOpen !== undefined;

    const setOpen = (value: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(value);
      }
      onOpenChange?.(value);
    };

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      };

      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setOpen(false);
          splitRef.current?.focus();
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }, [isOpen]);

    const handleOptionSelect = (option: DropdownOption) => {
      if (option.disabled) return;
      if (option.onSelect) {
        option.onSelect();
      }
      onOptionSelect?.(option.value, option);
      setOpen(false);
      splitRef.current?.focus();
    };

    const variantStyles: Record<ButtonVariant, Record<Color, string>> = {
      solid: buttonColors,
      outline: buttonOutlineColors,
      ghost: buttonGhostColors,
      soft: buttonSoftColors,
      dashed: buttonOutlineColors,
    };

    const buttonColorClass = variantStyles[variant][color];

    return (
      <div ref={dropdownRef} className={cn("inline-flex rounded-xl", className)}>
        <button
          ref={(node) => {
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            primaryRef.current = node;
          }}
          disabled={disabled}
          className={cn(
            baseClasses,
            buttonSizes[size],
            "rounded-r-none border-r-0",
            buttonColorClass,
            "disabled:opacity-50 disabled:pointer-events-none"
          )}
          {...props}
        >
          <span className="flex items-center gap-2">{children}</span>
        </button>

        <button
          ref={splitRef}
          onClick={() => !disabled && setOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            baseClasses,
            buttonSizes[size],
            "rounded-l-none border-l-0",
            buttonColorClass,
            "disabled:opacity-50 disabled:pointer-events-none"
          )}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <svg
            className={cn(iconClass, "transition-transform", isOpen && "rotate-180")}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen &&
          createPortal(
            <div
              className={cn(
                "absolute z-50 min-w-[180px] overflow-hidden rounded-xl border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900",
                "animate-in fade-in-0 zoom-in-95",
                "right-0"
              )}
              style={{
                position: "absolute",
                top: `calc(100% + 8px)`,
                right: 0,
              }}
            >
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleOptionSelect(option)}
                  className={cn(
                    itemStyles,
                    option.disabled && "pointer-events-none opacity-50",
                    option.danger && itemDangerStyles
                  )}
                >
                  {option.icon && (
                    <span className={cn("mr-2 flex items-center", iconClass)}>
                      {option.icon}
                    </span>
                  )}
                  {option.label}
                </div>
              ))}
            </div>,
            document.body
          )}
      </div>
    );
  }
);

PopSplitButton.displayName = "PopSplitButton";

export interface PopButtonGroupProps {
  className?: string;
  color?: Color;
  size?: SizeVariant;
  variant?: ButtonVariant;
  buttons: Array<{
    label: string;
    value: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
  }>;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

export const PopButtonGroup = React.forwardRef<
  HTMLDivElement,
  PopButtonGroupProps
>(
  (
    {
      className,
      color = "default",
      size = "default",
      variant = "solid",
      buttons,
      value,
      onValueChange,
      disabled,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState(value || "");
    const iconClass = getIconSize(size);

    const currentValue = value !== undefined ? value : internalValue;

    const handleClick = (button: PopButtonGroupProps["buttons"][0]) => {
      if (button.disabled || disabled) return;
      if (button.onClick) {
        button.onClick();
      }
      setInternalValue(button.value);
      onValueChange?.(button.value);
    };

    const variantStyles: Record<ButtonVariant, Record<Color, string>> = {
      solid: buttonColors,
      outline: buttonOutlineColors,
      ghost: buttonGhostColors,
      soft: buttonSoftColors,
      dashed: buttonOutlineColors,
    };

    const buttonColorClass = variantStyles[variant][color];

    return (
      <div
        className={cn("inline-flex rounded-xl overflow-hidden", className)}
        role="group"
        {...props}
      >
        {buttons.map((button, index) => (
          <button
            key={button.value}
            onClick={() => handleClick(button)}
            disabled={button.disabled || disabled}
            className={cn(
              baseClasses,
              buttonSizes[size],
              index === 0 && "rounded-r-none border-r-0",
              index === buttons.length - 1 && "rounded-l-none border-l-0",
              index > 0 && index < buttons.length && "border-x-0 rounded-none",
              currentValue === button.value
                ? buttonColorClass
                : variant === "ghost" || variant === "soft"
                  ? variantStyles[variant][color]
                  : "bg-transparent text-neutral-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800",
              "disabled:opacity-50 disabled:pointer-events-none"
            )}
          >
            {button.icon && (
              <span className={cn("mr-2 flex items-center", iconClass)}>
                {button.icon}
              </span>
            )}
            {button.label}
          </button>
        ))}
      </div>
    );
  }
);

PopButtonGroup.displayName = "PopButtonGroup";
