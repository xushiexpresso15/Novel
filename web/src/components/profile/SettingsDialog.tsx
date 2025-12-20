'use client'

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useAuthStore } from "@/store/useAuthStore"
import { motion, AnimatePresence } from "framer-motion"
import { User, Settings, Palette, ShieldAlert, LogOut, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export function SettingsDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const { user, signOut } = useAuthStore()
    const [activeTab, setActiveTab] = useState('profile')

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'danger', label: 'Danger Zone', icon: ShieldAlert },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl h-[600px] p-0 overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border-white/20 dark:border-white/10 shadow-2xl rounded-3xl flex gap-0 outline-none">
                {/* Sidebar */}
                <div className="w-64 bg-zinc-50/50 dark:bg-black/20 border-r border-black/5 dark:border-white/5 p-6 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold mb-8 px-2 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-indigo-500" />
                            Settings
                        </h2>
                        <nav className="space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon
                                const isActive = activeTab === tab.id
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${isActive
                                                ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 shadow-sm'
                                                : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-zinc-200'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                )
                            })}
                        </nav>
                    </div>

                    <Button
                        variant="ghost"
                        className="justify-start gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => {
                            onOpenChange(false)
                            signOut()
                        }}
                    >
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </Button>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8 bg-white/40 dark:bg-transparent relative">
                    <button onClick={() => onOpenChange(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
                        <X className="w-4 h-4 text-zinc-400" />
                    </button>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            {activeTab === 'profile' && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold">Profile</h3>
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-4xl font-bold text-zinc-300">
                                            {user?.user_metadata?.full_name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-medium">{user?.user_metadata?.full_name || 'User'}</h4>
                                            <p className="text-zinc-500">{user?.email}</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-4 max-w-md">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-500">Display Name</label>
                                            <input
                                                disabled
                                                value={user?.user_metadata?.full_name}
                                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-black/20 border-none outline-none focus:ring-2 ring-indigo-500/20 transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'appearance' && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold">Appearance</h3>
                                    <p className="text-zinc-500">Theme settings coming soon (controlled by System for now).</p>
                                </div>
                            )}

                            {activeTab === 'danger' && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-red-500">Danger Zone</h3>
                                    <div className="p-6 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/20">
                                        <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Delete Account</h4>
                                        <p className="text-sm text-red-600/70 mb-4 leading-relaxed">
                                            Once you delete your account, there is no going back. Please be certain.
                                            All your novels will be permanently deleted.
                                        </p>
                                        <Button variant="destructive" disabled>Delete Account</Button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    )
}
