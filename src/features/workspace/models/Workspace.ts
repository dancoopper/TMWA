import { z } from "zod";

export const WorkspaceSchema = z.object({
    id: z.uuid(),
    name: z.string().default(""),
    description: z.string().default(""),
    createdAt: z.date().default(new Date()),
    updatedAt: z.date().nullable().default(null),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;
