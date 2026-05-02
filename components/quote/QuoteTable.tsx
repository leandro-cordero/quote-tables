import CreateChapter from "./CreateChapter"
import { useQuote } from "@/hooks/useQuote"
import ChapterSection from "./ChapterSection"


export default function QuoteTable() {
    const { chapterTree, quote } = useQuote()


    return (
        <div className="quote">
            {chapterTree.map((rootNode) => (
                <ChapterSection key={rootNode.id} node={rootNode} currentQuote={quote} />
            ))}

            <CreateChapter />
        </div>
    )
}