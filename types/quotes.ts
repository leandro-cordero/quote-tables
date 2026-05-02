import { Currency, MetricSystem } from "./shared";
import { QUOTE_PHASE, QUOTE_STATUS, AGNOSTIC_UNITS, METRIC_UNITS, IMPERIAL_UNITS } from "@/utils/constants";


export type QuoteStatus = typeof QUOTE_STATUS[number]
export type QuotePhase = typeof QUOTE_PHASE[number]
export type Unit = typeof AGNOSTIC_UNITS[number] | typeof METRIC_UNITS[number] | typeof IMPERIAL_UNITS[number]

export interface Quote {
    id: string

    name: string
    description: string | null
    thumbnail?: string
    status: QuoteStatus
    phase: QuotePhase
    location?: string | null
    locationUrl?: string | null

    metricSystem: MetricSystem
    currency: Currency
    taxPercentage: number

    createdAt: string;
    updatedAt: string;
}

export type Chapter = {
    id: string;
    quoteVersionId: string;
    parentId: string | null;

    name: string;
    depth: number;
    orderIndex: number;

    subtotalInternal: number;
    subtotalCommercial: number;

    createdAt: Date;
    updatedAt: Date;
}

export type WorkItem = {
    id: string;
    quoteVersionId: string;
    chapterId: string;

    concept: string;
    quantity: number;
    unit: Unit;

    unitPriceInternal: number;
    unitPriceCommercial: number;
    totalInternal: number;
    totalCommercial: number;
    margin: number;
    orderIndex: number;

    createdAt: Date;
    updatedAt: Date;
}

export type IndexedWorkItem = WorkItem & {
    numberedIndex: string
}

export type ChapterNode = Chapter & {
    numberedIndex: string
    children: ChapterNode[]
    workItems: IndexedWorkItem[]
}