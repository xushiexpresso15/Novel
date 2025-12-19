'use client'

import { useNovelStore } from "@/store/useNovelStore"
import { NovelList } from "./NovelList"
import { EditorLayout } from "@/components/editor/EditorLayout"

export function Dashboard() {
    const { selectedNovelId } = useNovelStore()

    if (selectedNovelId) {
        return <EditorLayout />
    }

    return <NovelList />
}
