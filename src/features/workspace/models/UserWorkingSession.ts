import { z } from "zod";

export const UserWorkingSessionSchema = z.object({
    id: z.number(),
    userId: z.string().uuid(),
    latestWorkspaceId: z.number().nullable(),
});

export type UserWorkingSession = z.infer<typeof UserWorkingSessionSchema>;
