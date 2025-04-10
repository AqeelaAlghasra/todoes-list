import { Id } from "./_generated/dataModel";

// This will be populated after initialization
export let AI_LABEL_ID: Id<"labels"> | null = null;

export function setAiLabelId(id: Id<"labels">) {
    AI_LABEL_ID = id;
}

// This is where we'll store our secret
export const internalSecret = "6e22b28e18cb8b59eb2c76af40d08e5bf38fd88a402ea2185d64617b5a538bc2"; 