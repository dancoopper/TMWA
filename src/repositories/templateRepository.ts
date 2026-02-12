import { supabase } from "@/lib/supabase";
import { type Template } from "@/features/template/Template";
import { toTemplate } from "@/features/template/toTemplate";

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

    async createTemplate(template: Template) {
        const { data, error } = await supabase
            .from("templates")
            .insert([template])
            .select()
            .single();

        if (error) throw error;
        return toTemplate(data);
    },

    async updateTemplate(id: string, template: Template) {
        const { data, error } = await supabase
            .from("templates")
            .update(template)
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
