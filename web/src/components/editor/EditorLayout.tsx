'use client'

import { Editor } from "@/components/editor/Editor"
import { Sidebar } from "@/components/sidebar/Sidebar"
import { RightSidebar } from "@/components/sidebar/RightSidebar"
import { NovelDashboard } from "@/components/dashboard/NovelDashboard"
import { useChapterStore } from "@/store/useChapterStore"

export function EditorLayout() {
    const { activeChapterId } = useChapterStore()

    if (!activeChapterId) {
        return <NovelDashboard />
    }

    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 overflow-hidden flex font-sans">
            {/* Left Sidebar */}
            <div className="z-10 flex-shrink-0 relative">
                <Sidebar />
            </div>

            {/* Main Content Area (Writer's Canvas) */}
            <main className="flex-1 relative h-screen overflow-hidden flex flex-col min-w-0">
                <Editor />
            </main>

            {/* Right Sidebar */}
            <div className="flex-shrink-0 z-10 transition-all duration-300 relative">
                <RightSidebar />
            </div>
        </div>
    )
}
