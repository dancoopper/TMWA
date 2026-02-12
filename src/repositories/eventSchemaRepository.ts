import { supabase } from "@/lib/supabase";
import { type EventSchemas } from "@/features/event/models/EventSchemas";

export const eventSchemaRepository = {

    async getEventSchemaById(id: string) {
        const { data, error } = await supabase
            .from("event_schemas")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return data;
    },

    async createEventSchema(eventSchema: EventSchemas) {
        const { data, error } = await supabase
            .from("event_schemas")
            .insert([eventSchema])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateEventSchema(id: string, eventSchema: EventSchemas) {
        const { data, error } = await supabase
            .from("event_schemas")
            .update(eventSchema)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteEventSchema(id: string) {
        const { error } = await supabase
            .from("event_schemas")
            .delete()
            .eq("id", id);

        if (error) throw error;
    },

    async getEventSchemasByWorkspaceId(workspaceId: string) {
        const { data, error } = await supabase
            .from("event_schemas")
            .select("*")
            .eq("workspace_id", workspaceId);

        if (error) throw error;
        return data;
    },

    async getEventSchemasByUserId(userId: string) {
        const { data, error } = await supabase
            .from("event_schemas")
            .select("*")
            .eq("user_id", userId);

        if (error) throw error;
        return data;
    },

    async getEventSchemasByTemplateId(templateId: string) {
        const { data, error } = await supabase
            .from("event_schemas")
            .select("*")
            .eq("template_id", templateId);

        if (error) throw error;
        return data;
    },
};
