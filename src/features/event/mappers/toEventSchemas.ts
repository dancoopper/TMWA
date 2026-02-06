import { type Database } from '@/types/database.types';
import { type EventSchemas, EventSchemasSchema } from '../models/EventSchemas';

type EventSchemaRow = Database['public']['Tables']['event_schemas']['Row'];

export function toEventSchemas(row: EventSchemaRow): EventSchemas {
    const mappedData = {
        id: row.id,
        created_at: row.created_at ?? '',
        schema_data: row.schema_data ?? '',
        user_id: row.user_id ?? '',
    };

    return EventSchemasSchema.parse(mappedData);
}