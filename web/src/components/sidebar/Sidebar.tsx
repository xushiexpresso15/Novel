'use client'

import { Button } from "@/components/ui/button"
import { BookOpen, GripVertical, Plus, Settings, Save, Upload, Calendar } from "lucide-react"
import { useChapterStore } from "@/store/useChapterStore"
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

function SortableChapterItem({ chapter, isActive, onClick }: { chapter: any, isActive: boolean, onClick: () => void }) {
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
                "group flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-all",
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
            <span className="truncate">{chapter.title}</span>
        </div>
    )
}

export function Sidebar() {
    const { chapters, activeChapterId, setActiveChapter, reorderChapters, addChapter } = useChapterStore()

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

    return (
        <div className="w-64 h-screen sticky top-0 flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-[#FDFBF7] dark:bg-neutral-900 overflow-hidden">
            {/* Header: Novel Info */}
            <div className="p-4 flex flex-col items-center gap-3 border-b border-neutral-200 dark:border-neutral-800 bg-[#fae8b0] dark:bg-amber-900/40">
                {/* Cover / Badge Placeholder */}
                <div className="relative w-20 h-20 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                    {/* Placeholder for cover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-purple-400 opacity-80" />
                    <span className="relative z-10 font-bold text-white text-xl drop-shadow-md">NOVEL</span>
                </div>

                <div className="text-center">
                    <h3 className="font-bold text-amber-900 dark:text-amber-100"># 1</h3>
                    <p className="text-xs text-amber-800/70 dark:text-amber-200/70 font-medium">ROMANCE</p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="p-4 space-y-3">
                <Button
                    className="w-full bg-[#EAC435] hover:bg-[#d6b22f] text-white shadow-md transition-all flex flex-col h-auto py-3 items-center gap-1"
                >
                    <Save className="w-5 h-5 mb-1" />
                    <span className="text-xs font-bold">儲存為草稿</span>
                </Button>

                <Button
                    className="w-full bg-[#5DADE2] hover:bg-[#4a9bc8] text-white shadow-md transition-all flex flex-col h-auto py-3 items-center gap-1"
                >
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-xs font-bold">發布</span>
                </Button>

                <Button
                    className="w-full bg-[#808B96] hover:bg-[#6c7680] text-white shadow-md transition-all flex flex-col h-auto py-3 items-center gap-1"
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
            <div className="flex-1 overflow-y-auto py-4 px-3">
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
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            {/* Footer: Add Chapter */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                <Button
                    onClick={addChapter}
                    variant="ghost"
                    className="w-full border-2 border-dashed border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50 text-muted-foreground"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    新增章節
                </Button>
            </div>
        </div>
    )
}
