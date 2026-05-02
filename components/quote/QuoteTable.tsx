'use client';

import { useQuote } from "@/hooks/useQuote";

export default function QuoteTable() {
    const { quote, isLoadingQuote, isErrorQuote } = useQuote();

    if (isLoadingQuote) {
        return <p>Loading...</p>
    }

    if (isErrorQuote) {
        return <p>Error</p>
    }

    return (
        <p>{quote?.id}</p>
    )
}