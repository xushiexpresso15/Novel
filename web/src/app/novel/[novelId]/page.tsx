'use client'

import React, { useEffect } from 'react'
import { usePublicStore } from '@/store/usePublicStore'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Clock, List } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useParams } from 'next/navigation' // Add import

export default function NovelLandingPage() { // Remove props
    const params = useParams()
    const novelId = params?.novelId as string
    const { currentNovel, currentChapters, fetchNovelDetails, fetchPublicChapters, isLoading } = usePublicStore()

    useEffect(() => {
        if (novelId) {
            fetchNovelDetails(novelId)
            fetchPublicChapters(novelId)
        }
    }, [novelId, fetchNovelDetails, fetchPublicChapters])

    if (isLoading || !currentNovel) {
        return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-neutral-950">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-12 w-12 bg-neutral-200 rounded-full"></div>
                <div className="h-4 w-32 bg-neutral-200 rounded"></div>
            </div>
        </div>
    }

    // @ts-ignore - profiles accessed via join
    const author = currentNovel.profiles || { username: 'Unknown', avatar_url: '' }

    return (
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-neutral-950">
            {/* Hero Section */}
            <div className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                    <Link href={`/u/${currentNovel.user_id}`} className="inline-flex items-center text-sm text-neutral-500 hover:text-neutral-800 mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        返回作者頁面
                    </Link>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Abstract Cover */}
                        <div className="w-32 h-48 md:w-48 md:h-72 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-xl shrink-0 flex items-center justify-center text-white font-serif text-4xl opacity-90">
                            {currentNovel.title[0]}
                        </div>

                        <div className="flex-1 space-y-6">
                            <div className="space-y-2">
                                <span className="text-xs font-bold tracking-wider text-indigo-600 uppercase bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">
                                    {currentNovel.genre || '未分類'}
                                </span>
                                <h1 className="text-4xl md:text-5xl font-black text-neutral-900 dark:text-neutral-100 leading-tight">
                                    {currentNovel.title}
                                </h1>
                            </div>

                            <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src={author.avatar_url} />
                                    <AvatarFallback>{author.username[0]}</AvatarFallback>
                                </Avatar>
                                <span className="font-medium">{author.username}</span>
                                <span className="text-neutral-300">•</span>
                                <span className="text-sm">最後更新 {format(new Date(currentNovel.created_at), 'yyyy-MM-dd')}</span>
                            </div>

                            {/* Description Section */}
                            <div className="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl">
                                {currentNovel.description || '作者尚未填寫簡介...'}
                            </div>

                            <div className="flex gap-4 pt-4">
                                {currentChapters.length > 0 && (
                                    <Link href={`/novel/${novelId}/${currentChapters[0].id}`}>
                                        <Button size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
                                            <BookOpen className="w-4 h-4 mr-2" />
                                            開始閱讀
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chapters List */}
            <div className="max-w-3xl mx-auto px-6 py-12">
                <div className="flex items-center gap-2 mb-8 text-neutral-900 dark:text-neutral-100 font-bold text-xl">
                    <List className="w-5 h-5" />
                    <span>章節列表 ({currentChapters.length})</span>
                </div>

                <div className="space-y-2">
                    {currentChapters.map((chapter) => (
                        <Link
                            key={chapter.id}
                            href={`/novel/${novelId}/${chapter.id}`}
                            className="block group"
                        >
                            <div className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg group-hover:border-indigo-500 transition-colors">
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-mono text-neutral-400 w-8">
                                        #{chapter.order}
                                    </span>
                                    <span className="font-medium text-neutral-700 dark:text-neutral-200 group-hover:text-indigo-600 transition-colors">
                                        {chapter.title}
                                    </span>
                                </div>
                                <div className="text-xs text-neutral-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {format(new Date(chapter.created_at), 'MM-dd')}
                                </div>
                            </div>
                        </Link>
                    ))}

                    {currentChapters.length === 0 && (
                        <div className="text-center py-12 text-neutral-400 italic bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-dashed border-neutral-200">
                            作者尚未發布任何章節
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
