import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

// User management - simplified for shared database without auth
// Onboarding is tracked via localStorage, not in the database

export const viewerProfile = query({
  args: {},
  handler: async (ctx) => {
    // Onboarding is tracked via localStorage
    return { status: 'ready' as const, onboardingCompleted: true, role: 'user' as const };
  },
});

export const completeOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    // Onboarding is tracked via localStorage, no-op
    return;
  },
});

/** Admin check - disabled for shared database */
export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    // No auth, no admin checks
    return false;
  },
});
