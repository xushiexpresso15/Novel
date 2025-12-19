'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/useAuthStore'
import { ArrowRight, Cloud, Lock, Sparkles, Feather } from 'lucide-react'

export function LandingPage() {
    const { signInWithGoogle } = useAuthStore()

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
        <div className="min-h-screen bg-black text-white selection:bg-white/20 overflow-x-hidden font-sans">
            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/60 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Feather className="w-6 h-6 text-white" />
                        <span className="font-semibold text-lg tracking-tight">WritePad</span>
                    </div>
                    <Button
                        onClick={signInWithGoogle}
                        variant="secondary"
                        className="rounded-full px-6 bg-white text-black hover:bg-gray-200 transition-colors"
                    >
                        Login
                    </Button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="space-y-8"
                    >
                        <motion.h1
                            variants={fadeInUp}
                            className="text-6xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 pb-4"
                        >
                            Your ideas. <br />
                            Unleashed.
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
                        >
                            The ultimate platform for collaborative novel writing.
                            Distraction-free environment with powerful sync capabilities.
                        </motion.p>

                        <motion.div
                            variants={fadeInUp}
                            className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Button
                                onClick={signInWithGoogle}
                                size="lg"
                                className="rounded-full px-8 h-14 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all hover:scale-105"
                            >
                                Start Writing Free <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                            <p className="text-sm text-gray-500 mt-4 sm:mt-0">No credit card required.</p>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Hero Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-20 max-w-6xl mx-auto relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0a0a]"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                    {/* Placeholder for app screenshot - checking / generating abstract UI */}
                    <div className="aspect-[16/9] flex items-center justify-center bg-zinc-900/50">
                        <span className="text-zinc-700 font-mono text-sm">Dashboard Preview</span>
                    </div>
                </motion.div>
            </main>

            {/* Features Section */}
            <section className="py-32 px-6 bg-zinc-950">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:bg-zinc-900 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} WritePad. All rights reserved.</p>
            </footer>
        </div>
    )
}

const features = [
    {
        title: "Real-time Collaboration",
        desc: "Write together with your friends in real-time. See changes instantly as they happen.",
        icon: <Cloud className="w-6 h-6" />
    },
    {
        title: "Thought-Provoking AI",
        desc: "Stuck on a plot point? Let our integrated AI suggest twists and character arcs.",
        icon: <Sparkles className="w-6 h-6" />
    },
    {
        title: "Private & Secure",
        desc: "Your stories are yours. Enterprise-grade encryption keeps your drafts safe.",
        icon: <Lock className="w-6 h-6" />
    }
]
