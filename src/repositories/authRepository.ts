import { supabase } from "@/lib/supabase";
import type {
    Session,
    SignUpWithPasswordCredentials,
} from "@supabase/supabase-js";

export const authRepository = {
    async signUp(credentials: SignUpWithPasswordCredentials) {
        const { data, error } = await supabase.auth.signUp({
            ...credentials,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/verify-email`,
            },
        });
        if (error) throw error;
        return data;
    },

    async getSession() {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data.session;
    },

    onAuthStateChange(callback: (session: Session | null) => void) {
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            callback(session);
        });

        return () => data.subscription.unsubscribe();
    },

    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },
};
