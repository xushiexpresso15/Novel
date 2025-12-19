'use client'

import { Button } from "@/components/ui/button"
import { BookOpen, GripVertical, Plus, Settings } from "lucide-react"
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
        <div className="w-80 h-screen sticky top-0 flex flex-col border-r border-white/20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl transition-all">
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-white/10">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-semibold select-none">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    <span>未命名小說</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-500">
                    <Settings className="w-4 h-4" />
                </Button>
            </div>

            {/* Chapter List */}
            <div className="flex-1 overflow-y-auto py-4 px-3">
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

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/10">
                <Button
                    onClick={addChapter}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-lg shadow-slate-500/20 active:scale-95 transition-transform"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    新增章節
                </Button>
            </div>
        </div>
    )
}
