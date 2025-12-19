'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Feather, Laptop, ExternalLink } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useNovelStore } from '@/store/useNovelStore'
import { Button } from '@/components/ui/button'
import { LiquidBackground } from '@/components/ui/LiquidBackground'

export function LandingPage() {
    const { user, signInWithGoogle } = useAuthStore()
    const { setViewMode } = useNovelStore()

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    }

    return (
        <div className="relative min-h-screen text-slate-800 dark:text-slate-100 overflow-hidden font-sans">
            <LiquidBackground />

            {/* Content Wrapper - Glass Effect handled by items or specific layers */}

            {/* Navigation: Floating Glass Strip */}
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none"
            >
                <div className="pointer-events-auto bg-white/40 dark:bg-black/30 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-full px-6 py-3 flex items-center gap-8 shadow-lg shadow-black/5">
                    <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                        WritePad
                    </span>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <Button
                                onClick={() => setViewMode('dashboard')}
                                className="rounded-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 transition-all active:scale-95"
                            >
                                Enter Workspace <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={signInWithGoogle}
                                variant="ghost"
                                className="rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                            >
                                Login
                            </Button>
                        )}
                    </div>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center pt-20">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="max-w-4xl mx-auto space-y-8"
                >
                    {/* Badge */}
                    <motion.div variants={fadeInUp} className="flex justify-center">
                        <span className="px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-white/20 text-sm font-medium text-indigo-600 dark:text-indigo-300 flex items-center gap-2 shadow-sm">
                            <Sparkles className="w-4 h-4" />
                            Reimagined for Creators
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        variants={fadeInUp}
                        className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-indigo-900 via-slate-800 to-black dark:from-white dark:via-slate-200 dark:to-slate-400"
                    >
                        Craft Your <br />
                        <span className="italic font-serif text-indigo-600 dark:text-indigo-400">Masterpiece.</span>
                    </motion.h1>

                    {/* Subheadline */}
                    <motion.p
                        variants={fadeInUp}
                        className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
                    >
                        A distract-free writing environment that flows like water.
                        <br />
                        Simple. Powerful. Yours.
                    </motion.p>

                    {/* CTA */}
                    <motion.div variants={fadeInUp} className="pt-8">
                        {user ? (
                            <Button
                                onClick={() => setViewMode('dashboard')}
                                className="h-16 px-10 rounded-full text-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all hover:scale-105 active:scale-95"
                            >
                                Go to Dashboard
                            </Button>
                        ) : (
                            <Button
                                onClick={signInWithGoogle}
                                className="h-16 px-10 rounded-full text-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 shadow-xl transition-all hover:scale-105 active:scale-95"
                            >
                                Start Writing Free
                            </Button>
                        )}
                    </motion.div>
                </motion.div>
            </main>

            {/* Feature Cards Floating */}
            <div className="absolute top-1/2 left-4 md:left-20 transform -translate-y-1/2 hidden xl:block pointer-events-none opacity-60">
                <motion.div
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="p-6 rounded-3xl bg-white/20 dark:bg-black/20 backdrop-blur-2xl border border-white/20 rotate-[-6deg]"
                >
                    <Feather className="w-12 h-12 text-slate-800 dark:text-white mb-4" />
                    <div className="h-2 w-24 bg-slate-800/20 dark:bg-white/20 rounded-full mb-2" />
                    <div className="h-2 w-16 bg-slate-800/20 dark:bg-white/20 rounded-full" />
                </motion.div>
            </div>

            <div className="absolute top-1/2 right-4 md:right-20 transform -translate-y-1/2 hidden xl:block pointer-events-none opacity-60">
                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="p-6 rounded-3xl bg-white/20 dark:bg-black/20 backdrop-blur-2xl border border-white/20 rotate-[6deg]"
                >
                    <Laptop className="w-12 h-12 text-slate-800 dark:text-white mb-4" />
                    <div className="h-2 w-24 bg-slate-800/20 dark:bg-white/20 rounded-full mb-2" />
                    <div className="h-2 w-16 bg-slate-800/20 dark:bg-white/20 rounded-full" />
                </motion.div>
            </div>
        </div>
    )
}
