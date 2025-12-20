'use client'

import React, { useEffect } from 'react'
import { usePublicStore } from '@/store/usePublicStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, User, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function ProfilePage({ params }: { params: { userId: string } }) {
    const { userId } = params
    const { currentProfile, publicNovels, fetchProfile, fetchPublicNovels, isLoading } = usePublicStore()

    useEffect(() => {
        if (userId) {
            fetchProfile(userId)
            fetchPublicNovels(userId)
        }
    }, [userId, fetchProfile, fetchPublicNovels])

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-neutral-950">
            <div className="animate-pulse">Loading...</div>
        </div>
    }

    if (!currentProfile && !isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-neutral-950">
            User not found.
        </div>
    }

    return (
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-neutral-950">
            <div className="max-w-5xl mx-auto px-4 py-12">

                {/* Header Profile Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                        <AvatarImage src={currentProfile?.avatar_url || ''} />
                        <AvatarFallback className="text-4xl bg-indigo-100 text-indigo-600">
                            {(currentProfile?.username || 'U')[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                                {currentProfile?.username || 'Unknown User'}
                            </h1>
                            <p className="text-neutral-500 dark:text-neutral-400 max-w-xl">
                                {currentProfile?.bio || '這個使用者很懶，還沒有寫下自我介紹...'}
                            </p>
                        </div>

                        <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-neutral-500">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                <span>{publicNovels.length} 作品</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Joined {currentProfile?.created_at ? format(new Date(currentProfile.created_at), 'MMMM yyyy') : 'Recently'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800 mb-12" />

                {/* Novels Grid */}
                <div>
                    <h2 className="text-xl font-bold mb-6 text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        已發布作品
                    </h2>

                    {publicNovels.length === 0 ? (
                        <div className="text-center py-12 text-neutral-400">
                            目前沒有公開的作品
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {publicNovels.map(novel => (
                                <Link key={novel.id} href={`/novel/${novel.id}`}>
                                    <div className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 h-full hover:shadow-md hover:border-indigo-500/50 transition-all">
                                        <h3 className="text-lg font-bold mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                                            {novel.title}
                                        </h3>
                                        <div className="text-xs text-neutral-400 mb-4 bg-neutral-100 dark:bg-neutral-800 inline-block px-2 py-1 rounded">
                                            {novel.genre || '未分類'}
                                        </div>
                                        <div className="text-sm text-neutral-500 line-clamp-3 mb-4 h-[4.5em]">
                                            {/* Synopsis could go here if we added it to schema, for now just placeholder or nothing */}
                                            點擊閱讀更多...
                                        </div>
                                        <div className="text-xs text-neutral-400 flex justify-between items-center mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                            <span>{format(new Date(novel.created_at), 'yyyy-MM-dd')}</span>
                                            <span className="text-indigo-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                閱讀 →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
