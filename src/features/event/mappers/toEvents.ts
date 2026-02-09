import { type Database } from '@/types/database.types';
import { type Event, EventSchema } from '../models/Event';

type EventRow = Database['public']['Tables']['events']['Row'];

export function toEvent(row: EventRow): Event {
    const mappedData = {
        id: row.id,
        event_data: row.event_data ?? '',
        template_id: row.template_id ?? null,
        workspace_id: row.workspace_id ?? null,
    };

    return EventSchema.parse(mappedData);
}