'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, Home } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { UserProfile } from '@/components/UserProfile'

interface ChapterContent {
    id: string
    title: string
    content: string
    order: number
    novel_id: string
}

interface NovelInfo {
    id: string
    title: string
}

function ReaderContent() {
    const searchParams = useSearchParams()
    const novelId = searchParams.get('novelId')
    const chapterId = searchParams.get('chapterId')

    const [chapter, setChapter] = useState<ChapterContent | null>(null)
    const [novel, setNovel] = useState<NovelInfo | null>(null)
    const [neighbors, setNeighbors] = useState<{ prev: string | null, next: string | null }>({ prev: null, next: null })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchChapterAndNovel = async () => {
            if (!novelId || !chapterId) return

            setIsLoading(true)
            try {
                if (chapterId) {
                    // Fetch specific chapter
                    const { data: currentData, error: currentError } = await supabase
                        .from('chapters')
                        .select('*')
                        .eq('id', chapterId)
                        .single()

                    if (currentError) throw currentError
                    setChapter(currentData)
                }

                // Fetch novel info just for the title
                const { data: novelData, error: novelError } = await supabase
                    .from('novels')
                    .select('id, title')
                    .eq('id', novelId)
                    .single()

                if (novelError) {
                    console.error('Error fetching novel:', novelError)
                } else {
                    setNovel(novelData)
                }

                // Fetch neighbors for navigation & First Chapter if needed
                const { data: allChapters } = await supabase
                    .from('chapters')
                    .select('*') // Need content if we are falling back to first chapter
                    .eq('novel_id', novelId)
                    .order('order', { ascending: true })

                if (allChapters && allChapters.length > 0) {
                    // If no chapterId provided, use the first one
                    let currentCh = chapterId ? allChapters.find(c => c.id === chapterId) : allChapters[0]

                    if (!chapterId && currentCh) {
                        setChapter(currentCh)
                        // Update URL silently without reload so sharing works? Or just let it be.
                    }

                    if (currentCh) {
                        const currentIndex = allChapters.findIndex(c => c.id === currentCh.id)
                        setNeighbors({
                            prev: currentIndex > 0 ? allChapters[currentIndex - 1].id : null,
                            next: currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1].id : null
                        })
                    }
                }

            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchChapterAndNovel()
    }, [chapterId, novelId])

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-[#1a1a1a]">
            <div className="animate-pulse text-neutral-400">正在載入章節...</div>
        </div>
    }

    if (!chapter) {
        return <div className="min-h-screen flex items-center justify-center">找不到章節或該小說尚無內容</div>
    }

    return (
        <div
            className="min-h-screen bg-[#FDFBF7] dark:bg-[#1a1a1a] flex flex-col"
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* Minimal Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky top-0 z-10 shadow-sm">
                <Link href={`/explore`}>
                    <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        返回探索
                    </Button>
                </Link>

                {/* Novel Title in Header - Clearer Text */}
                <div className="text-base font-bold text-neutral-900 dark:text-neutral-100 truncate max-w-[60%] text-center">
                    {novel?.title || ''}
                </div>

                <div className="w-20 flex justify-end">
                    <UserProfile />
                </div>
            </div>

            {/* Content Area - Copy Protected */}
            <div
                className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 select-none"
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
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
                        <Link href={`/read?novelId=${novelId}&chapterId=${neighbors.prev}`}>
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

                    <Link href={`/novel?id=${novelId}`}>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Home className="w-5 h-5" />
                        </Button>
                    </Link>

                    {neighbors.next ? (
                        <Link href={`/read?novelId=${novelId}&chapterId=${neighbors.next}`}>
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

export default function ReaderPage() {
    return (
        <Suspense fallback={<div>載入中...</div>}>
            <ReaderContent />
        </Suspense>
    )
}
