import { MetricSystem, Currency, QuotePhase, QuoteStatus, Quote, Chapter, WorkItem, ChapterNode, IndexedWorkItem } from "@/types"
import { storageService } from "@/services/storageService"


// Transforms a quote object
export function normalizeQuoteData(data: Record<string, unknown>): Quote {
    return {
        id: String(data.id),
        name: String(data.name),
        description: data.description ? String(data.description) : null,
        thumbnail: data.thumbnail ? storageService.getFileUrl(String(data.thumbnail)) : undefined,
        status: data.status as QuoteStatus,
        phase: data.phase as QuotePhase,
        location: data.location ? String(data.location) : null,
        locationUrl: data.locationurl ? String(data.locationurl) : null,
        metricSystem: data.metric_system as MetricSystem,
        currency: data.currency as Currency,
        taxPercentage: Number(data.tax_percentage),
        createdAt: String(data.created_at),
        updatedAt: String(data.updated_at),
    }
}

export function normalizeChapterData(data: any): Chapter {
    return {
        id: data.id as string,
        quoteVersionId: data.quote_version_id as string,
        parentId: data.parent_id as string | null,
        name: data.name as string,
        depth: data.depth as number,
        orderIndex: data.order_index as number,
        subtotalInternal: 0,
        subtotalCommercial: 0,
        createdAt: new Date(data.created_at as string),
        updatedAt: new Date(data.updated_at as string),
    }
}

// Transforms a work item object
export function normalizeWorkItemData(data: any): WorkItem {
    const quantity = Number(data.quantity) || 0;
    const internalUnitPrice = Number(data.internal_unit_price) || 0;
    const margin = Number(data.margin_percentage) || 0;
    const totalInternal = quantity * internalUnitPrice;
    const unitPriceCommercial = internalUnitPrice * (1 + margin);
    const totalCommercial = quantity * unitPriceCommercial;

    return {
        id: data.id as string,
        quoteVersionId: data.quote_version_id as string,
        chapterId: data.chapter_id as string,

        concept: data.concept as string,
        quantity: quantity,
        unit: data.unit as string,

        unitPriceInternal: internalUnitPrice,
        totalInternal: totalInternal,
        margin: margin,
        unitPriceCommercial: unitPriceCommercial,
        totalCommercial: totalCommercial,

        orderIndex: data.order_index as number,

        createdAt: new Date(data.created_at as string),
        updatedAt: new Date(data.updated_at as string),
    }
}

// Format price
export function formatPrice(price: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(price)
}

// Builds chapter tree from flat chapters and work items
export function buildChapterTree(chapters: Chapter[], workItems: WorkItem[]): ChapterNode[] {
    const map = new Map<string, ChapterNode>()
    const roots: ChapterNode[] = []

    // Create nodes
    for (const ch of chapters) {
        map.set(ch.id, { ...ch, numberedIndex: '', children: [], workItems: [] })
    }
    // Assign work items
    for (const wi of workItems) {
        map.get(wi.chapterId)?.workItems.push({ ...wi, numberedIndex: '' })
    }
    // Build parent → children relationships
    for (const node of map.values()) {
        if (node.parentId && map.has(node.parentId)) {
            map.get(node.parentId)!.children.push(node)
        } else {
            roots.push(node)
        }
    }

    // Assign numbered indices recursively
    function assignIndices(nodes: ChapterNode[], prefix: string) {
        nodes.sort((a, b) => a.orderIndex - b.orderIndex)
        nodes.forEach((node, i) => {
            node.numberedIndex = `${prefix}${i + 1}.`
            // Index children first so they derive their own subtotals
            assignIndices(node.children, node.numberedIndex)

            // Index work items
            node.workItems.sort((a, b) => a.orderIndex - b.orderIndex)
            node.workItems.forEach((wi, j) => {
                wi.numberedIndex = `${node.numberedIndex}${j + 1}.`
            })

            // Dynamically calculate derived totals
            node.subtotalInternal = node.workItems.reduce((acc, wi) => acc + (Number(wi.totalInternal) || 0), 0) +
                node.children.reduce((acc, child) => acc + (Number(child.subtotalInternal) || 0), 0);

            node.subtotalCommercial = node.workItems.reduce((acc, wi) => acc + (Number(wi.totalCommercial) || 0), 0) +
                node.children.reduce((acc, child) => acc + (Number(child.subtotalCommercial) || 0), 0);
        })
    }
    assignIndices(roots, '')

    return roots
}