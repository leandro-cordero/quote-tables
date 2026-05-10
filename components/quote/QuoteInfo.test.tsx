import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import QuoteInfo from './QuoteInfo'
import type { Quote, QuoteStatus, QuotePhase, MetricSystem, Currency } from '@/types'

// Mock quote
const mockBaseQuote: Quote = {
    id: '1',
    name: 'Test Project',
    description: 'Test description',
    status: 'draft' as QuoteStatus,
    phase: 'estimation' as QuotePhase,
    metricSystem: 'metric' as MetricSystem,
    currency: 'USD' as Currency,
    taxPercentage: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
}

describe('QuoteInfo Component', () => {
    it('renders core quotation details correctly', () => {
        render(<QuoteInfo quote={mockBaseQuote} />)

        // Verify primary headings and badges
        expect(screen.getByRole('heading', { name: 'Test Project', level: 1 })).toBeInTheDocument()
        expect(screen.getByText('draft')).toBeInTheDocument()
        expect(screen.getByText('estimation')).toBeInTheDocument()

        // Verify secondary data
        expect(screen.getByText('metric')).toBeInTheDocument()
        expect(screen.getByText('USD')).toBeInTheDocument()
        expect(screen.getByText('10%')).toBeInTheDocument()

        // Verify optional elements are NOT rendered
        expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })

    it('conditionally renders the thumbnail image when a URL is provided', () => {
        const quoteWithThumbnail = { ...mockBaseQuote, thumbnail: 'https://example.com/thumb.jpg' }
        render(<QuoteInfo quote={quoteWithThumbnail} />)

        // Verify image rendering
        const image = screen.getByRole('img', { name: 'Test Project thumbnail' })
        expect(image).toBeInTheDocument()
        expect(image).toHaveAttribute('src', 'https://example.com/thumb.jpg')
    })

    describe('Location Rendering Logic', () => {
        it('renders location as plain text if no URL is provided', () => {
            const quoteWithLocation = { ...mockBaseQuote, location: 'New York, USA' }
            render(<QuoteInfo quote={quoteWithLocation} />)

            // Ensure text is present but NOT a link
            expect(screen.getByText('New York, USA')).toBeInTheDocument()
            expect(screen.queryByRole('link', { name: /New York, USA/i })).not.toBeInTheDocument()
        })

        it('renders location as an external hyperlink when a URL is present', () => {
            const quoteWithLocationAndUrl = {
                ...mockBaseQuote,
                location: 'New York, USA',
                locationUrl: 'https://maps.google.com/ny'
            }
            render(<QuoteInfo quote={quoteWithLocationAndUrl} />)

            // Verify a valid external link is generated
            const link = screen.getByRole('link', { name: /New York, USA/i })
            expect(link).toBeInTheDocument()
            expect(link).toHaveAttribute('href', 'https://maps.google.com/ny')
            expect(link).toHaveAttribute('target', '_blank')
        })
    })
})
