import { useMemo } from "react";
import { quoteService } from "@/services/quoteService";
import { DEFAULT_QUOTE_ID } from "@/utils/constants";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Quote } from "@/types";
import { buildChapterTree } from "@/utils/mappers";
import type { UpsertWorkItemParams } from "@/services/quoteService";


export function useQuote() {
    const queryClient = useQueryClient()


    // --- Helpers ---
    const setFinancialData = (updater: (old: any) => any) => queryClient.setQueryData(['financialData', DEFAULT_QUOTE_ID], updater)

    // --- Get Quote ---
    const { data: quote, isLoading: isLoadingQuote, isError: isErrorQuote } = useQuery<Quote>({
        queryKey: ['quote', DEFAULT_QUOTE_ID],
        queryFn: () => quoteService.getQuote(DEFAULT_QUOTE_ID),
        enabled: !!DEFAULT_QUOTE_ID
    })
    // --- Get Full Financial Data ---
    const { data: financialData } = useQuery({
        queryKey: ['financialData', quote?.id],
        queryFn: () => quoteService.getVersionFinancials(quote?.id as string),
        enabled: !!quote?.id
    })

    // --- Derived Chapter Tree ---
    const chapterTree = useMemo(() =>
        financialData ? buildChapterTree(financialData.chapters, financialData.workItems) : [],
        [financialData]
    )

    // --- Chapter Mutations ---
    const { mutateAsync: createChapter } = useMutation({
        mutationFn: ({ name, parentId }: { name: string; parentId?: string }) =>
            quoteService.createChapter(DEFAULT_QUOTE_ID, name, parentId),
        onSuccess: (newCh) => setFinancialData((old: any) => ({
            ...old,
            chapters: [...old.chapters, newCh]
        }))
    })
    const { mutateAsync: deleteChapter } = useMutation({
        mutationFn: (id: string) => quoteService.deleteChapter(id),
        onSuccess: (_, id) => setFinancialData((old: any) => ({
            ...old,
            chapters: old.chapters.filter((c: any) => c.id !== id)
        }))
    })
    const { mutateAsync: updateChapterName } = useMutation({
        mutationFn: (payload: { chapterId: string; name: string }) =>
            quoteService.updateChapterName(payload.chapterId, payload.name),
        onSuccess: (upd) => setFinancialData((old: any) => ({
            ...old,
            chapters: old.chapters.map((c: any) => c.id === upd.id ? upd : c)
        }))
    })

    // --- Work Item Mutations ---
    const { mutateAsync: upsertWorkItem } = useMutation({
        mutationFn: (params: UpsertWorkItemParams) => quoteService.upsertWorkItem(params),
        onSuccess: (savedWorkItem) => {
            setFinancialData((old: any) => {
                if (!old) return old;
                const exists = old.workItems.some((w: any) => w.id === savedWorkItem.id);
                if (exists) {
                    return {
                        ...old,
                        workItems: old.workItems.map((w: any) => w.id === savedWorkItem.id ? savedWorkItem : w)
                    };
                } else {
                    return {
                        ...old,
                        workItems: [...old.workItems, savedWorkItem]
                    };
                }
            });
        }
    })
    const { mutateAsync: deleteWorkItem } = useMutation({
        mutationFn: (id: string) => quoteService.deleteWorkItem(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: ['financialData', DEFAULT_QUOTE_ID] })
            const previousData = queryClient.getQueryData(['financialData', DEFAULT_QUOTE_ID])
            setFinancialData((old: any) => ({
                ...old,
                workItems: old.workItems.filter((w: any) => w.id !== id)
            }))
            return { previousData }
        },
        onError: (_, __, context: any) => {
            if (context?.previousData) setFinancialData(() => context.previousData)
        }
    })
    const updateWorkItemCache = (workItemId: string, newData: any, existing?: any) => {
        setFinancialData((old: any) => {
            if (!old) return old;

            const qty = Number(newData.workitem_quantity) || 0;
            const price = Number(newData.workitem_unit_price) || 0;
            const margin = Number(newData.workitem_margin) || 0;

            const optimisticRow = {
                ...existing,
                concept: newData.workitem_concept,
                unit: newData.workitem_unit,
                quantity: qty,
                unitPriceInternal: price,
                totalInternal: qty * price,
                margin,
                unitPriceCommercial: price * (1 + (margin / 100)),
                totalCommercial: qty * (price * (1 + (margin / 100)))
            };

            return {
                ...old,
                workItems: old.workItems.map((w: any) => w.id === workItemId ? optimisticRow : w)
            };
        });
    }


    return {
        quote,
        isLoadingQuote,
        isErrorQuote,
        chapterTree,
        createChapter,
        updateChapterName,
        deleteChapter,
        upsertWorkItem,
        deleteWorkItem,
        updateWorkItemCache
    }
}