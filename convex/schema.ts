import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  numbers: defineTable({
    value: v.number(),
  }),

  attachments: defineTable({
    conversationId: v.id("conversations"),
    messageId: v.optional(v.id("messages")),
    fileName: v.string(),
    fileType: v.string(),
    fileSize: v.number(),
    storageId: v.string(),
    url: v.optional(v.string()),
    tokenIdentifier: v.optional(v.string()),
    folderId: v.optional(v.id("vaultFolders")),
    createdAt: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_token", ["tokenIdentifier"])
    .index("by_folder", ["folderId"]),

  users: defineTable({
    tokenIdentifier: v.optional(v.string()),
    workosUserId: v.optional(v.string()),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    onboardingCompleted: v.boolean(),
    role: v.optional(v.union(v.literal("admin"), v.literal("user"))),
  }).index("by_token", ["tokenIdentifier"]).index("by_email", ["email"]),

  conversations: defineTable({
    tokenIdentifier: v.optional(v.string()),
    title: v.string(),
    messageCount: v.number(),
    lastMessageAt: v.number(),
    folderId: v.optional(v.id("vaultFolders")),
    status: v.optional(v.union(v.literal("idle"), v.literal("generating"), v.literal("error"))),
    errorMessage: v.optional(v.string()),
  }).index("by_token_and_time", ["tokenIdentifier", "lastMessageAt"]).index("by_folder", ["folderId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    clientMessageId: v.optional(v.string()),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    // Keep toolCalls and structuredCards permissive so legacy/experimental
    // agent traces do not fail schema validation and hide chats on reload.
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
  })
    .index("by_conversation", ["conversationId"])
    .index("by_conversation_and_client_message_id", [
      "conversationId",
      "clientMessageId",
    ]),

  userStats: defineTable({
    tokenIdentifier: v.optional(v.string()),
    chatVisits: v.float64(),
    launchVisits: v.optional(v.float64()),
    missionCount: v.optional(v.float64()),
    missionVisits: v.optional(v.float64()),
    planetsAnalyzed: v.optional(v.float64()),
    reportsGenerated: v.float64(),
    totalAnalyses: v.float64(),
    trajectoryVisits: v.optional(v.float64()),
    vaultVisits: v.float64(),
    // Legacy fields for migration
    proformaCount: v.optional(v.float64()),
    proformaVisits: v.optional(v.float64()),
    propertiesAnalyzed: v.optional(v.float64()),
    sitesVisits: v.optional(v.float64()),
    flowsVisits: v.optional(v.float64()),
  }).index("by_token", ["tokenIdentifier"]),

  // Vault: saved space missions
  vaultMissions: defineTable({
    tokenIdentifier: v.optional(v.string()),
    missionName: v.string(),
    destination: v.string(),
    missionType: v.union(v.literal("flyby"), v.literal("orbit"), v.literal("land"), v.literal("sample-return")),
    spacecraft: v.string(),
    crewSize: v.optional(v.number()),
    missionData: v.optional(v.string()), // JSON string of the full mission plan
    folderId: v.optional(v.id("vaultFolders")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_token", ["tokenIdentifier"]).index("by_folder", ["folderId"]),

  // Vault: saved celestial bodies/locations
  vaultCelestialBodies: defineTable({
    tokenIdentifier: v.optional(v.string()),
    name: v.string(),
    type: v.union(v.literal("planet"), v.literal("moon"), v.literal("asteroid"), v.literal("comet")),
    distanceFromEarth: v.optional(v.string()),
    notes: v.optional(v.string()),
    folderId: v.optional(v.id("vaultFolders")),
    createdAt: v.number(),
  }).index("by_token", ["tokenIdentifier"]).index("by_folder", ["folderId"]),

  // Vault: custom folders created by user
  vaultFolders: defineTable({
    tokenIdentifier: v.optional(v.string()),
    name: v.string(),
    parentId: v.optional(v.id("vaultFolders")),
    color: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_token", ["tokenIdentifier"]),

  // Vault: saved trajectories/orbital paths
  vaultTrajectories: defineTable({
    tokenIdentifier: v.optional(v.string()),
    name: v.string(),
    trajectoryData: v.string(), // JSON string of orbital path data
    folderId: v.optional(v.id("vaultFolders")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_token", ["tokenIdentifier"]).index("by_folder", ["folderId"]),

  // Trajectory execution run history
  trajectoryRuns: defineTable({
    tokenIdentifier: v.optional(v.string()),
    trajectoryId: v.id("vaultTrajectories"),
    status: v.union(v.literal("running"), v.literal("completed"), v.literal("failed")),
    triggerInputs: v.string(), // JSON
    nodeResults: v.string(),   // JSON: {[nodeId]: {status, output?, error?}}
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    error: v.optional(v.string()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_trajectory", ["trajectoryId"])
    .index("by_token_and_trajectory", ["tokenIdentifier", "trajectoryId"]),

  // Vault: saved reports (PDF, TXT, MD)
  vaultReports: defineTable({
    tokenIdentifier: v.optional(v.string()),
    name: v.string(),
    format: v.union(v.literal("pdf"), v.literal("txt"), v.literal("md")),
    content: v.string(), // The report content (text or markdown)
    // For PDF, we'll store it as base64 or reference to storage
    pdfData: v.optional(v.string()),
    folderId: v.optional(v.id("vaultFolders")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_token", ["tokenIdentifier"]).index("by_folder", ["folderId"]),

  // Vault: saved memories (notes, thoughts, learnings from the agent)
  vaultMemories: defineTable({
    tokenIdentifier: v.optional(v.string()),
    title: v.string(),
    content: v.string(), // The memory content (text or markdown)
    tags: v.optional(v.array(v.string())), // Optional tags for organizing memories
    folderId: v.optional(v.id("vaultFolders")),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_token", ["tokenIdentifier"]).index("by_folder", ["folderId"]),
});
