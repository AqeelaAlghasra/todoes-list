import type {
  Adapter,
  AdapterAccount,
  AdapterAuthenticator,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/adapters";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { FunctionArgs, FunctionReference } from "convex/server";
import { api } from "../convex/_generated/api";
import { Doc, Id } from "../convex/_generated/dataModel";
import { ConvexClient } from "convex/browser";
import { internalSecret } from "../convex/constants"

type User = AdapterUser & { id: Id<"users"> };
type Session = AdapterSession & { userId: Id<"users"> };
type Account = AdapterAccount & { userId: Id<"users"> };
type Authenticator = Omit<AdapterAuthenticator, 'transports'> & { 
  userId: Id<"users">;
  transports?: string;
};

type DBUser = Doc<"users"> & {
  name?: string | null;
  emailVerified?: number | null;
  image?: string | null;
  email: string;
};

type DBSession = Doc<"sessions"> & {
  sessionToken: string;
  userId: Id<"users">;
  expires: number;
};

type DBVerificationToken = {
  identifier: string;
  token: string;
  expires: number;
};

type UpdateUserFields = {
  name?: string | null;
  email?: string | null;
  emailVerified?: number | null;
  image?: string | null;
};

// Export the adapter as a named constant
export const ConvexAdapter: Adapter = {
  async createUser(data) {
    const id = await callMutation(api.authAdapter.createUser, { 
      user: {
        email: data.email,
        name: data.name ?? undefined, // Ensure that name is undefined if not provided
        image: data.image ?? undefined, // Ensure that image is undefined if not provided
        emailVerified: data.emailVerified ? data.emailVerified.getTime() : undefined // Handle emailVerified as a date (in ms)
      }
    });
    return { ...data, id } as AdapterUser;
  },

  async getUser(id) {
    const user = await callQuery(api.authAdapter.getUser, { id: id as Id<"users"> });
    if (!user) return null;
    return {
      id: user._id,
      email: user.email,
      emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
      name: user.name ?? null,
      image: user.image ?? null
    };
  },

  async getUserByEmail(email) {
    const user = await callQuery(api.authAdapter.getUserByEmail, { email });
    if (!user) return null;
    return {
      id: user._id,
      email: user.email,
      emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
      name: user.name ?? null,
      image: user.image ?? null
    };
  },

  async getUserByAccount({ providerAccountId, provider }) {
    const user = await callQuery(api.authAdapter.getUserByAccount, { providerAccountId, provider });
    if (!user) return null;
    return {
      id: user._id,
      email: user.email,
      emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
      name: user.name ?? null,
      image: user.image ?? null
    };
  },

  async updateUser(user) {
    const updateFields: UpdateUserFields = {};
    
    if (user.name !== undefined) updateFields.name = user.name ?? undefined; // Ensure correct handling of undefined values
    if (user.email !== undefined) updateFields.email = user.email ?? undefined;
    if (user.emailVerified !== undefined) updateFields.emailVerified = user.emailVerified ? user.emailVerified.getTime() : undefined; 
    if (user.image !== undefined) updateFields.image = user.image ?? undefined;

    const updated = await callMutation(api.authAdapter.updateUser, { 
      user: {
        id: user.id as Id<"users">,
        ...toDB(updateFields)
      }
    });

    if (!updated) throw new Error("Failed to update user");

    const dbUser = updated as DBUser;
    return {
      id: dbUser._id,
      email: dbUser.email,
      emailVerified: dbUser.emailVerified ? new Date(dbUser.emailVerified) : null,
      name: dbUser.name ?? null,
      image: dbUser.image ?? null
    };
  },

  async deleteUser(userId) {
    await callMutation(api.authAdapter.deleteUser, { id: userId as Id<"users"> });
  },

  async linkAccount(account) {
    await callMutation(api.authAdapter.linkAccount, { 
      account: {
        ...account,
        userId: account.userId as Id<"users">
      }
    });
  },

  async unlinkAccount({ providerAccountId, provider }) {
    await callMutation(api.authAdapter.unlinkAccount, { providerAccountId, provider });
  },

  async createSession(data) {
    const session = {
      sessionToken: data.sessionToken,
      userId: data.userId as Id<"users">,
      expires: data.expires.getTime()
    };
    const id = await callMutation(api.authAdapter.createSession, { session });
    return { ...data, id };
  },

  async getSessionAndUser(sessionToken) {
    const result = await callQuery(api.authAdapter.getSessionAndUser, { sessionToken });
    if (!result) return null;

    const { user, session } = result;
    return {
      user: {
        id: user._id,
        email: user.email,
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
        name: user.name ?? null,
        image: user.image ?? null
      },
      session: {
        id: session._id,
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: new Date(session.expires)
      }
    };
  },

  async updateSession({ sessionToken, expires }) {
    if (!expires) return null;
    
    const data = {
      sessionToken,
      expires: expires.getTime()
    };

    const updated = await callMutation(api.authAdapter.updateSession, { session: data }) as DBSession | null;
    if (!updated) return null;
    
    return {
      id: updated._id,
      sessionToken: updated.sessionToken,
      userId: updated.userId,
      expires: new Date(updated.expires)
    };
  },

  async deleteSession(sessionToken) {
    await callMutation(api.authAdapter.deleteSession, { sessionToken });
  },

  async createVerificationToken(verificationToken) {
    const token = {
      identifier: verificationToken.identifier,
      token: verificationToken.token,
      expires: verificationToken.expires.getTime()
    };
    await callMutation(api.authAdapter.createVerificationToken, { verificationToken: token });
    return verificationToken;
  },

  async useVerificationToken({ identifier, token }) {
    const verificationToken = await callMutation(api.authAdapter.useVerificationToken, {
      identifier,
      token
    }) as DBVerificationToken | null;
    
    if (!verificationToken) return null;
    return {
      identifier: verificationToken.identifier,
      token: verificationToken.token,
      expires: new Date(verificationToken.expires)
    };
  },

  async createAuthenticator(authenticator: Authenticator) {
    await callMutation(api.authAdapter.createAuthenticator, { authenticator });
    return authenticator as AdapterAuthenticator;
  },

  async getAuthenticator(credentialID) {
    return await callQuery(api.authAdapter.getAuthenticator, { credentialID });
  },

  async listAuthenticatorsByUserId(userId: Id<"users">) {
    return await callQuery(api.authAdapter.listAuthenticatorsByUserId, {
      userId,
    });
  },

  async updateAuthenticatorCounter(credentialID, newCounter) {
    return await callMutation(api.authAdapter.updateAuthenticatorCounter, {
      credentialID,
      newCounter,
    });
  },
};

// Helper functions for query and mutation

function callQuery<Query extends FunctionReference<"query">>(
  query: Query,
  args: Omit<FunctionArgs<Query>, "secret">
) {
  return fetchQuery(query, { ...args, secret: internalSecret } as any);
}

function callMutation<Mutation extends FunctionReference<"mutation">>(
  mutation: Mutation,
  args: Omit<FunctionArgs<Mutation>, "secret">
) {
  return fetchMutation(mutation, { ...args, secret: internalSecret } as any);
}

function toDB<T extends object>(
  obj: T
): {
  [K in keyof T]: T[K] extends Date
    ? number
    : null extends T[K]
      ? undefined
      : T[K];
} {
  const result: any = {};
  for (const key in obj) {
    const value = obj[key];
    result[key] =
      value instanceof Date
        ? value.getTime()
        : value === null
          ? undefined
          : value;
  }
  return result;
}

