"use client"
import Link from "next/link";
import type { Quote } from "@/types";


export default function QuoteInfo({ quote }: { quote: Quote }) {
    return (
        <div
            className="
                relative
                mb-8
                flex items-stretch gap-4 flex-wrap
            "
        >
            {quote.thumbnail &&
                <div className="relative w-full min-h-[80px] border border-border-strong rounded-16 overflow-hidden lg:flex-1">
                    <img src={quote.thumbnail} alt={`${quote.name} thumbnail`} className="absolute inset-0 w-full h-full object-cover" />
                </div>
            }
            <div className='flex-3 max-w-full'>
                <div className="mb-2 flex items-center gap-x-4 gap-y-2 flex-wrap-reverse">
                    <h1 className='text-32'>{quote.name}</h1>
                    <span className={`badge badge--${quote.status}`} title="Quote status">{quote.status}</span>
                    <span className="badge" title="Quote phase">
                        <span className="phase-progress mr-1 w-2 h-2 inline-block rounded-full"></span>
                        {quote.phase}
                    </span>
                </div>
                <div className='flex gap-4'>
                    <div className="flex-2 max-w-full flex flex-col">
                        <div className="grow">
                            {quote.description && <p className='mb-1 text-14'>{quote.description}</p>}
                            {quote.location && (
                                <p className='mb-1 text-14'>
                                    {quote.locationUrl ? (
                                        <Link href={quote.locationUrl} target="_blank" rel="noopener noreferrer" className='btn btn--tertiary btn--light'>
                                            {quote.location}
                                            <i className="ml-1 icon-external-link align-middle" aria-hidden="true"></i>
                                        </Link>
                                    ) : (
                                        quote.location
                                    )}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className='flex-1 hidden md:block text-14'>
                        <p><strong>Metric system:</strong> <span className="capitalize">{quote.metricSystem}</span></p>
                        <p><strong>Currency:</strong> {quote.currency}</p>
                        <p><strong>Tax percentage:</strong> {quote.taxPercentage}%</p>
                    </div>
                </div>
            </div>
        </div>
    )
}