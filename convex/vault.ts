import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

// ─── Types for Vault Items ───────────────────────────────────────────────────

export type VaultItemType = "proforma" | "site" | "attachment" | "conversation" | "report" | "flow" | "memory";

// ─── Queries ─────────────────────────────────────────────────────────────────

// Get all vault data for the graph
export const getVaultData = query({
  args: {},
  handler: async (ctx) => {
    // Get all data (shared database)
    const attachments = await ctx.db
      .query("attachments")
      .collect();

    // Get conversations
    const conversations = await ctx.db
      .query("conversations")
      .collect();

    // Get user stats
    const stats = await ctx.db
      .query("userStats")
      .first();

    // Get vault missions (replaces proformas)
    const vaultMissions = await ctx.db
      .query("vaultMissions")
      .collect();

    // Get vault celestial bodies (replaces sites)
    const vaultCelestialBodies = await ctx.db
      .query("vaultCelestialBodies")
      .collect();

    // Get custom folders
    const folders = await ctx.db
      .query("vaultFolders")
      .collect();

    // Get trajectories (replaces flows)
    const vaultTrajectories = await ctx.db
      .query("vaultTrajectories")
      .collect();

    // Get reports
    const vaultReports = await ctx.db
      .query("vaultReports")
      .collect();

    // Get memories
    const vaultMemories = await ctx.db
      .query("vaultMemories")
      .collect();

    return {
      attachments,
      conversations,
      stats,
      vaultMissions,
      vaultCelestialBodies,
      folders,
      vaultTrajectories,
      vaultReports,
      vaultMemories,
    };
  },
});

// Get attachment URL
export const getAttachmentUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId as Id<"_storage">);
    return url;
  },
});

// ─── Proforma CRUD - deprecated for Trajectory, replaced with Mission CRUD ───────────────────────────────────────────────────────────

// Create a custom folder
export const createVaultFolder = mutation({
  args: {
    name: v.string(),
    parentId: v.optional(v.id("vaultFolders")),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("vaultFolders", {
      name: args.name,
      parentId: args.parentId,
      color: args.color,
      createdAt: Date.now(),
    });
  },
});

// Delete a folder
export const deleteVaultFolder = mutation({
  args: { id: v.id("vaultFolders") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});

// Move item to folder
export const moveItemToFolder = mutation({
  args: {
    itemType: v.string(),
    itemId: v.string(),
    folderId: v.optional(v.id("vaultFolders")),
  },
  handler: async (ctx, args) => {
    // Use typed queries to get the item based on type
    if (args.itemType === "attachment") {
      const item = await ctx.db.get(args.itemId as Id<"attachments">);
      if (!item) throw new Error("Not found");
      await ctx.db.patch(args.itemId as Id<"attachments">, { folderId: args.folderId });
    } else if (args.itemType === "mission") {
      const item = await ctx.db.get(args.itemId as Id<"vaultMissions">);
      if (!item) throw new Error("Not found");
      await ctx.db.patch(args.itemId as Id<"vaultMissions">, { folderId: args.folderId });
    } else if (args.itemType === "celestialBody") {
      const item = await ctx.db.get(args.itemId as Id<"vaultCelestialBodies">);
      if (!item) throw new Error("Not found");
      await ctx.db.patch(args.itemId as Id<"vaultCelestialBodies">, { folderId: args.folderId });
    } else if (args.itemType === "conversation") {
      const item = await ctx.db.get(args.itemId as Id<"conversations">);
      if (!item) throw new Error("Not found");
      await ctx.db.patch(args.itemId as Id<"conversations">, { folderId: args.folderId });
    } else if (args.itemType === "report") {
      const item = await ctx.db.get(args.itemId as Id<"vaultReports">);
      if (!item) throw new Error("Not found");
      await ctx.db.patch(args.itemId as Id<"vaultReports">, { folderId: args.folderId });
    } else if (args.itemType === "memory") {
      const item = await ctx.db.get(args.itemId as Id<"vaultMemories">);
      if (!item) throw new Error("Not found");
      await ctx.db.patch(args.itemId as Id<"vaultMemories">, { folderId: args.folderId });
    }
  },
});

// Delete a report from vault
export const deleteVaultReport = mutation({
  args: { id: v.id("vaultReports") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});

// Delete an attachment
export const deleteVaultAttachment = mutation({
  args: { id: v.id("attachments") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (!item) throw new Error("Not found");

    // Delete from storage
    try {
      await ctx.storage.delete(item.storageId as Id<"_storage">);
    } catch (_e) {
      // Ignore storage deletion errors
    }

    await ctx.db.delete(args.id);
  },
});

// ─── Flow CRUD - deprecated for Trajectory, replaced with Trajectory CRUD ───────────────────────────────────────────────────────────────

// ─── Report CRUD ───────────────────────────────────────────────────────────────

// Get all reports for the user
export const getVaultReports = query({
  args: {},
  handler: async (ctx) => {
    const reports = await ctx.db
      .query("vaultReports")
      .collect();

    return reports;
  },
});

// Create a new report
export const createReport = mutation({
  args: {
    name: v.string(),
    format: v.union(v.literal("pdf"), v.literal("txt"), v.literal("md")),
    content: v.string(),
    pdfData: v.optional(v.string()),
    folderId: v.optional(v.id("vaultFolders")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const reportId = await ctx.db.insert("vaultReports", {
      name: args.name,
      format: args.format,
      content: args.content,
      pdfData: args.pdfData,
      folderId: args.folderId,
      createdAt: now,
      updatedAt: now,
    });

    return reportId;
  },
});

// Get a specific report
export const getReport = query({
  args: { id: v.id("vaultReports") },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.id);
    if (!report) throw new Error("Not found");

    return {
      _id: report._id,
      name: report.name,
      format: report.format,
      content: report.content,
      pdfData: report.pdfData,
      folderId: report.folderId,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    };
  },
});

// Update report (rename or update content)
export const updateReport = mutation({
  args: {
    id: v.id("vaultReports"),
    name: v.optional(v.string()),
    content: v.optional(v.string()),
    pdfData: v.optional(v.string()),
    folderId: v.optional(v.id("vaultFolders")),
  },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.id);
    if (!report) throw new Error("Not found");

    const updates: Record<string, unknown> = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) updates.name = args.name;
    if (args.content !== undefined) updates.content = args.content;
    if (args.pdfData !== undefined) updates.pdfData = args.pdfData;
    if (args.folderId !== undefined) updates.folderId = args.folderId;

    await ctx.db.patch(args.id, updates);
  },
});

// Delete a report
export const deleteReport = mutation({
  args: { id: v.id("vaultReports") },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.id);
    if (!report) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});

// Get a specific report for preview
export const getReportPreview = query({
  args: { id: v.id("vaultReports") },
  handler: async (ctx, args) => {
    const report = await ctx.db.get(args.id);
    if (!report) throw new Error("Not found");

    return {
      _id: report._id,
      name: report.name,
      format: report.format,
      content: report.content,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
    };
  },
});

// ─── Memory CRUD ───────────────────────────────────────────────────────────────

// Get all memories for the user
export const getVaultMemories = query({
  args: {},
  handler: async (ctx) => {
    const memories = await ctx.db
      .query("vaultMemories")
      .collect();

    return memories;
  },
});

// Create a new memory
export const createMemory = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    tags: v.optional(v.array(v.string())),
    folderId: v.optional(v.id("vaultFolders")),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const memoryId = await ctx.db.insert("vaultMemories", {
      title: args.title,
      content: args.content,
      tags: args.tags,
      folderId: args.folderId,
      createdAt: now,
      updatedAt: now,
    });

    return memoryId;
  },
});

// Get a specific memory
export const getMemory = query({
  args: { id: v.id("vaultMemories") },
  handler: async (ctx, args) => {
    const memory = await ctx.db.get(args.id);
    if (!memory) throw new Error("Not found");

    return {
      _id: memory._id,
      title: memory.title,
      content: memory.content,
      tags: memory.tags,
      folderId: memory.folderId,
      createdAt: memory.createdAt,
      updatedAt: memory.updatedAt,
    };
  },
});

// Update memory (rename or update content)
export const updateMemory = mutation({
  args: {
    id: v.id("vaultMemories"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    folderId: v.optional(v.id("vaultFolders")),
  },
  handler: async (ctx, args) => {
    const memory = await ctx.db.get(args.id);
    if (!memory) throw new Error("Not found");

    const updates: Record<string, unknown> = {
      updatedAt: Date.now(),
    };

    if (args.title !== undefined) updates.title = args.title;
    if (args.content !== undefined) updates.content = args.content;
    if (args.tags !== undefined) updates.tags = args.tags;
    if (args.folderId !== undefined) updates.folderId = args.folderId;

    await ctx.db.patch(args.id, updates);
  },
});

// Delete a memory
export const deleteMemory = mutation({
  args: { id: v.id("vaultMemories") },
  handler: async (ctx, args) => {
    const memory = await ctx.db.get(args.id);
    if (!memory) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});

// Get a specific memory for preview
export const getMemoryPreview = query({
  args: { id: v.id("vaultMemories") },
  handler: async (ctx, args) => {
    const memory = await ctx.db.get(args.id);
    if (!memory) throw new Error("Not found");

    return {
      _id: memory._id,
      title: memory.title,
      content: memory.content,
      tags: memory.tags,
      createdAt: memory.createdAt,
      updatedAt: memory.updatedAt,
    };
  },
});
