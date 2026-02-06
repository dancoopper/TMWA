import { z } from "zod";

export const WorkspaceMemberSchema = z.object({
    id: z.number(),
    workspaceId: z.number(),
    userId: z.string().uuid(),
    isOwner: z.boolean().default(false),
    createdAt: z.date().default(new Date()),
});

export type WorkspaceMember = z.infer<typeof WorkspaceMemberSchema>;
