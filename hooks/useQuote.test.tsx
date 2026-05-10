import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useQuote } from './useQuote'
import { quoteService } from '@/services/quoteService'
import React from 'react'
import { DEFAULT_QUOTE_ID } from '@/utils/constants'

// Mock the dependencies
jest.mock('@/services/quoteService', () => ({
    quoteService: {
        getQuote: jest.fn(),
        getVersionFinancials: jest.fn(),
        createChapter: jest.fn(),
        deleteChapter: jest.fn(),
        updateChapterName: jest.fn(),
        upsertWorkItem: jest.fn(),
        deleteWorkItem: jest.fn(),
    }
}))

// Mock the mappers
jest.mock('@/utils/mappers', () => ({
    buildChapterTree: jest.fn().mockReturnValue([{ id: 'mock-chapter' }])
}))

describe('useQuote Hook', () => {
    let queryClient: QueryClient

    beforeEach(() => {
        jest.clearAllMocks()
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        })
    })

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )

    it('should fetch quote and financial data successfully', async () => {
        const mockQuote = { id: DEFAULT_QUOTE_ID, name: 'Test Quote' };
        const mockFinancials = { chapters: [], workItems: [] };

        (quoteService.getQuote as jest.Mock).mockResolvedValue(mockQuote);
        (quoteService.getVersionFinancials as jest.Mock).mockResolvedValue(mockFinancials);

        const { result } = renderHook(() => useQuote(), { wrapper })

        // Initial state
        expect(result.current.isLoadingQuote).toBe(true)

        // Wait for data to resolve
        await waitFor(() => {
            expect(result.current.isLoadingQuote).toBe(false)
        })

        expect(result.current.quote).toEqual(mockQuote)
        expect(quoteService.getQuote).toHaveBeenCalledWith(DEFAULT_QUOTE_ID)
        expect(quoteService.getVersionFinancials).toHaveBeenCalledWith(DEFAULT_QUOTE_ID)

        // Tree should be derived
        expect(result.current.chapterTree).toEqual([{ id: 'mock-chapter' }])
    })

    it('should handle optimistic updates for deleteWorkItem', async () => {
        const mockQuote = { id: DEFAULT_QUOTE_ID };
        const initialFinancials = {
            chapters: [],
            workItems: [{ id: 'w1', concept: 'Item 1' }, { id: 'w2', concept: 'Item 2' }]
        };

        (quoteService.getQuote as jest.Mock).mockResolvedValue(mockQuote);
        (quoteService.getVersionFinancials as jest.Mock).mockResolvedValue(initialFinancials);
        (quoteService.deleteWorkItem as jest.Mock).mockResolvedValue(true);

        const { result } = renderHook(() => useQuote(), { wrapper })

        // Wait for initial fetch
        await waitFor(() => {
            expect(queryClient.getQueryData(['financialData', DEFAULT_QUOTE_ID])).toEqual(initialFinancials)
        })

        // Execute the mutation and wait for its completion
        await result.current.deleteWorkItem('w1')

        // Check that the item was optimistically removed from the cache
        const updatedCache = queryClient.getQueryData<any>(['financialData', DEFAULT_QUOTE_ID])
        expect(updatedCache.workItems).toHaveLength(1)
        expect(updatedCache.workItems[0].id).toBe('w2')
    })

    it('should update cache when upsertWorkItem succeeds', async () => {
        const mockQuote = { id: DEFAULT_QUOTE_ID };
        const initialFinancials = { chapters: [], workItems: [] };
        const newWorkItem = { id: 'w1', concept: 'New Item' };

        (quoteService.getQuote as jest.Mock).mockResolvedValue(mockQuote);
        (quoteService.getVersionFinancials as jest.Mock).mockResolvedValue(initialFinancials);
        (quoteService.upsertWorkItem as jest.Mock).mockResolvedValue(newWorkItem);

        const { result } = renderHook(() => useQuote(), { wrapper })

        // Wait for initial fetch
        await waitFor(() => {
            expect(queryClient.getQueryData(['financialData', DEFAULT_QUOTE_ID])).toEqual(initialFinancials)
        })

        // Execute mutation and wait for it to finish
        await result.current.upsertWorkItem({} as any)

        // Verify the cache was updated with the new item
        const updatedCache = queryClient.getQueryData<any>(['financialData', DEFAULT_QUOTE_ID])
        expect(updatedCache.workItems).toHaveLength(1)
        expect(updatedCache.workItems[0]).toEqual(newWorkItem)
    })
})
