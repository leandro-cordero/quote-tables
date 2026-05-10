import { normalizeQuoteData, normalizeWorkItemData, formatPrice, buildChapterTree } from './mappers'
import { storageService } from '@/services/storageService'
import { Chapter, WorkItem, QuoteStatus, QuotePhase, MetricSystem, Currency } from '@/types'

// Mock external services to isolate mapping logic
jest.mock('@/services/storageService', () => ({
    storageService: {
        getFileUrl: jest.fn(),
    },
}))

describe('Mappers Utils', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('normalizeQuoteData', () => {
        it('should transform a standard raw quote object correctly', () => {
            const rawData = {
                id: '1',
                name: 'Project Alpha',
                description: 'A test project',
                status: 'draft',
                phase: 'estimation',
                metric_system: 'metric',
                currency: 'USD',
                tax_percentage: '10',
                created_at: '2023-01-01',
                updated_at: '2023-01-02'
            }

            const result = normalizeQuoteData(rawData)

            expect(result.id).toBe('1')
            expect(result.name).toBe('Project Alpha')
            expect(result.description).toBe('A test project')
            // Verify string to number conversion
            expect(result.taxPercentage).toBe(10)
            expect(result.thumbnail).toBeUndefined()
        })

        it('should correctly map thumbnail if present', () => {
            const mockUrl = 'https://mock.storage.com/image.jpg';
            (storageService.getFileUrl as jest.Mock).mockReturnValue(mockUrl)

            const rawData = {
                id: '1',
                name: 'Test',
                thumbnail: 'image.jpg'
            }

            const result = normalizeQuoteData(rawData)

            expect(storageService.getFileUrl).toHaveBeenCalledWith('image.jpg')
            expect(result.thumbnail).toBe(mockUrl)
        })
    })

    describe('normalizeWorkItemData', () => {
        it('should calculate commercial values correctly based on internal price and margin', () => {
            const rawData = {
                id: 'w1',
                quote_version_id: 'v1',
                chapter_id: 'c1',
                concept: 'Concrete',
                quantity: '10',
                unit: 'm3',
                internal_unit_price: '50',
                margin_percentage: '0.20',
            }

            const result = normalizeWorkItemData(rawData)

            expect(result.unitPriceInternal).toBe(50)
            expect(result.totalInternal).toBe(500)
            expect(result.unitPriceCommercial).toBe(60)
            expect(result.totalCommercial).toBe(600)
            expect(result.margin).toBe(0.20)
        })

        it('should handle zero or missing numerical fields gracefully', () => {
            const rawData = {
                id: 'w2',
                concept: 'Missing Data Item',
            }

            const result = normalizeWorkItemData(rawData)

            expect(result.quantity).toBe(0)
            expect(result.unitPriceInternal).toBe(0)
            expect(result.totalInternal).toBe(0)
            expect(result.margin).toBe(0)
            expect(result.unitPriceCommercial).toBe(0)
            expect(result.totalCommercial).toBe(0)
        })
    })

    describe('formatPrice', () => {
        it('should format numbers into a localized currency string', () => {
            const result = formatPrice(1234.5, 'USD')
            // Loose regex accommodates varying space characters across different Node versions/locales
            expect(result).toMatch(/\$1,234\.50/)
        })
    })

    describe('buildChapterTree', () => {
        it('should build a nested tree, calculate subtotals, and assign numbered indices', () => {
            const mockChapters = [
                { id: 'c1', parentId: null, name: 'Foundation', orderIndex: 1 } as Chapter,
                { id: 'c2', parentId: 'c1', name: 'Excavation', orderIndex: 1 } as Chapter,
            ]

            const mockWorkItems = [
                { id: 'w1', chapterId: 'c2', totalInternal: 100, totalCommercial: 120, orderIndex: 1 } as WorkItem,
                { id: 'w2', chapterId: 'c2', totalInternal: 200, totalCommercial: 240, orderIndex: 2 } as WorkItem,
            ]

            const tree = buildChapterTree(mockChapters, mockWorkItems)

            // Validate hierarchical structure and derived subtotals
            expect(tree.length).toBe(1)
            const root = tree[0]
            expect(root.name).toBe('Foundation')
            expect(root.numberedIndex).toBe('1.')
            expect(root.subtotalInternal).toBe(300)
            expect(root.subtotalCommercial).toBe(360)

            expect(root.children.length).toBe(1)
            const child = root.children[0]
            expect(child.name).toBe('Excavation')
            expect(child.numberedIndex).toBe('1.1.')
            expect(child.subtotalInternal).toBe(300)
            expect(child.subtotalCommercial).toBe(360)

            expect(child.workItems.length).toBe(2)
            expect(child.workItems[0].numberedIndex).toBe('1.1.1.')
            expect(child.workItems[1].numberedIndex).toBe('1.1.2.')
        })
    })
})
