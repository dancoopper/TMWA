import { supabase } from "@/lib/supabase";
import { type Event } from "@/features/event/models/Event";


/*TODO: make sure that: 
    the users are authenticated before calling these functions
    they have to be authorized to access the events
    that when we delete the event, that they own the event*/
export const eventRepository = {

    async getEvents(workspaceId: string) {
        const { data, error } = await supabase.from("events").select("*").eq("workspace_id", workspaceId);
        if (error) throw error;
        return data;
    },
    async getEventById(id: string) {
        const { data, error } = await supabase.from("events").select("*").eq("id", id).single();
        if (error) throw error;
        return data;
    },
    async updateEvent(id: string, updates: Partial<Event>) {
        const { data, error } = await supabase.from("events").update({
            ...updates,
        }).eq("id", id).single();
        if (error) throw error;
        return data;
    },
    async deleteEvent(id: string) {
        const { data, error } = await supabase.from("events").delete().eq("id", id);
        if (error) throw error;
        return data;
    },
    async createEvent(event: Event) {
        const { data, error } = await supabase.from("events").insert({
            ...event,
        });
        if (error) throw error;
        return data;
    },
    async getEventsByUserId(userId: string) {
        const { data, error } = await supabase.from("events").select("*").eq("user_id", userId);
        if (error) throw error;
        return data;
    },
    async getEventsByWorkspaceId(workspaceId: string) {
        const { data, error } = await supabase.from("events").select("*").eq("workspace_id", workspaceId);
        if (error) throw error;
        return data;
    },
    async getEventsByTemplateId(templateId: number) {
        const { data, error } = await supabase.from("events").select("*").eq("template_id", templateId);
        if (error) throw error;
        return data;
    },
    async getEventsByWorkspaceIdAndTemplateId(workspaceId: string, templateId: number) {
        const { data, error } = await supabase.from("events").select("*").eq("workspace_id", workspaceId).eq("template_id", templateId);
        if (error) throw error;
        return data;
    },
    async getEventsByWorkspaceIdAndUserId(workspaceId: string, userId: string) {
        const { data, error } = await supabase.from("events").select("*").eq("workspace_id", workspaceId).eq("user_id", userId);
        if (error) throw error;
        return data;
    },
    async getEventsByWorkspaceIdAndTemplateIdAndUserId(workspaceId: string, templateId: number, userId: string) {
        const { data, error } = await supabase.from("events").select("*").eq("workspace_id", workspaceId).eq("template_id", templateId).eq("user_id", userId);
        if (error) throw error;
        return data;
    },

    async getEventsByWorkspaceIdAndTemplateIdAndUserIdAndEventId(workspaceId: string, templateId: number, userId: string, eventId: string) {
        const { data, error } = await supabase.from("events").select("*").eq("workspace_id", workspaceId).eq("template_id", templateId).eq("user_id", userId).eq("event_id", eventId);
        if (error) throw error;
        return data;
    },
    async updateEventById(id: string, updates: Partial<Event>) {
        const { data, error } = await supabase.from("events").update({
            ...updates,
        }).eq("id", id).single();
        if (error) throw error;
        return data;
    },
    async updateEventByIdAndWorkspaceId(id: string, workspaceId: string, updates: Partial<Event>) {
        const { data, error } = await supabase.from("events").update({
            ...updates,
        }).eq("id", id).eq("workspace_id", workspaceId).single();
        if (error) throw error;
        return data;
    },
    async updateEventByIdAndWorkspaceIdAndTemplateId(id: string, workspaceId: string, templateId: number, updates: Partial<Event>) {
        const { data, error } = await supabase.from("events").update({
            ...updates,
        }).eq("id", id).eq("workspace_id", workspaceId).eq("template_id", templateId).single();
        if (error) throw error;
        return data;
    },
    async updateEventByIdAndWorkspaceIdAndTemplateIdAndUserId(id: string, workspaceId: string, templateId: number, userId: string, updates: Partial<Event>) {
        const { data, error } = await supabase.from("events").update({
            ...updates,
        }).eq("id", id).eq("workspace_id", workspaceId).eq("template_id", templateId).eq("user_id", userId).single();
        if (error) throw error;
        return data;
    },
    async updateEventByIdAndWorkspaceIdAndTemplateIdAndUserIdAndEventId(id: string, workspaceId: string, templateId: number, userId: string, eventId: string, updates: Partial<Event>) {
        const { data, error } = await supabase.from("events").update({
            ...updates,
        }).eq("id", id).eq("workspace_id", workspaceId).eq("template_id", templateId).eq("user_id", userId).eq("event_id", eventId).single();
        if (error) throw error;
        return data;
    },
};
