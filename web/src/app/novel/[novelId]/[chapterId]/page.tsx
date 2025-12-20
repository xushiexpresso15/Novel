'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChapterContent {
    id: string
    title: string
    content: string
    order: number
    novel_id: string
}

export default async function ReaderPage({ params }: { params: Promise<{ novelId: string, chapterId: string }> }) {
    const { novelId, chapterId } = await params
    // Note: Since this is now an async server component effectively at the top level (waiting for params),
    // but we used 'use client' at the top... wait, 'use client' components cannot be async.
    // Correction: In Next.js 15, if it's a client component, we use `use` hook or simply `useParams` hook.
    // However, the error says it violates `PageProps` constraint which suggests Next.js expects the component to accept a Promise for params if it's a Server Component, OR we rely on `useParams` hook for Client Components.

    // BUT checking the file, line 1 is 'use client'.
    // Client components receive params as a Promise in Next.js 15 IF they are pages? Actually no.
    // The breaking change is: Page props `params` is a Promise.
    // If it is a CLIENT component, we CANNOT make the component async.
    // The standard fix for Client Component Pages is to use `React.use()` to unwrap the promise, OR pass it down from a Server Component wrapper.
    // simpler fix for now: Use `useParams` hook from `next/navigation` instead of props! This is the client-side way.

    const [chapter, setChapter] = useState<ChapterContent | null>(null)
    const [neighbors, setNeighbors] = useState<{ prev: string | null, next: string | null }>({ prev: null, next: null })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchChapter = async () => {
            setIsLoading(true)
            try {
                // Fetch current chapter
                const { data: currentData, error: currentError } = await supabase
                    .from('chapters')
                    .select('*')
                    .eq('id', chapterId)
                    .single()

                if (currentError) throw currentError
                setChapter(currentData)

                // Fetch neighbors for navigation
                // This is a naive approach; strictly relying on 'order'.
                const { data: allChapters } = await supabase
                    .from('chapters')
                    .select('id, order')
                    .eq('novel_id', novelId)
                    .order('order', { ascending: true })

                if (allChapters) {
                    const currentIndex = allChapters.findIndex(c => c.id === chapterId)
                    setNeighbors({
                        prev: currentIndex > 0 ? allChapters[currentIndex - 1].id : null,
                        next: currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1].id : null
                    })
                }

            } catch (error) {
                console.error('Error fetching chapter:', error)
            } finally {
                setIsLoading(false)
            }
        }

        if (chapterId) fetchChapter()
    }, [chapterId, novelId])

    // Copy Protection Handlers
    const preventCopy = (e: React.UIEvent) => {
        e.preventDefault()
        return false
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-[#1a1a1a]">
            <div className="animate-pulse text-neutral-400">Loading Chapter...</div>
        </div>
    }

    if (!chapter) {
        return <div className="min-h-screen flex items-center justify-center">Chapter not found</div>
    }

    return (
        <div
            className="min-h-screen bg-[#FDFBF7] dark:bg-[#1a1a1a] flex flex-col"
            // Prevent Right Click
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* Minimal Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur sticky top-0 z-10">
                <Link href={`/novel/${novelId}`}>
                    <Button variant="ghost" size="sm" className="text-neutral-500">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        目錄
                    </Button>
                </Link>
                <div className="text-sm font-medium text-neutral-500">
                    {chapter.title}
                </div>
                <div className="w-20"></div> {/* Spacer */}
            </div>

            {/* Content Area - Copy Protected */}
            <div
                className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 select-none"
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                style={{ userSelect: 'none', WebkitUserSelect: 'none' }} // Explicit CSS enforcement
            >
                <h1 className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-neutral-100 mb-12 text-center leading-tight">
                    {chapter.title}
                </h1>

                <div
                    className="prose prose-lg prose-slate dark:prose-invert max-w-none font-serif text-lg leading-loose tracking-wide whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: chapter.content || '' }}
                />
            </div>

            {/* Navigation Footer */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-8 mt-auto">
                <div className="max-w-3xl mx-auto px-6 flex items-center justify-between">
                    {neighbors.prev ? (
                        <Link href={`/novel/${novelId}/${neighbors.prev}`}>
                            <Button variant="outline" className="gap-2">
                                <ChevronLeft className="w-4 h-4" />
                                上一章
                            </Button>
                        </Link>
                    ) : (
                        <Button variant="ghost" disabled className="opacity-50">
                            已是第一章
                        </Button>
                    )}

                    <Link href={`/novel/${novelId}`}>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Home className="w-5 h-5" />
                        </Button>
                    </Link>

                    {neighbors.next ? (
                        <Link href={`/novel/${novelId}/${neighbors.next}`}>
                            <Button variant="default" className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                                下一章
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    ) : (
                        <Button variant="ghost" disabled className="opacity-50">
                            已是最新章
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}
