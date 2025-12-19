'use client'

import { motion } from 'framer-motion'

export function LiquidBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-zinc-50 dark:bg-black">
            {/* Organic Blob 1 (Indigo) */}
            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -50, 50, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut"
                }}
                className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-400/30 dark:bg-indigo-600/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
            />

            {/* Organic Blob 2 (Cyan) */}
            <motion.div
                animate={{
                    x: [0, -70, 30, 0],
                    y: [0, 60, -40, 0],
                    scale: [1, 1.1, 0.9, 1],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut"
                }}
                className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] bg-cyan-400/30 dark:bg-cyan-600/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
            />

            {/* Organic Blob 3 (Purple) */}
            <motion.div
                animate={{
                    x: [0, 50, -60, 0],
                    y: [0, 30, -30, 0],
                    scale: [1, 1.3, 0.8, 1],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut"
                }}
                className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-purple-400/30 dark:bg-purple-600/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
            />

            {/* Noise Texture Overlay for "Frosted" feel */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http%3A//www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
        </div>
    )
}
