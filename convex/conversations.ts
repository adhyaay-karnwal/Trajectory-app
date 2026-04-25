import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

// ─── Queries ──────────────────────────────────────────────────────────────────

export const listRecent = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("conversations")
      .order("desc")
      .take(30);
  },
});

export const getMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .order("asc")
      .collect();
  },
});

// ─── Mutations ────────────────────────────────────────────────────────────────

export const create = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("conversations", {
      title: args.title,
      messageCount: 0,
      lastMessageAt: Date.now(),
      status: "idle",
    });
  },
});

export const addMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    clientMessageId: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    toolCalls: v.optional(v.array(v.any())),
    structuredCards: v.optional(v.array(v.any())),
    attachments: v.optional(
      v.array(
        v.object({
          fileName: v.string(),
          fileType: v.string(),
          fileSize: v.number(),
          storageId: v.string(),
          url: v.string(),
        }),
      ),
    ),
  },
  handler: async (ctx, args) => {
    const convo = await ctx.db.get(args.conversationId);
    if (!convo) throw new Error("Conversation not found");
    if (args.clientMessageId) {
      const existing = await ctx.db
        .query("messages")
        .withIndex("by_conversation_and_client_message_id", (q) =>
          q
            .eq("conversationId", args.conversationId)
            .eq("clientMessageId", args.clientMessageId),
        )
        .take(1);
      if (existing[0]) {
        await ctx.db.patch(existing[0]._id, {
          role: args.role,
          content: args.content,
          toolCalls: args.toolCalls,
          structuredCards: args.structuredCards,
          attachments: args.attachments,
        });
        await ctx.db.patch(args.conversationId, {
          lastMessageAt: Date.now(),
        });
        return existing[0]._id;
      }
    }
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      clientMessageId: args.clientMessageId,
      role: args.role,
      content: args.content,
      toolCalls: args.toolCalls,
      structuredCards: args.structuredCards,
      attachments: args.attachments,
    });

    // Create attachment records if any
    if (args.attachments) {
      for (const att of args.attachments) {
        await ctx.db.insert("attachments", {
          conversationId: args.conversationId,
          messageId,
          fileName: att.fileName,
          fileType: att.fileType,
          fileSize: att.fileSize,
          storageId: att.storageId,
          createdAt: Date.now(),
        });
      }
    }

    await ctx.db.patch(args.conversationId, {
      messageCount: convo.messageCount + 1,
      lastMessageAt: Date.now(),
    });
    return messageId;
  },
});

export const remove = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const convo = await ctx.db.get(args.conversationId);
    if (!convo) throw new Error("Conversation not found");
    // Delete all messages first
    const msgs = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .collect();
    await Promise.all(msgs.map((m) => ctx.db.delete(m._id)));
    // Delete all attachments for this conversation
    const attachments = await ctx.db
      .query("attachments")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .collect();
    await Promise.all(attachments.map((a) => ctx.db.delete(a._id)));
    await ctx.db.delete(args.conversationId);
  },
});

export const updateTitleForAgent = mutation({
  args: {
    conversationId: v.id("conversations"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const convo = await ctx.db.get(args.conversationId);
    if (!convo) throw new Error("Conversation not found");

    const nextTitle = args.title.trim();
    if (!nextTitle) throw new Error("Title cannot be empty");

    await ctx.db.patch(args.conversationId, {
      title: nextTitle,
      lastMessageAt: Date.now(),
    });
  },
});

// ─── File Upload ───────────────────────────────────────────────────────────────

export const getAttachmentUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId as Id<"_storage">);
    return url;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveAttachment = mutation({
  args: {
    conversationId: v.id("conversations"),
    storageId: v.id("_storage"),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
  },
  handler: async (ctx, args) => {
    const convo = await ctx.db.get(args.conversationId);
    if (!convo) throw new Error("Conversation not found");

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
      throw new Error("Failed to get URL for uploaded file");
    }

    await ctx.db.insert("attachments", {
      conversationId: args.conversationId,
      fileName: args.fileName,
      fileType: args.fileType,
      fileSize: args.fileSize,
      storageId: args.storageId,
      createdAt: Date.now(),
    });

    return {
      storageId: args.storageId,
      url,
      fileName: args.fileName,
      fileType: args.fileType,
      fileSize: args.fileSize,
    };
  },
});

export const setStatus = mutation({
  args: {
    conversationId: v.id("conversations"),
    status: v.union(v.literal("idle"), v.literal("generating"), v.literal("error")),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const convo = await ctx.db.get(args.conversationId);
    if (!convo) throw new Error("Conversation not found");

    await ctx.db.patch(args.conversationId, {
      status: args.status,
      errorMessage: args.errorMessage,
      lastMessageAt: Date.now(),
    });
  },
});
