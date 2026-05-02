import { quoteService } from "@/services/quoteService";
import { DEFAULT_QUOTE_ID } from "@/utils/constants";
import type { Quote } from "@/types";
import { useQuery } from "@tanstack/react-query";



export function useQuote() {
    const { data: quote, isLoading: isLoadingQuote, isError: isErrorQuote } = useQuery<Quote>({
        queryKey: ['quote', DEFAULT_QUOTE_ID],
        queryFn: () => quoteService.getQuote(DEFAULT_QUOTE_ID),
        enabled: !!DEFAULT_QUOTE_ID,
        retry: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })


    return {
        quote,
        isLoadingQuote,
        isErrorQuote,
    }
}