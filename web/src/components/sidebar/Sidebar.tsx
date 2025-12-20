'use client'

import { Button } from "@/components/ui/button"
import { BookOpen, GripVertical, Plus, Settings, Save, Upload, Calendar, Trash2 } from "lucide-react"
import { useChapterStore } from "@/store/useChapterStore"
import { useNovelStore } from "@/store/useNovelStore"
import { toast } from "sonner"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from "@/lib/utils"

function SortableChapterItem({ chapter, isActive, onClick, onDelete }: { chapter: any, isActive: boolean, onClick: () => void, onDelete: () => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: chapter.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-all relative pr-8",
                isActive
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 shadow-sm"
                    : "hover:bg-black/5 dark:hover:bg-white/5 text-slate-600 dark:text-slate-400",
                isDragging && "opacity-50"
            )}
            onClick={onClick}
        >
            {/* Drag Handle (Visible on Hover or Active) */}
            <div
                {...attributes}
                {...listeners}
                className={cn(
                    "cursor-grab active:cursor-grabbing text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity",
                    isActive && "opacity-50" // Always confirm handle position
                )}
            >
                <GripVertical className="w-4 h-4" />
            </div>

            <span className={cn("font-medium", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground/70")}>
                {(chapter.order + 1).toString().padStart(2, '0')}
            </span>
            <span className="truncate flex-1">{chapter.title}</span>

            {/* Delete Action */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 opacity-0 group-hover:opacity-100 h-6 w-6 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                }}
            >
                <Trash2 className="w-3 h-3" />
            </Button>
        </div>
    )
}

export function Sidebar() {
    const { chapters, activeChapterId, setActiveChapter, reorderChapters, addChapter, deleteChapter } = useChapterStore()
    const { novels, selectedNovelId } = useNovelStore()

    const activeNovel = novels.find(n => n.id === selectedNovelId)
    const novelTitle = activeNovel?.title || "未命名小說"

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (over && active.id !== over.id) {
            reorderChapters(active.id as string, over.id as string)
        }
    }

    const handleAction = (action: string) => {
        // Implement logic here if needed, currently simulated
        toast.success(`${action} 成功`, {
            description: "功能已模擬執行 (功能開發中)",
            duration: 2000
        })
    }

    return (
        <div className="w-64 h-screen sticky top-0 flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-[#FDFBF7] dark:bg-neutral-900 overflow-hidden">

            {/* Liquid Glass Header */}
            <div className="relative p-6 overflow-hidden">
                {/* Background Blobs for Liquid Effect */}
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-indigo-200/40 via-purple-200/40 to-pink-200/40 blur-3xl rounded-full animate-pulse pointer-events-none" />
                <div className="absolute inset-0 bg-white/10 backdrop-blur-md border-b border-white/20 shadow-sm" />

                <div className="relative z-10 flex flex-col gap-1">
                    <div className="flex items-start justify-between">
                        <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 leading-tight tracking-tight drop-shadow-sm line-clamp-2">
                            #{novelTitle}
                        </h1>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-500 hover:text-slate-800 -mr-2 -mt-1">
                            <Settings className="w-4 h-4" />
                        </Button>
                    </div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Novel Settings</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 space-y-3 relative z-10">
                <Button
                    onClick={() => handleAction('儲存草稿')}
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

            {/* Divider */}
            <div className="px-4">
                <div className="h-px bg-neutral-200 dark:bg-neutral-800" />
            </div>

            {/* Chapter List */}
            <div className="flex-1 overflow-y-auto py-4 px-3 relative z-10">
                <div className="flex items-center justify-between px-2 mb-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Chapters</span>
                </div>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={chapters.map(c => c.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-1">
                            {chapters.map((chapter) => (
                                <SortableChapterItem
                                    key={chapter.id}
                                    chapter={chapter}
                                    isActive={chapter.id === activeChapterId}
                                    onClick={() => setActiveChapter(chapter.id)}
                                    onDelete={() => deleteChapter(chapter.id)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            {/* Footer: Add Chapter */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 relative z-10">
                <Button
                    onClick={addChapter}
                    variant="ghost"
                    className="w-full border-2 border-dashed border-neutral-300 hover:border-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-muted-foreground transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    新增章節
                </Button>
            </div>
        </div>
    )
}
