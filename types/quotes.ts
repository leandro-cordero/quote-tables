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

export interface InputWorkItem {
    id?: string;
    quoteVersionId?: string;
    chapterId?: string;

    concept?: string;
    quantity?: number;
    unit?: Unit;

    unitPriceInternal?: number;
    margin?: number;
    orderIndex?: number;
}

export interface WorkItem extends Required<InputWorkItem> {
    unitPriceCommercial: number;

    totalInternal: number;
    totalCommercial: number;

    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;
}

export type IndexedWorkItem = WorkItem & {
    numberedIndex: string
}

export type ChapterNode = Chapter & {
    numberedIndex: string
    children: ChapterNode[]
    workItems: IndexedWorkItem[]
}