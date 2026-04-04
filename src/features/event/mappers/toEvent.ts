import { type Database } from '@/types/database.types';
import { type Event, EventSchema } from '../models/Event';

type EventRow = Database['public']['Tables']['events']['Row'];

export function toEvent(row: EventRow): Event {
    const start = new Date(row.date);
    const end = row.ends_at ? new Date(row.ends_at) : new Date(start.getTime() + 3_600_000);

    const mappedData = {
        id: row.id,
        data: row.data,
        templateId: row.template_id,
        workspaceId: row.workspace_id,
        start,
        end,
        title: row.title,
    };

    return EventSchema.parse(mappedData);
}