import { createClient } from "@/lib/supabase/client"
import type { Quote, Unit, WorkItem } from "@/types"
import { normalizeQuoteData, normalizeChapterData, normalizeWorkItemData } from "@/utils/mappers"


export type UpsertWorkItemParams = {
    id?: string;
    quoteVersionId?: string;
    chapterId?: string;
    concept?: string;
    quantity?: number;
    unit?: Unit;
    internalUnitPrice?: number;
    marginPercentage?: number;
    orderIndex?: number;
}

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

        return normalizeQuoteData(data)
    },

    // Fetch Full Financial Tree
    async getVersionFinancials(quoteId: string) {
        // Chapters
        const { data: chapters, error: chaptersError } = await this.supabase
            .from('chapters')
            .select('*')
            .eq('quote_version_id', quoteId)
            .order('order_index')

        if (chaptersError) throw chaptersError

        // Work Items
        const { data: workItems, error: workItemsError } = await this.supabase
            .from('work_items')
            .select('*')
            .eq('quote_version_id', quoteId)
            .order('order_index')

        if (workItemsError) throw workItemsError

        return {
            chapters: chapters.map(normalizeChapterData),
            workItems: workItems.map(normalizeWorkItemData)
        }
    },

    // Chapter / Subchapter
    async createChapter(quoteVersionId: string, name: string, parentId?: string) {
        const { data, error } = await this.supabase
            .from('chapters')
            .insert({
                quote_version_id: quoteVersionId,
                name: name,
                parent_id: parentId || null
            })
            .select('*')
            .single()

        if (error) throw error
        return normalizeChapterData(data)
    },
    async deleteChapter(chapterId: string) {
        const { error } = await this.supabase
            .from('chapters')
            .delete()
            .eq('id', chapterId)

        if (error) throw error
    },
    async updateChapterName(chapterId: string, name: string) {
        const { data, error } = await this.supabase
            .from('chapters')
            .update({ name })
            .eq('id', chapterId)
            .select('*')
            .single()

        if (error) throw error
        return normalizeChapterData(data)
    },

    // Work Item
    async upsertWorkItem(params: UpsertWorkItemParams): Promise<WorkItem> {
        const rpcParams: Record<string, unknown> = {};

        if (params.id !== undefined) rpcParams.p_id = params.id;
        if (params.quoteVersionId !== undefined) rpcParams.p_quote_version_id = params.quoteVersionId;
        if (params.chapterId !== undefined) rpcParams.p_chapter_id = params.chapterId;
        if (params.concept !== undefined) rpcParams.p_concept = params.concept;
        if (params.quantity !== undefined) rpcParams.p_quantity = params.quantity;
        if (params.unit !== undefined) rpcParams.p_unit = params.unit;
        if (params.internalUnitPrice !== undefined) rpcParams.p_internal_unit_price = params.internalUnitPrice;
        if (params.marginPercentage !== undefined) rpcParams.p_margin_percentage = params.marginPercentage;
        if (params.orderIndex !== undefined) rpcParams.p_order_index = params.orderIndex;

        const { data, error } = await this.supabase
            .rpc('upsert_work_item', rpcParams)
            .single();

        if (error) throw error;

        return normalizeWorkItemData(data);
    },
    async deleteWorkItem(workItemId: string) {
        const { error } = await this.supabase
            .rpc('delete_work_item', { p_work_item_id: workItemId })

        if (error) throw error
    }
}