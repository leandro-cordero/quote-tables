import { useState } from "react";
import { useQuote } from "@/hooks/useQuote";


interface CreateChapterProps {
    isSubChapter?: boolean
    parentId?: string
}

export default function CreateChapter({ isSubChapter = false, parentId }: CreateChapterProps) {
    const [isCreatingChapter, setIsCreatingChapter] = useState(false)
    const [chapterName, setChapterName] = useState('')
    const { createChapter } = useQuote()

    const handleCreateChapter = () => {
        createChapter({ name: chapterName, parentId })
        setIsCreatingChapter(false)
        setChapterName('')
    }
    const handleCancelCreateChapter = () => {
        setIsCreatingChapter(false)
        setChapterName('')
    }

    return (
        isCreatingChapter ? (
            <div className={`quote__createChapter ${isSubChapter ? 'quote__createChapter--subchapter' : ''} quote__createChapter--active`}>
                <input
                    type="text"
                    autoFocus
                    name="chapter_name"
                    className="chapter__input"
                    placeholder="Chapter Name"
                    value={chapterName}
                    onChange={(e) => setChapterName(e.target.value)}
                    autoComplete="off"
                />
                <button
                    type="button"
                    className="btn btn--tertiary"
                    onClick={() => handleCreateChapter()}
                >
                    <i className="icon-check text-20"></i>
                    {isSubChapter ? 'Create Subchapter' : 'Create Chapter'}
                </button>
                <button
                    type="button"
                    className="btn btn--tertiary"
                    onClick={() => handleCancelCreateChapter()}
                >
                    <i className="icon-close text-20"></i>
                    Cancel
                </button>
            </div>
        ) : (
            <button
                type="button"
                className={`quote__createChapter ${isSubChapter ? 'quote__createChapter--subchapter' : ''}`}
                onClick={() => setIsCreatingChapter(true)}
            >
                <i className="icon-plus text-20"></i>
                {isSubChapter ? 'New Subchapter' : 'New Chapter'}
            </button>
        )
    )
}