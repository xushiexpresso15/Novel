import { useNovelStore } from "@/store/useNovelStore"
import { useAuthStore } from "@/store/useAuthStore"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, Home, Settings, LogOut, Compass } from "lucide-react"
import { UserProfile } from "@/components/UserProfile"
import { Button } from "@/components/ui/button"
import { LiquidBackground } from "@/components/ui/LiquidBackground"
import Link from 'next/link'
import { WritePadLogo } from "@/components/WritePadLogo"


export function NovelList() {
    const { novels, fetchNovels, createNovel, selectNovel, deleteNovel, setViewMode } = useNovelStore()
    const { user, signOut } = useAuthStore()

    useEffect(() => {
        fetchNovels()
    }, [fetchNovels])

    const hour = new Date().getHours()
    const greeting = hour < 12 ? '早安' : hour < 18 ? '午安' : '晚安'

    return (
        <div className="relative min-h-screen text-slate-800 dark:text-slate-100 font-sans selection:bg-indigo-500/30">
            <LiquidBackground />

            {/* Standard Header (Same as other pages) */}
            <header className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <WritePadLogo className="h-8 w-8" classNameText="text-xl" />
                    </Link>
                    <UserProfile />
                </div>
            </header>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
                {/* Greeting */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-2">
                        {greeting}，
                        <span className="text-indigo-600 dark:text-indigo-400 block mt-1">
                            {user?.user_metadata?.full_name?.split(' ')[0] || '寫作助手'}。
                        </span>
                    </h2>
                </motion.div>

                {/* Error Banner */}
                {useNovelStore.getState().error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl backdrop-blur-md">
                        錯誤: {useNovelStore.getState().error}
                    </motion.div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Create New Card */}
                    <motion.button
                        whileHover={{ scale: 1.02, rotate: -1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={createNovel}
                        className="group relative aspect-[3/4] rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-white/30 dark:bg-black/20 backdrop-blur-sm flex flex-col items-center justify-center gap-4 transition-all"
                    >
                        <div className="w-20 h-20 rounded-full bg-white/50 dark:bg-white/10 group-hover:bg-indigo-500 group-hover:text-white dark:group-hover:bg-indigo-500 flex items-center justify-center transition-colors shadow-lg">
                            <Plus className="w-8 h-8 transition-transform group-hover:rotate-90" />
                        </div>
                        <span className="font-semibold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300">建立新小說</span>
                    </motion.button>

                    {/* Novel Cards */}
                    {novels.map((novel, index) => (
                        <Link
                            key={novel.id}
                            href={`/novel?id=${novel.id}`}
                            className="block"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                                layoutId={novel.id}
                                className="group relative aspect-[3/4] rounded-3xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 transition-all overflow-hidden cursor-pointer"
                            >
                                {/* Cover Image or Gradient */}
                                {novel.cover_url ? (
                                    <div className="h-3/5 w-full relative overflow-hidden group-hover:opacity-100 transition-opacity">
                                        <img
                                            src={novel.cover_url}
                                            alt={novel.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                    </div>
                                ) : (
                                    <div className={`h-3/5 w-full bg-gradient-to-br ${getGradient(index)} opacity-80 group-hover:opacity-100 transition-opacity`} />
                                )}

                                <div className="p-6 flex flex-col justify-between h-2/5 relative z-10 glass-content bg-white/50 dark:bg-black/50 backdrop-blur-md">
                                    <div>
                                        <h3 className="font-bold text-xl leading-tight line-clamp-2 mb-2 text-slate-800 dark:text-slate-100">{novel.title}</h3>
                                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                                            {new Date(novel.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="absolute top-[-20px] right-4 bg-white dark:bg-slate-900 p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-red-500 hover:bg-red-50 rounded-full"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (confirm('確定要刪除這本小說嗎？')) deleteNovel(novel.id)
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                            </motion.div>
                        </Link>
                    ))}
                </div>
            </main >
        </div >
    )
}

function getGradient(index: number) {
    const gradients = [
        'from-blue-200 to-cyan-200 dark:from-blue-900 dark:to-cyan-900',
        'from-purple-200 to-pink-200 dark:from-purple-900 dark:to-pink-900',
        'from-amber-200 to-orange-200 dark:from-amber-900 dark:to-orange-900',
        'from-emerald-200 to-teal-200 dark:from-emerald-900 dark:to-teal-900',
    ]
    return gradients[index % gradients.length]
}
