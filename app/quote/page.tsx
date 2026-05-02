"use client"
import QuoteInfo from "@/components/quote/QuoteInfo"
import QuoteTable from "@/components/quote/QuoteTable"
import Loader from "@/components/ui/Loader"
import { useQuote } from "@/hooks/useQuote"
import { notFound } from "next/navigation"
import '@/styles/_quotes.scss'


export default function QuoteTablePage() {
    const { quote, isLoadingQuote, isErrorQuote } = useQuote();

    if (isLoadingQuote) return <Loader />
    if (isErrorQuote || !quote) {
        notFound()
    }

    return (
        <main className="container grow">
            <QuoteInfo quote={quote} />
            <QuoteTable />
        </main>
    );
}