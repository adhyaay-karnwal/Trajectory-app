import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

// ─── Trajectory Runs (replaces Flow Runs) ────────────────────────────────────────────────────────────────

export const createTrajectoryRun = mutation({
  args: {
    trajectoryId: v.id("vaultTrajectories"),
    triggerInputs: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("trajectoryRuns", {
      trajectoryId: args.trajectoryId,
      status: "running",
      triggerInputs: args.triggerInputs,
      nodeResults: "{}",
      startedAt: Date.now(),
    });
  },
});

export const updateTrajectoryRun = mutation({
  args: {
    id: v.id("trajectoryRuns"),
    status: v.optional(v.union(v.literal("running"), v.literal("completed"), v.literal("failed"))),
    nodeResults: v.optional(v.string()),
    error: v.optional(v.string()),
    completedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const run = await ctx.db.get(args.id);
    if (!run) throw new Error("Not found");
    const patch: Record<string, unknown> = {};
    if (args.status !== undefined) patch.status = args.status;
    if (args.nodeResults !== undefined) patch.nodeResults = args.nodeResults;
    if (args.error !== undefined) patch.error = args.error;
    if (args.completedAt !== undefined) patch.completedAt = args.completedAt;
    await ctx.db.patch(args.id, patch);
  },
});

export const getTrajectoryRuns = query({
  args: { trajectoryId: v.id("vaultTrajectories") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("trajectoryRuns")
      .withIndex("by_trajectory", (q) =>
        q.eq("trajectoryId", args.trajectoryId),
      )
      .order("desc")
      .take(10);
  },
});
