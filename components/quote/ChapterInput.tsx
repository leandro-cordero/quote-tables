import { useQuote } from "@/hooks/useQuote"
import { useEffect, useState } from "react"


export default function ChapterInput({ node }: { node: any }) {
    const { updateChapterName } = useQuote()
    const [name, setName] = useState(node.name)


    // Debounce name update
    useEffect(() => {
        if (name.trim() === node.name.trim()) return

        const timer = setTimeout(async () => {
            try {
                await updateChapterName({ chapterId: node.id, name })
            } catch (err) {
                console.error('Failed to update chapter name:', err)
            }
        }, 3000)

        return () => clearTimeout(timer)
    }, [name])


    return (
        <input
            type="text"
            name="chapter_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-label="Update chapter name"
            autoComplete="off"
        />
    )
}