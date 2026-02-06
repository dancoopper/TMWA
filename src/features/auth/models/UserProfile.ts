import { z } from "zod";

export const UserProfileSchema = z.object({
    id: z.uuid(),
    firstName: z.string().default(""),
    lastName: z.string().default(""),
    isOnboarded: z.boolean().default(false),
    timezone: z.string().default("UTC"),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
