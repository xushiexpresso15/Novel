'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Loader2, Settings, LogOut, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { SettingsDialog } from '@/components/profile/SettingsDialog'

export function UserProfile() {
    const { user, signInWithGoogle, signOut, isLoading } = useAuthStore()
    const [isOpen, setIsOpen] = useState(false)
    const [showSettings, setShowSettings] = useState(false)

    // Auth state is managed globally by page.tsx

    if (isLoading) {
        return (
            <Button variant="ghost" size="icon" disabled className="rounded-full">
                <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            </Button>
        )
    }

    if (!user) {
        return (
            <Button
                onClick={signInWithGoogle}
                className="rounded-full bg-white dark:bg-black text-black dark:text-white border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 px-6 shadow-sm"
            >
                Login
            </Button>
        )
    }

    const avatarUrl = user.user_metadata?.avatar_url
    const fullName = user.user_metadata?.full_name || user.email

    return (
        <div className="relative">
            {/* Avatar Trigger */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative h-10 w-10 rounded-full ring-2 ring-white/50 dark:ring-black/50 shadow-lg overflow-hidden"
            >
                <Avatar className="h-full w-full">
                    <AvatarImage src={avatarUrl} alt={fullName} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-400 text-white font-bold">
                        {fullName?.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            </motion.button>

            {/* Custom Glass Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop to close */}
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-14 z-50 w-72 rounded-3xl bg-white/70 dark:bg-zinc-900/80 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-2xl p-4 flex flex-col gap-2 origin-top-right"
                        >
                            {/* Header */}
                            <div className="flex items-center gap-3 p-2 bg-white/50 dark:bg-black/20 rounded-2xl mb-2 border border-black/5 dark:border-white/5">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                    {fullName?.slice(0, 1)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-sm truncate text-slate-800 dark:text-slate-100">{fullName}</p>
                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                </div>
                            </div>

                            {/* Menu Items */}
                            <MenuButton icon={Settings} label="Account Settings" onClick={() => { setIsOpen(false); setShowSettings(true); }} />
                            <MenuButton icon={User} label="My Profile" onClick={() => { setIsOpen(false); setShowSettings(true); }} />

                            <div className="h-px bg-black/5 dark:bg-white/10 my-1" />

                            <MenuButton
                                icon={LogOut}
                                label="Log Out"
                                onClick={() => { setIsOpen(false); signOut(); }}
                                variant="danger"
                            />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
        </div>
    )
}

function MenuButton({ icon: Icon, label, onClick, variant = 'default' }: { icon: any, label: string, onClick: () => void, variant?: 'default' | 'danger' }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-medium ${variant === 'danger'
                    ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500'
                    : 'hover:bg-white/50 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white'
                }`}
        >
            <Icon className={`w-4 h-4 ${variant === 'danger' ? 'text-red-400' : 'text-slate-400'}`} />
            {label}
        </button>
    )
}
