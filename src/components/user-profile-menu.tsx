"use client";

import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { api } from "@/../convex/_generated/api";
import { LogOutIcon, SettingsIcon, ShieldIcon } from "@/icons";
import { cn } from "@/lib/utils";

const itemStyles =
  "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800";

export function UserProfileMenu() {
  // No auth - return null to hide user menu
  return null;
}
