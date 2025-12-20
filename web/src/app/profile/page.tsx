'use client'

import React, { useEffect, Suspense, useState, useRef } from 'react'
import { usePublicStore } from '@/store/usePublicStore'
import { useAuthStore } from '@/store/useAuthStore'
import { useMailStore } from '@/store/useMailStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { BookOpen, User, Calendar, Globe, ChevronDown, ChevronUp } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { UserProfile } from '@/components/UserProfile'
import { Button } from '@/components/ui/button'
import { WritePadLogo } from "@/components/WritePadLogo"

function ProfileContent() {
    const searchParams = useSearchParams()
    const userId = searchParams.get('id')
    const { currentProfile, publicNovels, fetchProfile, fetchPublicNovels, isLoading } = usePublicStore()
    const [isBioExpanded, setIsBioExpanded] = useState(false)
    const [isOverflowing, setIsOverflowing] = useState(false)
    const bioRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (userId) {
            fetchProfile(userId)
            fetchPublicNovels(userId)
        }
    }, [userId, fetchProfile, fetchPublicNovels])

    useEffect(() => {
        if (bioRef.current) {
            // Check if scrollHeight is greater than clientHeight to detect truncation
            const { scrollHeight, clientHeight } = bioRef.current
            setIsOverflowing(scrollHeight > clientHeight)
        }
    }, [currentProfile?.bio, isBioExpanded])

    const getGradient = (index: number) => {
        const gradients = [
            'from-blue-200 to-cyan-200 dark:from-blue-900 dark:to-cyan-900',
            'from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900',
            'from-amber-200 to-orange-200 dark:from-amber-900 dark:to-orange-900',
            'from-emerald-200 to-teal-200 dark:from-emerald-900 dark:to-teal-900',
        ]
        return gradients[index % gradients.length]
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-neutral-950">
            <div className="animate-pulse">Loading...</div>
        </div>
    }

    if (!userId) return <div>Invalid User ID</div>

    return (
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-neutral-950">
            {/* Sticky Header */}
            <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-20">
                <div className="max-w-6xl mx-auto px-8 md:px-20 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <WritePadLogo className="h-8 w-8" classNameText="text-xl" />
                    </Link>
                    <UserProfile />
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-8 md:px-20 py-12">
                {/* Header Profile Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg shrink-0">
                        <AvatarImage src={currentProfile?.avatar_url || ''} />
                        <AvatarFallback className="text-4xl bg-indigo-100 text-indigo-600">
                            {(currentProfile?.username || 'U')[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 text-center md:text-left space-y-4 w-full">
                        <div>
                            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                                {currentProfile?.username || 'Unknown User'}
                            </h1>

                            <div className="relative">
                                <div
                                    ref={bioRef}
                                    className={`text-neutral-500 dark:text-neutral-400 max-w-xl text-base leading-relaxed whitespace-pre-wrap ${!isBioExpanded ? 'line-clamp-3' : ''
                                        }`}
                                >
                                    {currentProfile?.bio || '這個使用者很懶，還沒有寫下自我介紹...'}
                                </div>
                                {(isOverflowing || isBioExpanded) && (
                                    <button
                                        onClick={() => setIsBioExpanded(!isBioExpanded)}
                                        className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 hover:underline flex items-center gap-1 md:mx-0 mx-auto"
                                    >
                                        {isBioExpanded ? (
                                            <>收起 <ChevronUp className="w-3 h-3" /></>
                                        ) : (
                                            <>顯示更多... <ChevronDown className="w-3 h-3" /></>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {currentProfile?.website && (
                            <a
                                href={currentProfile.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline break-all"
                            >
                                <Globe className="w-4 h-4 shrink-0" />
                                {currentProfile.website}
                            </a>
                        )}

                        <div className="flex items-center justify-center md:justify-start gap-6 text-sm text-neutral-500 pt-2">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                <span>{publicNovels.length} 作品</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>加入時間 {currentProfile?.created_at ? format(new Date(currentProfile.created_at), 'yyyy MMMM') : 'Recently'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Send Message Action (Only if looking at others) */}
                    {/* Note: In real app compare userId with authId. For now, show always or check store. */}
                    <div className="pt-4">
                        <SendMessageButton targetUserId={userId} />
                    </div>
                </div>
            </div>

            <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800 mb-12" />

            {/* Novels Grid */}
            <div className="max-w-6xl mx-auto px-8 md:px-20 pb-20">
                <h2 className="text-xl font-bold mb-6 text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    已發布作品
                </h2>

                {publicNovels.length === 0 ? (
                    <div className="text-center py-12 text-neutral-400">
                        目前沒有公開的作品
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {publicNovels.map((novel, index) => (
                            <Link key={novel.id} href={`/read?novelId=${novel.id}`} className="block h-full group">
                                <div className="bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden h-full hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/50 transition-all duration-300 flex flex-col">

                                    {/* Cover Image - Portrait Ratio 2:3 */}
                                    <div className="aspect-[2/3] w-full relative overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                                        {novel.cover_url ? (
                                            <img
                                                src={novel.cover_url}
                                                alt={novel.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        ) : (
                                            <div className={`w-full h-full bg-gradient-to-br ${getGradient(index)} flex items-center justify-center p-4`}>
                                                <span className="text-2xl font-bold text-white opacity-50 select-none">
                                                    {novel.title[0]}
                                                </span>
                                            </div>
                                        )}
                                        {/* Overlay Shadow */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    <div className="p-4 flex flex-col flex-1">
                                        <h3 className="text-base font-bold mb-1 group-hover:text-indigo-500 transition-colors line-clamp-1 text-neutral-900 dark:text-neutral-100" title={novel.title}>
                                            {novel.title}
                                        </h3>

                                        <div className="flex items-center gap-2 mb-3">
                                            {novel.genre && (
                                                <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                                                    {novel.genre}
                                                </span>
                                            )}
                                            <span className="text-[10px] text-neutral-400">
                                                {format(new Date(novel.created_at), 'MM/dd')}
                                            </span>
                                        </div>

                                        <div className="mt-auto pt-2 border-t border-dashed border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
                                            <span className="flex items-center gap-1 group-hover:text-indigo-500 transition-colors">
                                                開始閱讀
                                            </span>
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function SendMessageButton({ targetUserId }: { targetUserId: string }) {
    const { setIsOpen, setActiveConversation } = useMailStore()
    const { user: authUser } = useAuthStore()

    if (!authUser || authUser.id === targetUserId) return null

    return (
        <Button
            onClick={() => {
                setActiveConversation(targetUserId)
                setIsOpen(true)
            }}
            size="sm"
            className="rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
        >
            <span className="mr-2">✉️</span> 傳送訊息
        </Button>
    )
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProfileContent />
        </Suspense>
    )
}
