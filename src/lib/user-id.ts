/**
 * Client-side utility for managing user ID without auth
 * Uses localStorage to persist a unique identifier for the user
 */

export function getUserId(): string {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('userId', userId);
  }
  return userId;
}

export function getTokenIdentifier(): string {
  // Use userId as tokenIdentifier for Convex
  return getUserId();
}
