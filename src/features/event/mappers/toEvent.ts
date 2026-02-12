import { type Database } from '@/types/database.types';
import { type Event, EventSchema } from '../models/Event';

type EventRow = Database['public']['Tables']['events']['Row'];

export function toEvent(row: EventRow): Event {
    const mappedData = {
        id: row.id,
        data: row.data,
        templateId: row.template_id,
        workspaceId: row.workspace_id,
        date: new Date(row.date),
        title: row.title,
    };

    return EventSchema.parse(mappedData);
}