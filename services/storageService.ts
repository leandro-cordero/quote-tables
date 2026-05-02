import { createClient } from "@/lib/supabase/client"


export const storageService = {
    supabase: createClient(),

    getFileUrl(path: string) {
        const { data } = this.supabase.storage.from("portfolio").getPublicUrl(path);

        return data.publicUrl;
    }
}