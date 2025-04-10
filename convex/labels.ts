import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { handleUserId } from "./auth";

export const getLabels = query({
  args: {},
  handler: async (ctx) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      const userLabels = await ctx.db
        .query("labels")
        .filter((q) => q.eq(q.field("userId"), userId))
        .collect();

      const systemLabels = await ctx.db
        .query("labels")
        .filter((q) => q.eq(q.field("type"), "system"))
        .collect();

      return [...systemLabels, ...userLabels];
    }
    return [];
  },
});

export const getLabelByLabelId = query({
  args: {
    labelId: v.id("labels"),
  },
  handler: async (ctx, { labelId }) => {
    const userId = await handleUserId(ctx);
    if (userId) {
      const project = await ctx.db
        .query("labels")
        .filter((q) => q.eq(q.field("_id"), labelId))
        .collect();

      return project?.[0] || null;
    }
    return null;
  },
});

export const createALabel = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    try {
      const userId = await handleUserId(ctx);
      if (userId) {
        const newTaskId = await ctx.db.insert("labels", {
          userId,
          name,
          type: "user",
        });
        return newTaskId;
      }

      return null;
    } catch (err) {
      console.log("Error occurred during createALabel mutation", err);

      return null;
    }
  },
});

export const createSystemLabel = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, { name }) => {
    try {
      const newLabelId = await ctx.db.insert("labels", {
        userId: null,
        name,
        type: "system",
      });
      return newLabelId;
    } catch (err) {
      console.log("Error occurred during createSystemLabel mutation", err);
      return null;
    }
  },
});
