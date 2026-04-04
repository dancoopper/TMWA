import { type Database } from '@/types/database.types';
import { normalizeEventColorKey } from '../eventColors';
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
        colorKey: normalizeEventColorKey(row.color_key),
    };

    return EventSchema.parse(mappedData);
}