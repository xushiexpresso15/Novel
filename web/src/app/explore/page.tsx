'use client'

import React, { useEffect } from 'react'
import { usePublicStore } from '@/store/usePublicStore'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { UserProfile } from '@/components/UserProfile'
import { WritePadLogo } from "@/components/WritePadLogo"

export default function ExplorePage() {
    const { exploreNovels, fetchExploreNovels, isLoading } = usePublicStore()

    useEffect(() => {
        fetchExploreNovels()
    }, [fetchExploreNovels])

    const getGradient = (index: number) => {
        const gradients = [
            'from-blue-200 to-cyan-200 dark:from-blue-900 dark:to-cyan-900',
            'from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900',
            'from-amber-200 to-orange-200 dark:from-amber-900 dark:to-orange-900',
            'from-emerald-200 to-teal-200 dark:from-emerald-900 dark:to-teal-900',
        ]
        return gradients[index % gradients.length]
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-neutral-950">
            {/* Simple Header */}
            <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <WritePadLogo className="h-8 w-8" classNameText="text-xl" />
                        <span className="ml-2 border-l border-neutral-300 dark:border-neutral-700 pl-3 font-bold text-xl text-neutral-900 dark:text-neutral-100">探索</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost">我的書桌</Button>
                        </Link>
                        <UserProfile />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-neutral-900 dark:text-neutral-100 mb-2">
                            探索作品
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400">
                            發現來自世界各地的精彩故事
                        </p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-64 bg-neutral-100 dark:bg-neutral-900 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : exploreNovels.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
                        <p className="text-neutral-400">目前還沒有公開的作品</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {exploreNovels.map((novel, index) => {
                            // @ts-ignore
                            const author = novel.profiles || { username: 'Unknown', avatar_url: '' }
                            return (
                                <Link key={novel.id} href={`/read?novelId=${novel.id}`} className="block group h-full">
                                    <div className="h-full flex flex-col hover:shadow-xl transition-all duration-300 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">

                                        {/* Cover Image Area */}
                                        <div className="h-48 w-full relative overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                                            {novel.cover_url ? (
                                                <img
                                                    src={novel.cover_url}
                                                    alt={novel.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className={`w-full h-full bg-gradient-to-br ${getGradient(index)} opacity-80`} />
                                            )}

                                            {/* Author Overlay (Bottom Left of Cover) */}
                                            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent flex items-center gap-3">
                                                <Avatar className="w-8 h-8 border border-white/50 shadow-sm">
                                                    <AvatarImage src={author.avatar_url || ''} />
                                                    <AvatarFallback className="bg-white/20 text-white backdrop-blur-md text-xs">
                                                        {author.username?.[0] || 'U'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-white font-medium text-sm drop-shadow-md truncate">
                                                    {author.username}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-5 flex flex-col flex-1">
                                            <div className="flex justify-between items-center mb-3">
                                                <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800">
                                                    {novel.genre || '未分類'}
                                                </Badge>
                                                <span className="text-xs text-neutral-400 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(novel.created_at), 'MM/dd')}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-bold leading-tight mb-3 text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                                                {novel.title}
                                            </h3>

                                            <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed mb-4 flex-1">
                                                {novel.description || '作者很懶，沒有寫下簡介...'}
                                            </p>

                                            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 mt-auto flex items-center justify-between text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                                                <span className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                                    <BookOpen className="w-4 h-4" />
                                                    立即閱讀
                                                </span>
                                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}
