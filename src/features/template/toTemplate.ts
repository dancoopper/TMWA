import { type Database } from '@/types/database.types';
import { type Template, TemplateSchema } from './Template';

type TemplateRow = Database['public']['Tables']['templates']['Row'];

export function toTemplate(row: TemplateRow): Template {
    const mappedData = {
        id: row.id,
        createdAt: row.created_at,
        data: row.data,
        userId: row.user_id,
    };

    return TemplateSchema.parse(mappedData);
}