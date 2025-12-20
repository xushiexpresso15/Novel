'use client'

import React, { useEffect, useState, Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Calendar, User, AlignLeft, PlayCircle } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { UserProfile } from '@/components/UserProfile'
import { format } from 'date-fns'
import { WritePadLogo } from "@/components/WritePadLogo"

interface ChapterInfo {
    id: string
    title: string
    order: number
    created_at: string
}

interface ChapterContent extends ChapterInfo {
    content: string
    novel_id: string
}

interface NovelInfo {
    id: string
    title: string
    description?: string
    cover_url?: string
    genre?: string
    created_at: string
    author_name?: string // Added for display if possible, though strict DB might strictly link to profiles
}

function ReaderContent() {
    const searchParams = useSearchParams()
    const novelId = searchParams.get('novelId')
    const chapterId = searchParams.get('chapterId')

    const [chapter, setChapter] = useState<ChapterContent | null>(null)
    const [novel, setNovel] = useState<NovelInfo | null>(null)
    const [chapters, setChapters] = useState<ChapterInfo[]>([])
    const [neighbors, setNeighbors] = useState<{ prev: string | null, next: string | null }>({ prev: null, next: null })
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            if (!novelId) return

            setIsLoading(true)
            try {
                // 1. Fetch Novel Info
                const { data: novelData, error: novelError } = await supabase
                    .from('novels')
                    .select('*')
                    .eq('id', novelId)
                    .single()

                if (novelError) throw novelError
                setNovel(novelData)

                // 2. Fetch All Chapters (Metadata only) - Only Published
                const { data: chaptersData, error: chaptersError } = await supabase
                    .from('chapters')
                    .select('id, title, order, created_at')
                    .eq('novel_id', novelId)
                    .eq('is_published', true) // Filter for public
                    .order('order', { ascending: true })

                if (chaptersError) throw chaptersError
                setChapters(chaptersData || [])

                // 3. If chapterId is present, fetch specific content
                if (chapterId) {
                    const { data: currentContent, error: contentError } = await supabase
                        .from('chapters')
                        .select('*')
                        .eq('id', chapterId)
                        .eq('is_published', true) // Strict check for content too
                        .single()

                    if (contentError) {
                        // Handle case where chapter exists but is draft (effectively 404 for reader)
                        setChapter(null)
                        // Optional: Redirect or show error, for now just show overview
                    } else {
                        setChapter(currentContent)
                    }

                    // Determine neighbors
                    if (chaptersData) {
                        const currentIndex = chaptersData.findIndex(c => c.id === chapterId)
                        setNeighbors({
                            prev: currentIndex > 0 ? chaptersData[currentIndex - 1].id : null,
                            next: currentIndex < chaptersData.length - 1 ? chaptersData[currentIndex + 1].id : null
                        })
                    }
                } else {
                    setChapter(null) // Ensure we are in overview mode
                }

            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [novelId, chapterId])

    const getGradient = (id: string) => {
        // Deterministic gradient based on ID char code
        const charCode = id.charCodeAt(0) || 0
        const gradients = [
            'from-blue-200 to-cyan-200 dark:from-blue-900 dark:to-cyan-900',
            'from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900',
            'from-amber-200 to-orange-200 dark:from-amber-900 dark:to-orange-900',
            'from-emerald-200 to-teal-200 dark:from-emerald-900 dark:to-teal-900',
        ]
        return gradients[charCode % gradients.length]
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-[#1a1a1a]">
            <div className="animate-pulse text-neutral-400">正在載入...</div>
        </div>
    }

    if (!novel) {
        return <div className="min-h-screen flex items-center justify-center">找不到小說</div>
    }

    // --- VIEW: READER MODE (Specific Chapter) ---
    if (chapter) {
        return (
            <div
                className="min-h-screen bg-[#FDFBF7] dark:bg-[#1a1a1a] flex flex-col"
                onContextMenu={(e) => e.preventDefault()}
            >
                {/* Minimal Header */}
                <div className="relative flex items-center justify-between px-4 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky top-0 z-10 shadow-sm">
                    <div className="flex items-center gap-2 relative z-10">
                        <Link href={`/read?novelId=${novelId}`}>
                            <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                目錄
                            </Button>
                        </Link>
                        <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700 mx-2 hidden md:block" />
                        <Link href="/" className="hidden md:block">
                            <WritePadLogo className="w-6 h-6" classNameText="text-base" />
                        </Link>
                    </div>

                    {/* Novel Title in Header */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-bold text-neutral-900 dark:text-neutral-100 truncate max-w-[40vw] text-center hidden md:block">
                        {novel.title} <span className="text-neutral-400 mx-1">/</span> {chapter.title}
                    </div>

                    <div className="w-fit flex justify-end relative z-10">
                        <UserProfile />
                    </div>
                </div>

                {/* Content Area */}
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

                        {/* Center: Back to Overview */}
                        <Link href={`/read?novelId=${novelId}`}>
                            <Button variant="ghost" size="icon" title="返回目錄">
                                <AlignLeft className="w-5 h-5" />
                            </Button>
                        </Link>


                        {neighbors.next ? (
                            <Link href={`/read?novelId=${novelId}&chapterId=${neighbors.next}`}>
                                <Button variant="default" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
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

    // --- VIEW: OVERVIEW MODE (Book Info + Chapter List) ---
    return (
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#1a1a1a]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md sticky top-0 z-20">
                <Link href="/explore">
                    <Button variant="ghost" size="sm" className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        返回探索
                    </Button>
                </Link>
                <Link href="/" className="absolute left-1/2 -translate-x-1/2">
                    <WritePadLogo className="h-8 w-8" classNameText="text-lg" />
                </Link>
                <UserProfile />
            </div>

            <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row gap-8 mb-16">
                    {/* Cover Image */}
                    <div className="flex-shrink-0 mx-auto md:mx-0">
                        <div className="w-48 h-64 md:w-64 md:h-80 shadow-2xl rounded-lg overflow-hidden relative group">
                            {novel.cover_url ? (
                                <img
                                    src={novel.cover_url}
                                    alt={novel.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${getGradient(novel.id)} opacity-90`} />
                            )}
                            <div className="absolute inset-0 bg-black/10 hidden dark:block" />
                        </div>
                    </div>

                    {/* Novel Details */}
                    <div className="flex flex-col flex-1 text-center md:text-left">
                        <div className="mb-4">
                            <h1 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-white mb-4 leading-tight">
                                {novel.title}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-neutral-500 dark:text-neutral-400">
                                <span className="flex items-center gap-1 bg-white dark:bg-neutral-800 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm">
                                    <User className="w-4 h-4" />
                                    {/* Ideally fetch author name, using generic for now */}
                                    作者
                                </span>
                                <span className="flex items-center gap-1 bg-white dark:bg-neutral-800 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm">
                                    <BookOpen className="w-4 h-4" />
                                    {chapters.length} 章節
                                </span>
                                <span className="flex items-center gap-1 bg-white dark:bg-neutral-800 px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm">
                                    <Calendar className="w-4 h-4" />
                                    {format(new Date(novel.created_at), 'yyyy-MM-dd')}
                                </span>
                                {novel.genre && (
                                    <span className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-full font-medium">
                                        {novel.genre}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="prose dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed whitespace-pre-wrap">
                            {novel.description || '這本小說還沒有簡介...'}
                        </div>

                        <div className="mt-auto flex gap-4 justify-center md:justify-start">
                            {chapters.length > 0 ? (
                                <Link href={`/read?novelId=${novel.id}&chapterId=${chapters[0].id}`}>
                                    <Button size="lg" className="rounded-full px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
                                        <PlayCircle className="w-5 h-5 mr-2" />
                                        開始閱讀
                                    </Button>
                                </Link>
                            ) : (
                                <Button size="lg" disabled className="rounded-full px-8">
                                    尚無章節
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="h-px bg-neutral-200 dark:bg-neutral-800 mb-12" />

                {/* Chapter Grid */}
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                        <AlignLeft className="w-6 h-6" />
                        目錄
                    </h2>

                    {chapters.length === 0 ? (
                        <div className="text-center py-12 text-neutral-400 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
                            作者還沒有發布任何章節
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {chapters.map((ch) => (
                                <Link key={ch.id} href={`/read?novelId=${novelId}&chapterId=${ch.id}`}>
                                    <div className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-md transition-all h-full flex flex-col items-start gap-2">
                                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                                            第 {ch.order} 章
                                        </span>
                                        <h3 className="font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                                            {ch.title}
                                        </h3>
                                        <span className="mt-auto pt-2 text-xs text-neutral-400">
                                            {format(new Date(ch.created_at), 'MM/dd')}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}

export default function ReaderPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ReaderContent />
        </Suspense>
    )
}
