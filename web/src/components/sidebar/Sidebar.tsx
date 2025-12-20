import { Button } from "@/components/ui/button"
import { ChevronLeft, Save, Upload, Calendar } from "lucide-react"
import { useChapterStore } from "@/store/useChapterStore"
import { useNovelStore } from "@/store/useNovelStore"
import { toast } from "sonner"
import { useState } from "react"
import { ScheduleDialog } from "./ScheduleDialog"

export function Sidebar() {
    const { activeChapterId, publishChapter, scheduleChapter, setActiveChapter } = useChapterStore()
    const { novels, selectedNovelId } = useNovelStore()

    const [scheduleOpen, setScheduleOpen] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)

    const activeNovel = novels.find(n => n.id === selectedNovelId)
    const novelTitle = activeNovel?.title || "未命名小說"

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
                        onClick={() => setActiveChapter(null)}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <div className="flex flex-col items-center mt-8 w-full">
                        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest text-center" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                            {novelTitle}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 space-y-3 relative z-10 font-[family-name:var(--font-geist-sans)]">
                <Button
                    onClick={() => {
                        toast.success('儲存成功', {
                            description: `章節已儲存為草稿`,
                            duration: 2000
                        })
                    }}
                    className="w-full bg-[#EAC435] hover:bg-[#d6b22f] text-white shadow-md transition-all flex flex-col h-auto py-3 items-center gap-1 active:scale-95"
                >
                    <Save className="w-5 h-5 mb-1" />
                    <span className="text-xs font-bold">儲存為草稿</span>
                </Button>

                <Button
                    onClick={async () => {
                        if (activeChapterId) {
                            setIsPublishing(true)
                            await publishChapter(activeChapterId)
                            setIsPublishing(false)
                        } else {
                            toast.error("請先選擇章節")
                        }
                    }}
                    disabled={isPublishing}
                    className="w-full bg-[#5DADE2] hover:bg-[#4a9bc8] text-white shadow-md transition-all flex flex-col h-auto py-3 items-center gap-1 active:scale-95"
                >
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-xs font-bold">{isPublishing ? '發布中...' : '立即發布'}</span>
                </Button>

                <Button
                    onClick={() => {
                        if (activeChapterId) {
                            setScheduleOpen(true)
                        } else {
                            toast.error("請先選擇章節")
                        }
                    }}
                    className="w-full bg-[#808B96] hover:bg-[#6c7680] text-white shadow-md transition-all flex flex-col h-auto py-3 items-center gap-1 active:scale-95"
                >
                    <Calendar className="w-5 h-5 mb-1" />
                    <span className="text-xs font-bold">預約發文</span>
                </Button>
            </div>

            <ScheduleDialog
                open={scheduleOpen}
                onOpenChange={setScheduleOpen}
                onConfirm={async (date) => {
                    if (activeChapterId) {
                        setIsPublishing(true)
                        await scheduleChapter(activeChapterId, date)
                        setIsPublishing(false)
                        setScheduleOpen(false)
                    }
                }}
                isLoading={isPublishing}
            />
        </div>
    )
}
