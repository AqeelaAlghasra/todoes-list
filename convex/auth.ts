import { Auth } from "convex/server";
import { Id } from "./_generated/dataModel";

async function getViewerId(ctx: { auth: Auth }) {
  const identity = await ctx.auth.getUserIdentity();
  
  if (identity === null) {
    return null;
  }

  return identity.subject as Id<"users">;
}

export async function handleUserId(ctx: { auth: Auth }) {
  const viewerId = await getViewerId(ctx);

  if (viewerId === null) {
    const userId='js721geg6tn7yymmhxtc6z91t97dgqn1'
    //console.error("user is not authenticated");
    return userId;
  }

  return viewerId;
}
