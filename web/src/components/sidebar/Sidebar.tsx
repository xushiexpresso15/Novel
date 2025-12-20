'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft, Save, Upload, Calendar } from "lucide-react"
import { useChapterStore } from "@/store/useChapterStore"
import { useNovelStore } from "@/store/useNovelStore"
import { toast } from "sonner"

export function Sidebar() {
    const { chapters, setActiveChapter } = useChapterStore()
    const { novels, selectedNovelId } = useNovelStore()

    const activeNovel = novels.find(n => n.id === selectedNovelId)
    const novelTitle = activeNovel?.title || "未命名小說"

    const handleAction = (action: string) => {
        toast.success(`${action} 成功`, {
            description: "功能已模擬執行 (功能開發中)",
            duration: 2000
        })
    }

    return (
        <div className="w-64 h-screen sticky top-0 flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-[#FDFBF7] dark:bg-neutral-900 overflow-hidden">

            {/* Liquid Glass Header */}
            <div className="relative overflow-hidden group">
                {/* Stronger Blurred Background Image or Gradient for Liquid Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-900/20 dark:to-purple-900/20 blur-xl" />

                {/* The "Glass" Layer */}
                <div className="relative z-10 p-6 bg-white/30 dark:bg-black/20 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-sm transition-all flex flex-col items-center justify-center text-center">

                    {/* Back Button - Absolute Top Left */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-4 left-4 h-8 px-2 text-slate-500 hover:text-slate-900 hover:bg-white/40 text-xs uppercase tracking-wider font-bold"
                        onClick={() => setActiveChapter('')}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <h1 className="mt-8 text-2xl font-black text-slate-800 dark:text-slate-100 leading-tight tracking-tight drop-shadow-sm line-clamp-2 w-full text-center" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                        #{novelTitle}
                    </h1>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 space-y-3 relative z-10 font-[family-name:var(--font-geist-sans)]">
                <Button
                    onClick={() => {
                        // Simulate saving all chapters
                        const count = chapters.length;
                        toast.success('儲存成功', {
                            description: `已儲存 ${count} 個章節至草稿`,
                            duration: 2000
                        })
                    }}
                    className="w-full bg-[#EAC435] hover:bg-[#d6b22f] text-white shadow-md transition-all flex flex-col h-auto py-3 items-center gap-1 active:scale-95"
                >
                    <Save className="w-5 h-5 mb-1" />
                    <span className="text-xs font-bold">儲存為草稿</span>
                </Button>

                <Button
                    onClick={() => handleAction('發布')}
                    className="w-full bg-[#5DADE2] hover:bg-[#4a9bc8] text-white shadow-md transition-all flex flex-col h-auto py-3 items-center gap-1 active:scale-95"
                >
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-xs font-bold">發布</span>
                </Button>

                <Button
                    onClick={() => handleAction('預約發文')}
                    className="w-full bg-[#808B96] hover:bg-[#6c7680] text-white shadow-md transition-all flex flex-col h-auto py-3 items-center gap-1 active:scale-95"
                >
                    <Calendar className="w-5 h-5 mb-1" />
                    <span className="text-xs font-bold">預約發文</span>
                </Button>
            </div>
        </div>
    )
}
