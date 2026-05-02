import { createClient } from "@/lib/supabase/client"
import type { Quote } from "@/types";

export const quoteService = {
    supabase: createClient(),

    // Quote Version
    async getQuote(quoteId: string): Promise<Quote> {
        const { data, error } = await this.supabase
            .from('quote_versions')
            .select('*')
            .eq('id', quoteId)
            .single()

        if (error) {
            throw error
        }

        return data
    },
}