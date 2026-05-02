import Header from "@/components/Header";


export default function QuoteTableLayout({ children }: { children: React.ReactNode }) {
    return <>
        <Header />
        {children}
    </>;
}