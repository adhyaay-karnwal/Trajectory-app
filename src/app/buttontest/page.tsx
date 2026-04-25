"use client";

import { PopButton, Color, SizeVariant, ButtonVariant } from "@/components/ui/pop-button";
import { PopDropdownButton, PopSplitButton, PopButtonGroup, DropdownOption } from "@/components/ui/pop-dropdown-button";
import { PopIconButton } from "@/components/ui/pop-icon-button";
import * as React from "react";

const colors: Color[] = [
  "default", "blue", "purple", "sky", "red", "orange", "yellow", "green", 
  "teal", "cyan", "indigo", "violet", "rose", "amber", "lime", "sky", 
  "slate", "gray", "zinc", "neutral", "stone", "fuchsia", "emerald"
];

const sizes: SizeVariant[] = ["xs", "sm", "default", "lg", "xl"];

const variants: ButtonVariant[] = ["solid", "outline", "ghost", "soft", "dashed"];

const dropdownOptions: DropdownOption[] = [
  { label: "Edit", value: "edit", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> },
  { label: "Duplicate", value: "duplicate", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> },
  { label: "Delete", value: "delete", disabled: true, danger: true, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> },
];

const ChevronIcon: React.ReactNode = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const SearchIcon: React.ReactNode = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const PlusIcon: React.ReactNode = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const StarIcon: React.ReactNode = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

export default function ButtonTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">PopButton Variants</h1>
          <p className="text-neutral-600 dark:text-neutral-400">Testing all button variants with default color</p>
          
          <div className="flex flex-wrap gap-4 items-center p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
            {variants.map((variant) => (
              <PopButton key={variant} variant={variant}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </PopButton>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Size Variants</h2>
          
          <div className="flex flex-wrap gap-4 items-end p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
            {sizes.map((size) => (
              <PopButton key={size} size={size}>
                Size {size}
              </PopButton>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Color Palette (Solid)</h2>
          
          <div className="flex flex-wrap gap-3 p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
            {colors.map((color) => (
              <PopButton key={color} color={color} variant="solid">
                {color}
              </PopButton>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Color Palette (Outline)</h2>
          
          <div className="flex flex-wrap gap-3 p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
            {colors.map((color) => (
              <PopButton key={color} color={color} variant="outline">
                {color}
              </PopButton>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Color Palette (Ghost)</h2>
          
          <div className="flex flex-wrap gap-3 p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
            {colors.map((color) => (
              <PopButton key={color} color={color} variant="ghost">
                {color}
              </PopButton>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Color Palette (Soft)</h2>
          
          <div className="flex flex-wrap gap-3 p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
            {colors.map((color) => (
              <PopButton key={color} color={color} variant="soft">
                {color}
              </PopButton>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Buttons with Icons</h2>
          
          <div className="flex flex-wrap gap-4 p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <PopButton leftIcon={PlusIcon}>Left Icon</PopButton>
            <PopButton rightIcon={ChevronIcon}>Right Icon</PopButton>
            <PopButton leftIcon={SearchIcon} rightIcon={ChevronIcon}>Both Icons</PopButton>
            <PopButton leftIcon={StarIcon} variant="solid" color="amber">Favorite</PopButton>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Loading State</h2>
          
          <div className="flex flex-wrap gap-4 p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <PopButton loading>Loading</PopButton>
            <PopButton loading leftIcon={PlusIcon}>Loading</PopButton>
            <PopButton loading variant="outline">Loading</PopButton>
            <PopButton loading variant="ghost">Loading</PopButton>
            <PopButton loading variant="soft" color="blue">Loading</PopButton>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Disabled State</h2>
          
          <div className="flex flex-wrap gap-4 p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <PopButton disabled>Disabled</PopButton>
            <PopButton disabled variant="outline">Disabled</PopButton>
            <PopButton disabled variant="ghost">Disabled</PopButton>
            <PopButton disabled variant="soft" color="green">Disabled</PopButton>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">PopDropdownButton</h2>
          
          <div className="flex flex-col gap-4 p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <div className="flex flex-wrap gap-4">
              <PopDropdownButton 
                options={dropdownOptions}
                onOptionSelect={(value, option) => console.log("Selected:", value, option)}
              >
                Dropdown
              </PopDropdownButton>
              <PopDropdownButton 
                options={dropdownOptions} 
                variant="outline"
                onOptionSelect={(value, option) => console.log("Selected:", value, option)}
              >
                Outline Dropdown
              </PopDropdownButton>
              <PopDropdownButton 
                options={dropdownOptions} 
                variant="ghost"
                onOptionSelect={(value, option) => console.log("Selected:", value, option)}
              >
                Ghost Dropdown
              </PopDropdownButton>
              <PopDropdownButton 
                options={dropdownOptions} 
                variant="soft" 
                color="blue"
                onOptionSelect={(value, option) => console.log("Selected:", value, option)}
              >
                Soft Dropdown
              </PopDropdownButton>
            </div>
            <div className="flex flex-wrap gap-4">
              <PopDropdownButton 
                options={dropdownOptions}
                portal={false}
              >
                No Portal
              </PopDropdownButton>
              <PopDropdownButton 
                options={dropdownOptions}
                align="start"
              >
                Align Start
              </PopDropdownButton>
              <PopDropdownButton 
                options={dropdownOptions}
                align="end"
              >
                Align End
              </PopDropdownButton>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">PopSplitButton</h2>
          
          <div className="flex flex-wrap gap-4 p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <PopSplitButton 
              options={dropdownOptions}
              onOptionSelect={(value, option) => console.log("Split selected:", value, option)}
            >
              Split
            </PopSplitButton>
            <PopSplitButton 
              options={dropdownOptions} 
              variant="outline"
              onOptionSelect={(value, option) => console.log("Split selected:", value, option)}
            >
              Outline Split
            </PopSplitButton>
            <PopSplitButton 
              options={dropdownOptions} 
              variant="soft" 
              color="green"
              onOptionSelect={(value, option) => console.log("Split selected:", value, option)}
            >
              Soft Split
            </PopSplitButton>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">PopButtonGroup</h2>
          
          <div className="flex flex-wrap gap-4 p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <PopButtonGroup
              buttons={[
                { label: "One", value: "one" },
                { label: "Two", value: "two" },
                { label: "Three", value: "three" },
              ]}
              onValueChange={(value) => console.log("Group selected:", value)}
            />
            <PopButtonGroup
              variant="outline"
              color="blue"
              buttons={[
                { label: "Day", value: "day", icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
                { label: "Week", value: "week" },
                { label: "Month", value: "month" },
              ]}
              onValueChange={(value) => console.log("Group selected:", value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">PopIconButton</h2>
          
          <div className="flex flex-wrap gap-4 p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <PopIconButton icon={PlusIcon} />
            <PopIconButton icon={SearchIcon} variant="outline" />
            <PopIconButton icon={StarIcon} variant="ghost" />
            <PopIconButton icon={ChevronIcon} variant="soft" color="blue" />
            <PopIconButton icon={PlusIcon} loading />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">PopIconButton Sizes</h2>
          
          <div className="flex flex-wrap gap-4 items-center p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
            {sizes.map((size) => (
              <PopIconButton key={size} size={size} icon={PlusIcon} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Controlled Dropdown</h2>
          
          <div className="flex flex-wrap gap-4 p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <PopDropdownButton 
              options={dropdownOptions}
              onOptionSelect={(value, option) => console.log("Controlled selected:", value, option)}
            >
              Default
            </PopDropdownButton>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Combined Examples</h2>
          
          <div className="flex flex-wrap gap-4 p-6 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <PopButton color="blue" variant="solid">
              {StarIcon}
              Starred
            </PopButton>
            <PopButton color="red" variant="outline" leftIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            }>
              Favorite
            </PopButton>
            <PopDropdownButton 
              options={dropdownOptions}
            >
              Search
            </PopDropdownButton>
            <PopIconButton 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>}
              variant="soft"
              color="emerald"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
