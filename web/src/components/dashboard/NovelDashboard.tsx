'use client'

import { useChapterStore } from "@/store/useChapterStore"
import { useNovelStore } from "@/store/useNovelStore"
import { Button } from "@/components/ui/button"
import { Plus, GripVertical, FileText, Trash2, Settings, ArrowRight, Users, Eye, ChevronLeft } from "lucide-react"
import Link from 'next/link'
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
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { NovelSettingsDialog } from "./NovelSettingsDialog"
import { CollaborateDialog } from "./CollaborateDialog"
import { UserProfile } from "@/components/UserProfile"

function ChapterCard({ chapter, onClick, onDelete }: { chapter: { id: string, title: string, order: number, content?: string }, onClick: () => void, onDelete: () => void }) {
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

    // Strip HTML tags but preserve newlines for preview
    const previewText = chapter.content
        ? chapter.content
            .replace(/<\/p>/gi, '\n')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]*>?/gm, '')
            .trim()
        : ''

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all h-[280px] flex flex-col",
                isDragging && "opacity-50 ring-2 ring-indigo-500"
            )}
        >
            {/* Drag Handle */}
            <div
                {...attributes}
                {...listeners}
                className="absolute top-4 right-4 text-neutral-400 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing hover:text-neutral-600 transition-opacity z-10"
            >
                <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex flex-col h-full justify-between">
                <div onClick={onClick} className="cursor-pointer flex-1 overflow-hidden">
                    <div className="flex items-center gap-2 mb-3 text-sm font-bold text-neutral-400 uppercase tracking-widest">
                        <span className="bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded">
                            CHAPTER {chapter.order}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 line-clamp-1 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {chapter.title}
                    </h3>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed overflow-hidden relative font-medium h-[4.8rem] whitespace-pre-wrap break-words">
                        {previewText || (
                            <span className="text-neutral-400 dark:text-neutral-500 italic block">
                                此章節目前尚無內容。
                                <br />
                                點擊「編輯」或卡片任何位置進入寫作模式。
                                <br />
                                這裡將會顯示您的文章預覽...
                            </span>
                        )}
                        {/* Gradient fade covering the bottom part (4th line area) */}
                        <div className="absolute bottom-0 left-0 w-full h-[2rem] bg-gradient-to-t from-white via-white/80 to-transparent dark:from-neutral-800 dark:via-neutral-800/80"></div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700 shrink-0">
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
                        className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-indigo-600 dark:hover:bg-indigo-300 transition-colors rounded-full px-4"
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

export function NovelDashboard() {
    const { chapters, reorderChapters, addChapter, setActiveChapter, deleteChapter, fetchChapters } = useChapterStore()
    const { novels, selectedNovelId, selectNovel } = useNovelStore()

    // Fallback if no novel selected (should handle better in real app)
    const activeNovel = novels.find(n => n.id === selectedNovelId) || { id: 'default', title: '未命名小說', created_at: '', user_id: '', genre: '', is_public: false }

    // Dialog States
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [collaborateOpen, setCollaborateOpen] = useState(false)

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

    // Mock genre/visibility for now as they are not in store/db
    const genre = activeNovel.genre || "未分類"
    const isPublic = activeNovel.is_public || false

    return (
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-neutral-950 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header Section */}
                <div className="flex flex-col gap-6 pb-8 border-b border-neutral-200 dark:border-neutral-800">

                    {/* Top Bar with User & Collab */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 -ml-2"
                                onClick={() => selectNovel(null)}
                            >
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Back to List
                            </Button>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold tracking-wide uppercase">
                                Current Project
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-neutral-300 rounded-full hidden sm:flex"
                                onClick={() => setCollaborateOpen(true)}
                            >
                                <Users className="w-4 h-4 mr-2" />
                                協作管理
                            </Button>
                            <UserProfile />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <h1 className="text-6xl font-black text-neutral-900 dark:text-white tracking-tight leading-none">
                                {activeNovel.title}
                            </h1>
                            <div className="flex items-center gap-4 text-neutral-500 text-sm font-medium">
                                <span className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded text-neutral-600 dark:text-neutral-400">
                                    <FileText className="w-3 h-3" />
                                    {chapters.length} Chapters
                                </span>
                                <span className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded text-neutral-600 dark:text-neutral-400">
                                    {genre}
                                </span>
                                <span className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded text-neutral-600 dark:text-neutral-400">
                                    <Eye className="w-3 h-3" />
                                    {isPublic ? "Public" : "Private"}
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Link href={`/novel?id=${activeNovel.id}`} target="_blank">
                                <Button variant="outline" className="border-neutral-300 rounded-full px-6" >
                                    <Eye className="w-4 h-4 mr-2" />
                                    預覽
                                </Button>
                            </Link>
                            <Button variant="outline" className="border-neutral-300 rounded-full px-6" onClick={() => setSettingsOpen(true)}>
                                <Settings className="w-4 h-4 mr-2" />
                                設定
                            </Button>
                            <Button onClick={handleAddChapter} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none rounded-full px-6">
                                <Plus className="w-4 h-4 mr-2" />
                                新章節
                            </Button>
                        </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                                className="group flex flex-col items-center justify-center h-[280px] border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all cursor-pointer"
                            >
                                <div className="h-14 w-14 rounded-full bg-neutral-100 dark:bg-neutral-800 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 flex items-center justify-center mb-4 transition-colors">
                                    <Plus className="w-8 h-8 text-neutral-400 group-hover:text-indigo-600 transition-colors" />
                                </div>
                                <span className="font-bold text-lg text-neutral-400 group-hover:text-indigo-600">建立新章節</span>
                            </button>
                        </div>
                    </SortableContext>
                </DndContext>

                <NovelSettingsDialog
                    open={settingsOpen}
                    onOpenChange={setSettingsOpen}
                    novel={activeNovel}
                />

                <CollaborateDialog
                    open={collaborateOpen}
                    onOpenChange={setCollaborateOpen}
                />

            </div>
        </div>
    )
}
