'use client'

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useAuthStore } from "@/store/useAuthStore"
import { motion, AnimatePresence } from "framer-motion"
import { User, Settings, Palette, ShieldAlert, LogOut, Laptop, Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"

export function SettingsDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const { user, signOut, checkUser } = useAuthStore()
    const [activeTab, setActiveTab] = useState('profile')
    const [isLoading, setIsLoading] = useState(false)
    const [isDeleteConfirm, setIsDeleteConfirm] = useState(false)

    // Profile State
    const [fullName, setFullName] = useState('')
    const [bio, setBio] = useState('')
    const [website, setWebsite] = useState('')

    useEffect(() => {
        if (user) {
            setFullName(user.user_metadata?.full_name || '')
            setBio(user.user_metadata?.bio || '')
            setWebsite(user.user_metadata?.website || '')
        }
    }, [user, open])

    const handleUpdateProfile = async () => {
        setIsLoading(true)
        try {
            const { error } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    bio: bio,
                    website: website
                }
            })
            if (error) throw error
            // Refresh user data to update UI immediately
            await checkUser()
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('Failed to update profile')
        } finally {
            setIsLoading(false)
        }
    }

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
                <div className="flex-1 p-8 bg-white/40 dark:bg-transparent relative overflow-y-auto">

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
                                <div className="space-y-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-4xl font-bold text-zinc-300 shadow-inner">
                                            {user?.user_metadata?.full_name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{user?.user_metadata?.full_name || 'User'}</h4>
                                            <p className="text-zinc-500 text-sm">{user?.email}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-5 max-w-md">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 ml-1">Display Name</label>
                                            <input
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="How others see you"
                                                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-zinc-200 dark:border-white/5 focus:ring-2 ring-indigo-500/20 outline-none transition-all font-medium placeholder:text-zinc-400"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 ml-1">Bio</label>
                                            <textarea
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                placeholder="Tell us a little about yourself..."
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-zinc-200 dark:border-white/5 focus:ring-2 ring-indigo-500/20 outline-none transition-all font-medium placeholder:text-zinc-400 resize-none"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 ml-1">Website</label>
                                            <input
                                                value={website}
                                                onChange={(e) => setWebsite(e.target.value)}
                                                placeholder="https://your-site.com"
                                                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-zinc-200 dark:border-white/5 focus:ring-2 ring-indigo-500/20 outline-none transition-all font-medium placeholder:text-zinc-400"
                                            />
                                        </div>

                                        <div className="pt-4">
                                            <Button
                                                onClick={handleUpdateProfile}
                                                disabled={isLoading}
                                                className="rounded-xl px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
                                            >
                                                {isLoading ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'appearance' && (
                                <div className="space-y-8">
                                    <h3 className="text-2xl font-bold">Appearance</h3>

                                    <div className="space-y-4">
                                        <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 ml-1">Editor Theme</label>
                                        <div className="grid grid-cols-3 gap-4 max-w-lg">
                                            <ThemeOption
                                                icon={Sun}
                                                label="Light"
                                                isActive={false}
                                                onClick={() => { }}
                                            />
                                            <ThemeOption
                                                icon={Moon}
                                                label="Dark"
                                                isActive={false}
                                                onClick={() => { }}
                                            />
                                            <ThemeOption
                                                icon={Laptop}
                                                label="System"
                                                isActive={true}
                                                onClick={() => { }}
                                            />
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm">
                                        <p>More detailed customization options for the editor interface will be available in a future update.</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'danger' && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-red-500">Danger Zone</h3>
                                    {!isDeleteConfirm ? (
                                        <div className="p-6 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/20">
                                            <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Delete Account</h4>
                                            <p className="text-sm text-red-600/70 mb-4 leading-relaxed">
                                                Once you delete your account, there is no going back. Please be certain.
                                                All your novels will be permanently deleted.
                                            </p>
                                            <Button
                                                variant="destructive"
                                                onClick={() => setIsDeleteConfirm(true)}
                                            >
                                                Delete Account
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="p-6 rounded-2xl border border-red-500 bg-red-100 dark:bg-red-900/40 animate-in fade-in zoom-in-95 duration-200">
                                            <h4 className="font-bold text-red-800 dark:text-red-200 mb-4 text-lg">Are you absolutely sure?</h4>
                                            <p className="text-sm text-red-800/80 dark:text-red-200/80 mb-6">
                                                This action cannot be undone. This will permanently delete your account
                                                and remove all your data from our servers.
                                            </p>
                                            <div className="flex gap-3">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 bg-white dark:bg-black border-red-200 dark:border-red-800"
                                                    onClick={() => setIsDeleteConfirm(false)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    className="flex-1"
                                                    disabled={isLoading}
                                                    onClick={async () => {
                                                        setIsLoading(true)
                                                        try {
                                                            const { error } = await supabase.rpc('delete_own_account')
                                                            if (error) throw error
                                                            await signOut()
                                                            onOpenChange(false)
                                                        } catch (error: any) {
                                                            console.error('Delete account error:', error)
                                                            alert(`Failed to delete account: ${error.message || error.toString()}`)
                                                        } finally {
                                                            setIsLoading(false)
                                                        }
                                                    }}
                                                >
                                                    {isLoading ? 'Deleting...' : 'Yes, Delete Everything'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </DialogContent>
        </Dialog>
    )
}

function ThemeOption({ icon: Icon, label, isActive, onClick }: { icon: React.ElementType, label: string, isActive: boolean, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${isActive
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300'
                : 'border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 text-zinc-500'
                }`}
        >
            <Icon className="w-6 h-6" />
            <span className="font-medium text-sm">{label}</span>
        </button>
    )
}
