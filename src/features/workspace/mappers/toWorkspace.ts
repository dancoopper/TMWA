import { type Database } from '@/types/database.types';
import { type Workspace, WorkspaceSchema } from '../models/Workspace';

type WorkspaceRow = Database['public']['Tables']['workspaces']['Row'];

export function toWorkspace(row: WorkspaceRow): Workspace {
	const mappedData = {
		id: row.id,
		name: row.name ?? '',
		description: row.description ?? '',
		ownerUserId: row.owner_user_id ?? '',
		createdAt: new Date(row.created_at),
		updatedAt: new Date(row.updated_at),
	};

	return WorkspaceSchema.parse(mappedData);
}