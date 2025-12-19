'use client'

import { useNovelStore } from "@/store/useNovelStore"
import { useAuthStore } from "@/store/useAuthStore"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Book, Trash2, Clock } from "lucide-react"
import { UserProfile } from "@/components/UserProfile"
import { Button } from "@/components/ui/button"

export function NovelList() {
    const { novels, fetchNovels, createNovel, selectNovel, deleteNovel, isLoading } = useNovelStore()
    const { user } = useAuthStore()

    useEffect(() => {
        fetchNovels()
    }, [])

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black text-foreground selection:bg-indigo-500/30">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-black/5 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <h1 className="text-xl font-semibold tracking-tight">WritePad</h1>
                    <UserProfile />
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Hero / Welcome */}
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Writer'}.</h2>
                    <p className="text-muted-foreground text-lg">Ready to continue your masterpiece?</p>

                    {/* Error Banner */}
                    {/* @ts-ignore */}
                    {useNovelStore.getState().error && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">
                            {/* @ts-ignore */}
                            Error: {useNovelStore.getState().error}
                        </div>
                    )}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Create New Card */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={createNovel}
                        className="group relative aspect-[3/4] rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 flex flex-col items-center justify-center gap-4 transition-colors"
                    >
                        <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/30 flex items-center justify-center transition-colors">
                            <Plus className="w-8 h-8 text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                        </div>
                        <span className="font-medium text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Create New Novel</span>
                    </motion.button>

                    {/* Novel Cards */}
                    {novels.map((novel) => (
                        <motion.div
                            key={novel.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            layoutId={novel.id}
                            className="group relative aspect-[3/4] rounded-2xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer"
                            onClick={() => selectNovel(novel.id)}
                        >
                            {/* Decorative Cover Gradient */}
                            <div className="h-1/2 w-full bg-gradient-to-br from-indigo-100 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/20" />

                            <div className="p-5 flex flex-col justify-between h-1/2">
                                <div>
                                    <div className="flex items-start justify-between mb-2">
                                        <Book className="w-5 h-5 text-indigo-500" />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 -mr-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (confirm('Are you sure you want to delete this novel?')) deleteNovel(novel.id)
                                            }}
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                    <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-1">{novel.title}</h3>
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground mt-auto">
                                    <Clock className="w-3 h-3 mr-1" />
                                    <span>{new Date(novel.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    )
}
