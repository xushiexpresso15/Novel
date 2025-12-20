'use client'

import { useNovelStore } from "@/store/useNovelStore"
import { useAuthStore } from "@/store/useAuthStore"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, Home, Settings, LogOut } from "lucide-react"
import { UserProfile } from "@/components/UserProfile"
import { Button } from "@/components/ui/button"
import { LiquidBackground } from "@/components/ui/LiquidBackground"


export function NovelList() {
    const { novels, fetchNovels, createNovel, selectNovel, deleteNovel, setViewMode } = useNovelStore()
    const { user, signOut } = useAuthStore()

    useEffect(() => {
        fetchNovels()
    }, [fetchNovels])

    return (
        <div className="relative min-h-screen text-slate-800 dark:text-slate-100 font-sans selection:bg-indigo-500/30">
            <LiquidBackground />

            {/* Top Bar (Minimal) */}
            <div className="fixed top-0 left-0 right-0 z-40 p-6 flex justify-between items-center pointer-events-none">
                <span className="font-bold text-xl tracking-tight text-slate-900/50 dark:text-white/50">WritePad</span>
                <div className="pointer-events-auto">
                    <UserProfile />
                </div>
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-40">
                {/* Greeting */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-2">
                        Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},
                        <span className="text-indigo-600 dark:text-indigo-400 block mt-1">
                            {user?.user_metadata?.full_name?.split(' ')[0] || 'Writer'}.
                        </span>
                    </h2>
                </motion.div>

                {/* Error Banner */}
                {useNovelStore.getState().error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl backdrop-blur-md">
                        Error: {useNovelStore.getState().error}
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
                        <span className="font-semibold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300">Create New</span>
                    </motion.button>

                    {/* Novel Cards */}
                    {novels.map((novel, index) => (
                        <motion.div
                            key={novel.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            layoutId={novel.id}
                            className="group relative aspect-[3/4] rounded-3xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 transition-all overflow-hidden cursor-pointer"
                            onClick={() => selectNovel(novel.id)}
                        >
                            {/* Gradient Cover */}
                            <div className={`h-3/5 w-full bg-gradient-to-br ${getGradient(index)} opacity-80 group-hover:opacity-100 transition-opacity`} />

                            <div className="p-6 flex flex-col justify-between h-2/5 relative z-10 glass-content">
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
                                            if (confirm('Delete novel?')) deleteNovel(novel.id)
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Floating Dock Navigation (Google Style) */}
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
                <div className="flex items-center gap-2 p-2 bg-white/80 dark:bg-black/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-full shadow-2xl shadow-indigo-500/10">
                    <TooltipButton icon={<Home className="w-5 h-5" />} label="Home" onClick={() => setViewMode('landing')} />
                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 mx-2" />
                    <TooltipButton icon={<Settings className="w-5 h-5" />} label="Settings" onClick={() => alert('Settings coming soon!')} />
                    <TooltipButton icon={<LogOut className="w-5 h-5 text-red-500" />} label="Sign Out" onClick={signOut} />
                </div>
            </div>
        </div>
    )
}

function TooltipButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
    return (
        <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="p-3 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors relative group"
        >
            {icon}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {label}
            </span>
        </motion.button>
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
