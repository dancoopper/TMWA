import { supabase } from "@/lib/supabase";
import { toTemplate } from "@/features/template/toTemplate";
import { type Database } from "@/types/database.types";
import { normalizeTemplateFields, type TemplateField } from "@/features/template/templateFields";

type TemplateInsert = Database["public"]["Tables"]["templates"]["Insert"];
type TemplateUpdate = Database["public"]["Tables"]["templates"]["Update"];

export type CreateTemplateInput = {
    userId: string;
    name: string;
    isHidden?: boolean;
    data: TemplateField[];
};

export type UpdateTemplateInput = {
    name?: string;
    isHidden?: boolean;
    data?: TemplateField[];
};

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

    async createTemplate(template: CreateTemplateInput) {
        const payload: TemplateInsert = {
            user_id: template.userId,
            name: template.name,
            is_hidden: template.isHidden ?? false,
            data: normalizeTemplateFields(template.data),
        };

        const { data, error } = await supabase
            .from("templates")
            .insert(payload)
            .select()
            .single();

        if (error) throw error;
        return toTemplate(data);
    },

    async updateTemplate(id: number, template: UpdateTemplateInput) {
        const payload: TemplateUpdate = {};
        if (typeof template.name === "string") payload.name = template.name;
        if (typeof template.isHidden === "boolean") payload.is_hidden = template.isHidden;
        if (template.data) payload.data = normalizeTemplateFields(template.data);

        const { data, error } = await supabase
            .from("templates")
            .update(payload)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return toTemplate(data);
    },

    async deleteTemplate(id: number) {
        const { error } = await supabase
            .from("templates")
            .delete()
            .eq("id", id);

        if (error) throw error;
    },

    async getTemplatesByUserId(
        userId: string,
        options?: {
            includeHidden?: boolean;
        },
    ) {
        let query = supabase
            .from("templates")
            .select("*")
            .eq("user_id", userId);

        if (!options?.includeHidden) {
            query = query.eq("is_hidden", false);
        }

        const { data, error } = await query.order("id", { ascending: true });

        if (error) throw error;
        return data.map(toTemplate);
    },
};
