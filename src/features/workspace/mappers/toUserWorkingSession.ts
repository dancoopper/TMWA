import { type Database } from '@/types/database.types';
import { type UserWorkingSession, UserWorkingSessionSchema } from '../models/UserWorkingSession';

type UserWorkingSessionRow = Database['public']['Tables']['user_working_sessions']['Row'];

export function toUserWorkingSession(row: UserWorkingSessionRow): UserWorkingSession {
    const mappedData = {
        id: row.id,
        userId: row.user_id ?? '',
        latestWorkspaceId: row.latest_workspace_id ? parseInt(row.latest_workspace_id, 10) : null,
    };

    return UserWorkingSessionSchema.parse(mappedData);
}
