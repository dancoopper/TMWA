import { supabase } from "@/lib/supabase";
import { type Event } from "@/features/event/models/Event";
import { toEvent } from "@/features/event/mappers/toEvent";
import { type Database } from "@/types/database.types";

type EventInsert = Database["public"]["Tables"]["events"]["Insert"];

export type CreateEventInput = {
    workspaceId: number;
    templateId: number;
    title: string;
    date: Date;
    data: EventInsert["data"];
};

export type UpdateEventInput = {
    title?: string;
    date?: Date;
    data?: Database["public"]["Tables"]["events"]["Update"]["data"];
    templateId?: number;
};

export const eventRepository = {
    async getEvents(workspaceId: string) {
        const { data, error } = await supabase
            .from("events")
            .select("*")
            .eq("workspace_id", workspaceId);
        if (error) throw error;
        return data.map(toEvent);
    },

    async getEventsByRange(workspaceId: number, startDate: Date, endDate: Date): Promise<Event[]> {
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

    async updateEvent(id: number, updates: UpdateEventInput) {
        const payload: Database["public"]["Tables"]["events"]["Update"] = {};
        if (typeof updates.title === "string") payload.title = updates.title;
        if (updates.date) payload.date = updates.date.toISOString();
        if (updates.data !== undefined) payload.data = updates.data;
        if (typeof updates.templateId === "number") payload.template_id = updates.templateId;

        const { data, error } = await supabase.from("events")
            .update(payload)
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

    async createEvent(event: CreateEventInput) {
        const payload: EventInsert = {
            workspace_id: event.workspaceId,
            template_id: event.templateId,
            title: event.title,
            date: event.date.toISOString(),
            data: event.data,
        };

        const { data, error } = await supabase
            .from("events")
            .insert(payload)
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
