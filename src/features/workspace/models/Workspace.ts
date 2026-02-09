import { z } from "zod";

export const WorkspaceSchema = z.object({
    id: z.number(),
    name: z.string().default(""),
    description: z.string().default(""),
    ownerUserId: z.uuid(),
    createdAt: z.date().default(new Date()),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;
