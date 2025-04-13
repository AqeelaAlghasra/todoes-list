import { mutation } from "./_generated/server";
import { api } from "./_generated/api";

export const initializeSystemLabels = mutation({
  args: {},
  handler: async (ctx) => {
    // Create the AI label if it doesn't exist
    const existingLabels = await ctx.db
      .query("labels")
      .filter((q) => q.eq(q.field("type"), "system"))
      .filter((q) => q.eq(q.field("name"), "AI Generated"))
      .collect();

    if (existingLabels.length === 0) {
      const aiLabelId = await ctx.db.insert("labels", {
        userId: null,
        name: "AI Generated",
        type: "system",
      });
      return { aiLabelId };
    }

    return { aiLabelId: existingLabels[0]._id };
  },
}); 