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
            // 1. Update Auth Metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    bio: bio,
                    website: website
                }
            })
            if (authError) throw authError

            // 2. Update Public Profile Table
            // Note: We sync 'fullName' to 'username' in profiles for public display
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    username: fullName,
                    bio: bio,
                    // website might not exist in profiles schema yet, keeping it safe with just bio/name
                })
                .eq('id', user?.id)

            if (profileError) {
                console.warn('Profile table update failed (non-fatal):', profileError)
            }

            // Refresh user data to update UI immediately
            await checkUser()

            // Show success feedback (optional, but good UX)
            // alert('儲存成功！') 
        } catch (error) {
            console.error('Error updating profile:', error)
            alert('更新個人資料失敗')
        } finally {
            setIsLoading(false)
        }
    }

    const tabs = [
        { id: 'profile', label: '個人資料', icon: User },
        { id: 'appearance', label: '外觀設定', icon: Palette },
        { id: 'danger', label: '危險區域', icon: ShieldAlert },
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl h-[600px] p-0 overflow-hidden bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border-white/20 dark:border-white/10 shadow-2xl rounded-3xl flex gap-0 outline-none">
                {/* Sidebar */}
                <div className="w-64 bg-zinc-50/50 dark:bg-black/20 border-r border-black/5 dark:border-white/5 p-6 flex flex-col justify-between">
                    <div>
                        <h2 className="text-xl font-bold mb-8 px-2 flex items-center gap-2">
                            <Settings className="w-5 h-5 text-indigo-500" />
                            設定
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
                        登出
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
                                            <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{user?.user_metadata?.full_name || '使用者'}</h4>
                                            <p className="text-zinc-500 text-sm">{user?.email}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-5 max-w-md">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 ml-1">顯示名稱</label>
                                            <input
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="其他人將如何稱呼您"
                                                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-zinc-200 dark:border-white/5 focus:ring-2 ring-indigo-500/20 outline-none transition-all font-medium placeholder:text-zinc-400"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 ml-1">個人簡介</label>
                                            <textarea
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                placeholder="稍微介紹一下您自己..."
                                                rows={3}
                                                className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-zinc-200 dark:border-white/5 focus:ring-2 ring-indigo-500/20 outline-none transition-all font-medium placeholder:text-zinc-400 resize-none"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 ml-1">個人網站</label>
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
                                                {isLoading ? '儲存中...' : '儲存變更'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'appearance' && (
                                <div className="space-y-8">
                                    <h3 className="text-2xl font-bold">外觀設定</h3>

                                    <div className="space-y-4">
                                        <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 ml-1">編輯器主題</label>
                                        <div className="grid grid-cols-3 gap-4 max-w-lg">
                                            <ThemeOption
                                                icon={Sun}
                                                label="淺色"
                                                isActive={false}
                                                onClick={() => { }}
                                            />
                                            <ThemeOption
                                                icon={Moon}
                                                label="深色"
                                                isActive={false}
                                                onClick={() => { }}
                                            />
                                            <ThemeOption
                                                icon={Laptop}
                                                label="系統"
                                                isActive={true}
                                                onClick={() => { }}
                                            />
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm">
                                        <p>更多關於編輯器介面的客製化選項將在未來的更新中推出。</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'danger' && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-red-500">危險區域</h3>
                                    {!isDeleteConfirm ? (
                                        <div className="p-6 rounded-2xl border border-red-200 bg-red-50 dark:bg-red-900/20">
                                            <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">刪除帳號</h4>
                                            <p className="text-sm text-red-600/70 mb-4 leading-relaxed">
                                                一旦刪除帳號，將無法恢復。請務必確認。
                                                您的所有小說將永久刪除。
                                            </p>
                                            <Button
                                                variant="destructive"
                                                onClick={() => setIsDeleteConfirm(true)}
                                            >
                                                刪除帳號
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="p-6 rounded-2xl border border-red-500 bg-red-100 dark:bg-red-900/40 animate-in fade-in zoom-in-95 duration-200">
                                            <h4 className="font-bold text-red-800 dark:text-red-200 mb-4 text-lg">您確定嗎？</h4>
                                            <p className="text-sm text-red-800/80 dark:text-red-200/80 mb-6">
                                                此操作無法復原。這將永久刪除您的帳號
                                                並從我們的伺服器中刪除您的所有資料。
                                            </p>
                                            <div className="flex gap-3">
                                                <Button
                                                    variant="outline"
                                                    className="flex-1 bg-white dark:bg-black border-red-200 dark:border-red-800"
                                                    onClick={() => setIsDeleteConfirm(false)}
                                                >
                                                    取消
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
                                                            alert(`刪除帳號失敗: ${error.message || error.toString()}`)
                                                        } finally {
                                                            setIsLoading(false)
                                                        }
                                                    }}
                                                >
                                                    {isLoading ? '刪除中...' : '是的，刪除一切'}
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
