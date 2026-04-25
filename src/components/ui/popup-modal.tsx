"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { PopButton, type Color, type ButtonVariant } from "@/components/ui/pop-button";

export interface PopupModalAction {
  label: string;
  onClick: () => void;
  color?: Color;
  variant?: ButtonVariant;
  disabled?: boolean;
}

export interface PopupModalProps {
  title: string;
  onClose?: () => void;
  children: React.ReactNode;
  actions: PopupModalAction[];
  maxWidth?: string;
  className?: string;
}

/**
 * A modern unified popup modal with a "rectangle in a rectangle" design.
 * The outer rectangle contains the title and action buttons.
 * The inner rectangle contains the main content.
 */
export function PopupModal({
  title,
  onClose,
  children,
  actions,
  maxWidth = "max-w-sm",
  className,
}: PopupModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/70"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative w-full rounded-xl overflow-hidden",
          "bg-white dark:bg-[#1c1c1c]",
          "border-[3px] border-double border-neutral-300 dark:border-neutral-600",
          "shadow-2xl",
          maxWidth,
          className
        )}
      >
        {/* Inner rectangle — includes title and main content */}
        <div className="mx-1 mt-1 rounded-lg bg-[#f0f0f0] dark:bg-[#282828] px-4 pt-4 pb-6">
          <h3 className="font-canela text-base font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h3>
          {children}
        </div>

        {/* Action buttons — live in the outer rectangle */}
        <div className="flex justify-end gap-2 px-3 py-3">
          {actions.map((action) => (
            <PopButton
              key={action.label}
              size="sm"
              color={action.color ?? "default"}
              variant={action.variant ?? "solid"}
              disabled={action.disabled}
              onClick={action.onClick}
            >
              {action.label}
            </PopButton>
          ))}
        </div>
      </div>
    </div>
  );
}
