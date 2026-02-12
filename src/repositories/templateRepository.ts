import { supabase } from "@/lib/supabase";
import { type Template } from "@/features/event/models/Template";
import { toTemplate } from "@/features/event/mappers/toTemplate";

export const templateRepository = {
    async getTemplateById(id: number) {
        const { data, error } = await supabase
            .from("templates")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return toTemplate(data);
    },

    async createTemplate(template: Omit<Template, "id">) {
        const { data, error } = await supabase
            .from("templates")
            .insert({
                user_id: template.userId,
                data: template.data,
            })
            .select()
            .single();

        if (error) throw error;
        return toTemplate(data);
    },

    async updateTemplate(id: string, template: Omit<Template, "id">) {
        const { data, error } = await supabase
            .from("templates")
            .update({
                user_id: template.userId,
                data: template.data,
            })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return toTemplate(data);
    },

    async deleteTemplate(id: string) {
        const { error } = await supabase
            .from("templates")
            .delete()
            .eq("id", id);

        if (error) throw error;
    },

    async getTemplatesByUserId(userId: string) {
        const { data, error } = await supabase
            .from("templates")
            .select("*")
            .eq("user_id", userId);

        if (error) throw error;
        return data.map(toTemplate);
    },
};
