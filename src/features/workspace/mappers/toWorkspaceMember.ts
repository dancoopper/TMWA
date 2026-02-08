import { type Database } from '@/types/database.types';
import { type WorkspaceMember, WorkspaceMemberSchema } from '../models/WorkspaceMember';

type WorkspaceMemberRow = Database['public']['Tables']['workspace_members']['Row'];

export function toWorkspaceMember(row: WorkspaceMemberRow): WorkspaceMember {
    const mappedData = {
        id: row.id,
        workspaceId: row.workspace_id ?? 0,
        userId: row.user_id ?? '',
        isOwner: row.is_owner,
        createdAt: new Date(row.created_at),
    };

    return WorkspaceMemberSchema.parse(mappedData);
}
