'use client'
import {
    environmentManager,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'


let browserQueryClient: QueryClient | undefined = undefined
const isServer = environmentManager.isServer()


function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000,
                refetchOnWindowFocus: false,
            },
        },
    })
}

function getQueryClient() {
    if (isServer) {
        // New query client for server
        return makeQueryClient()
    } else {
        // Handle browser query client
        if (!browserQueryClient) browserQueryClient = makeQueryClient()
        return browserQueryClient
    }
}

export default function Providers({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient()

    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
}