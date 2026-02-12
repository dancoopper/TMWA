import { supabase } from "@/lib/supabase";
import { type Event } from "@/features/event/models/Event";
import { toEvent } from "@/features/event/mappers/toEvent";

export const eventRepository = {
    async getEvents(workspaceId: number) {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("workspace_id", workspaceId);
        if (error) throw error;
        return data.map(toEvent);
    },

    async getEventsByRange(workspaceId: number, startDate: Date, endDate: Date) {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("workspace_id", workspaceId)
            .gte("date", startDate.toISOString())
            .lte("date", endDate.toISOString());
        if (error) throw error;
        return data.map(toEvent);
    },

    async getEventById(id: number) {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("id", id)
            .single();
        if (error) throw error;
        return toEvent(data);
    },

    async updateEvent(id: number, updates: Partial<Event>) {
        // Map application model (camelCase) to DB columns (snake_case)
        const dbUpdates: any = {};
        if (updates.templateId !== undefined) dbUpdates.template_id = updates.templateId;
        if (updates.workspaceId !== undefined) dbUpdates.workspace_id = updates.workspaceId;
        if (updates.date !== undefined) dbUpdates.date = updates.date.toISOString();
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.data !== undefined) dbUpdates.data = updates.data;

        const { data, error } = await supabase.from("events")
            .update(dbUpdates)
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return toEvent(data);
    },

    async deleteEvent(id: number) {
        const { error } = await supabase
            .from("events")
            .delete()
            .eq("id", id);
        if (error) throw error;
    },

    async createEvent(event: Omit<Event, "id">) {
        const { data: eventData, error } = await supabase
            .from("events")
            .insert({
                template_id: event.templateId,
                workspace_id: event.workspaceId,
                date: event.date.toISOString(),
                title: event.title,
                data: event.data,
            })
            .select()
            .single();
        if (error) throw error;
        return toEvent(eventData);
    },

    async getEventsByWorkspaceId(workspaceId: number) {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("workspace_id", workspaceId);
        if (error) throw error;
        return data.map(toEvent);
    },
};
