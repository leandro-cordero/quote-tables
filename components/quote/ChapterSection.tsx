import { useState } from "react";
import { ChapterNode, Quote } from "@/types";
import { formatPrice } from "@/utils/mappers";
import CreateChapter from "./CreateChapter";
import WorkItemsTable from "./WorkItemsTable";
import { useQuote } from "@/hooks/useQuote";
import ChapterInput from "./ChapterInput";


interface ChapterSectionProps {
    node: ChapterNode;
    currentQuote: Quote | undefined;
    depth?: number;
}

export default function ChapterSection({ node, currentQuote, depth = 0 }: ChapterSectionProps) {
    const [isExpanded, setIsExpanded] = useState(true)
    const { deleteChapter } = useQuote()

    const indentStyle = {
        paddingLeft: `${depth * 20}px`
    }

    if (!currentQuote) return null

    return (
        <section
            style={indentStyle}
            className={`chapter ${isExpanded ? 'chapter--expanded' : ''} ${depth > 0 ? 'chapter--subchapter' : ''}`}
        >
            <div className="chapter__header">
                <div className="header__title">
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        title='Toggle chapter'
                    >
                        <i className={`icon-angle-left text-20 transition-transform ${isExpanded ? 'rotate-270' : 'rotate-180'}`} aria-hidden="true"></i>
                        <span>{node.numberedIndex} </span>
                    </button>
                    <ChapterInput node={node} />
                    <button
                        type="button"
                        onClick={() => deleteChapter(node.id)}
                        title='Delete chapter'
                        className="chapter__delete"
                    >
                        <i className="icon-delete-outline text-24"></i>
                    </button>
                </div>
                <div className="header__costs">
                    <p className="costs__subtotal costs__subtotal--internal">
                        Internal cost:
                        <span className="font-medium">{formatPrice(node.subtotalInternal, currentQuote.currency)}</span>
                    </p>
                    <p className="costs__subtotal costs__subtotal--commercial">
                        Comercial cost:
                        <span className="font-medium">{formatPrice(node.subtotalCommercial, currentQuote.currency)}</span>
                    </p>
                </div>
            </div>

            <div className="chapter__content">
                {/* Work Items */}
                <div style={{ marginLeft: `${(depth + 1) * 20}px` }}>
                    <WorkItemsTable
                        workItems={node.workItems || []}
                        metricSystem={currentQuote.metricSystem}
                        chapterId={node.id}
                    />
                </div>

                {/* Child Chapters */}
                {node.children && node.children.map(child => (
                    <ChapterSection
                        key={child.id}
                        node={child}
                        currentQuote={currentQuote}
                        depth={depth + 1}
                    />
                ))}

                {/* Create Subchapter */}
                {depth < 3 && (
                    <div style={{ marginLeft: `${(depth + 1) * 20}px` }}>
                        <CreateChapter isSubChapter={true} parentId={node.id} />
                    </div>
                )}
            </div>
        </section>
    )
}
