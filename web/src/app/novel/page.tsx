'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useNovelStore } from '@/store/useNovelStore'
import { EditorLayout } from '@/components/editor/EditorLayout'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

function NovelPageContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const id = searchParams.get('id')
    const { novels, fetchNovels, selectNovel, selectedNovelId, isLoading } = useNovelStore()
    const { user, isLoading: authLoading } = useAuthStore()

    // 1. Ensure Auth & Data
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/')
            return
        }

        if (user && novels.length === 0) {
            fetchNovels()
        }
    }, [user, authLoading, novels.length, fetchNovels, router])

    // 2. Select Novel based on URL & Reset Chapter State
    useEffect(() => {
        if (id) {
            // Reset chapter state when switching novels to prevent data bleeding
            const { setActiveChapter, setChapters } = require('@/store/useChapterStore').useChapterStore.getState()

            if (novels.length > 0) {
                const exists = novels.find(n => n.id === id)
                if (exists) {
                    if (selectedNovelId !== id) {
                        selectNovel(id)
                        // Clear active chapter and chapters list to ensure fresh state
                        setActiveChapter(null)
                        setChapters([])
                    }
                } else if (!isLoading) {
                    // Novel found in URL but not in user's list -> 404 or redirect
                    // router.push('/') 
                }
            }
        }
    }, [id, novels, selectedNovelId, selectNovel, isLoading, router])

    if (authLoading || isLoading || (novels.length === 0 && !selectedNovelId)) {
        return (
            <div className="min-h-screen bg-[#FDFBF7] dark:bg-neutral-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        )
    }

    return <EditorLayout />
}

export default function NovelPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FDFBF7] dark:bg-neutral-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
        }>
            <NovelPageContent />
        </Suspense>
    )
}
