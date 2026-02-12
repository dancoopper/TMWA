import { supabase } from "@/lib/supabase";
import { type Event } from "@/features/event/models/Event";
import { toEvent } from "@/features/event/mappers/toEvent";

export const eventRepository = {
    async getEvents(workspaceId: string) {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("workspace_id", workspaceId);
        if (error) throw error;
        return data.map(toEvent);
    },

    async getEventsByRange(workspaceId: string, startDate: Date, endDate: Date) {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("workspace_id", workspaceId)
            .gte("date", startDate.toISOString())
            .lte("date", endDate.toISOString());
        if (error) throw error;
        return data.map(toEvent);
    },

    async getEventById(id: string) {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("id", id)
            .single();
        if (error) throw error;
        return toEvent(data);
    },

    async updateEvent(id: string, updates: Partial<Event>) {
        const { data, error } = await supabase.from("events")
            .update({
                ...updates,
            })
            .eq("id", id)
            .single();
        if (error) throw error;
        return toEvent(data);
    },

    async deleteEvent(id: string) {
        const { error } = await supabase
            .from("events")
            .delete()
            .eq("id", id);
        if (error) throw error;
    },

    async createEvent(event: Event) {
        const { data, error } = await supabase
            .from("events")
            .insert([event])
            .select()
            .single();
        if (error) throw error;
        return toEvent(data);
    },

    async getEventsByWorkspaceId(workspaceId: string) {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("workspace_id", workspaceId);
        if (error) throw error;
        return data.map(toEvent);
    },

    async updateEventById(id: string, updates: Partial<Event>) {
        const { data, error } = await supabase
            .from("events")
            .update({
                ...updates,
            })
            .eq("id", id)
            .single();
        if (error) throw error;
        return toEvent(data);
    },
};
