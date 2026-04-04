import { supabase } from "@/lib/supabase";

export type AvailabilityShare = {
    id: string;
    workspaceId: number;
    createdBy: string;
    startDate: string; // ISO date string "YYYY-MM-DD"
    endDate: string;
    label: string | null;
    createdAt: string;
};

export type Booking = {
    id: string;
    shareId: string;
    bookerName: string;
    bookerEmail: string;
    bookedSlotStart: string; // ISO timestamptz
    bookedSlotEnd: string;
    createdAt: string;
};

export const availabilityShareRepository = {
    async createShare(
        workspaceId: number,
        createdBy: string,
        startDate: Date,
        endDate: Date,
        label?: string,
    ): Promise<AvailabilityShare> {
        const { data, error } = await supabase
            .from("availability_shares")
            .insert({
                workspace_id: workspaceId,
                created_by: createdBy,
                start_date: startDate.toISOString().split("T")[0],
                end_date: endDate.toISOString().split("T")[0],
                label: label ?? null,
            })
            .select()
            .single();

        if (error) throw error;
        return {
            id: data.id,
            workspaceId: data.workspace_id,
            createdBy: data.created_by,
            startDate: data.start_date,
            endDate: data.end_date,
            label: data.label,
            createdAt: data.created_at,
        };
    },

    async getShareById(shareId: string): Promise<AvailabilityShare> {
        const { data, error } = await supabase
            .from("availability_shares")
            .select("*")
            .eq("id", shareId)
            .single();

        if (error) throw error;
        return {
            id: data.id,
            workspaceId: data.workspace_id,
            createdBy: data.created_by,
            startDate: data.start_date,
            endDate: data.end_date,
            label: data.label,
            createdAt: data.created_at,
        };
    },

    async createBooking(
        shareId: string,
        bookerName: string,
        bookerEmail: string,
        slotStart: Date,
        slotEnd: Date,
    ): Promise<Booking> {
        const { data, error } = await supabase
            .from("bookings")
            .insert({
                share_id: shareId,
                booker_name: bookerName,
                booker_email: bookerEmail,
                booked_slot_start: slotStart.toISOString(),
                booked_slot_end: slotEnd.toISOString(),
            })
            .select()
            .single();

        if (error) throw error;
        return {
            id: data.id,
            shareId: data.share_id,
            bookerName: data.booker_name,
            bookerEmail: data.booker_email,
            bookedSlotStart: data.booked_slot_start,
            bookedSlotEnd: data.booked_slot_end,
            createdAt: data.created_at,
        };
    },

    async getBookingsForShare(shareId: string): Promise<Booking[]> {
        const { data, error } = await supabase
            .from("bookings")
            .select("*")
            .eq("share_id", shareId);

        if (error) throw error;
        return (data ?? []).map((row) => ({
            id: row.id,
            shareId: row.share_id,
            bookerName: row.booker_name,
            bookerEmail: row.booker_email,
            bookedSlotStart: row.booked_slot_start,
            bookedSlotEnd: row.booked_slot_end,
            createdAt: row.created_at,
        }));
    },
};
