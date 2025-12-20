'use client'

import { useChapterStore } from "@/store/useChapterStore"
import { useNovelStore } from "@/store/useNovelStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, GripVertical, FileText, Trash2, Settings, ArrowRight } from "lucide-react"
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
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from "@/lib/utils"
import { useState } from "react"
import { toast } from "sonner"

function ChapterCard({ chapter, onClick, onDelete }: { chapter: any, onClick: () => void, onDelete: () => void }) {
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
                "group relative bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all",
                isDragging && "opacity-50 ring-2 ring-indigo-500"
            )}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-4 right-4 text-neutral-400 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing hover:text-neutral-600 transition-opacity"
            >
                <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex flex-col h-full justify-between">
                <div onClick={onClick} className="cursor-pointer">
                    <div className="flex items-center gap-2 mb-3 text-sm font-bold text-neutral-400 uppercase tracking-widest">
                        <span className="bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded">
                            CHAPTER {String(chapter.order + 1).padStart(2, '0')}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 line-clamp-2 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {chapter.title}
                    </h3>
                    <p className="text-sm text-neutral-500 line-clamp-3">
                        {/* Placeholder for preview text if available in future */}
                        點擊開始編輯此章節內容...
                    </p>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-700">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 -ml-2"
                        onClick={(e) => {
                            e.stopPropagation()
                            if (confirm('確定要刪除此章節嗎？')) onDelete()
                        }}
                    >
                        <Trash2 className="w-4 h-4 mr-1" />
                        刪除
                    </Button>

                    <Button
                        size="sm"
                        className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-indigo-600 dark:hover:bg-indigo-300 transition-colors"
                        onClick={onClick}
                    >
                        編輯
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

import { useEffect } from "react"
import { toast } from "sonner"

// ... (ChapterCard component remains same)

export function NovelDashboard() {
    const { chapters, reorderChapters, addChapter, setActiveChapter, deleteChapter, fetchChapters } = useChapterStore()
    const { novels, selectedNovelId, updateNovel } = useNovelStore()

    // Fallback if no novel selected (should handle better in real app)
    const activeNovel = novels.find(n => n.id === selectedNovelId) || { title: '未命名小說', id: 'default' }

    useEffect(() => {
        if (selectedNovelId) {
            fetchChapters(selectedNovelId)
        }
    }, [selectedNovelId, fetchChapters])

    const handleAddChapter = async () => {
        if (!selectedNovelId) {
            toast.error("請先選擇小說")
            return
        }
        await addChapter(selectedNovelId)
    }

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
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-neutral-950 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-8 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="space-y-4">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold tracking-wide uppercase">
                            Current Project
                        </div>
                        <h1 className="text-5xl font-black text-neutral-900 dark:text-white tracking-tight">
                            {activeNovel.title}
                        </h1>
                        <div className="flex items-center gap-4 text-neutral-500">
                            <span className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                {chapters.length} Chapters
                            </span>
                            {/* Potential Word Count Here */}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button variant="outline" className="border-neutral-300">
                            <Settings className="w-4 h-4 mr-2" />
                            設定
                        </Button>
                        <Button onClick={handleAddChapter} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                            <Plus className="w-4 h-4 mr-2" />
                            新章節
                        </Button>
                    </div>
                </div>

                {/* Chapter Grid */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={chapters.map(c => c.id)}
                        strategy={rectSortingStrategy}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {chapters.map((chapter) => (
                                <ChapterCard
                                    key={chapter.id}
                                    chapter={chapter}
                                    onClick={() => setActiveChapter(chapter.id)}
                                    onDelete={() => deleteChapter(chapter.id)}
                                />
                            ))}

                            {/* Quick Add Card */}
                            <button
                                onClick={handleAddChapter}
                                className="group flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all"
                            >
                                <div className="h-12 w-12 rounded-full bg-neutral-100 dark:bg-neutral-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 flex items-center justify-center mb-4 transition-colors">
                                    <Plus className="w-6 h-6 text-neutral-400 group-hover:text-indigo-600 transition-colors" />
                                </div>
                                <span className="font-bold text-neutral-400 group-hover:text-indigo-600">建立新章節</span>
                            </button>
                        </div>
                    </SortableContext>
                </DndContext>

            </div>
        </div>
    )
}
