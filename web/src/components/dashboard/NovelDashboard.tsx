'use client'

import { useChapterStore } from "@/store/useChapterStore"
import { useNovelStore } from "@/store/useNovelStore"
import { Button } from "@/components/ui/button"
import { Plus, GripVertical, FileText, Trash2, Settings, Users, Eye, ChevronLeft, Image as ImageIcon, Loader2, Upload, Clock } from "lucide-react"
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
import { useEffect, useState, useRef } from "react"
import { toast } from "sonner"
import { NovelSettingsDialog } from "./NovelSettingsDialog"
import { CollaborateDialog } from "./CollaborateDialog"
import { UserProfile } from "@/components/UserProfile"
import { supabase } from "@/lib/supabase"

function ChapterCard({ chapter, onClick, onDelete }: { chapter: { id: string, title: string, order: number, content?: string, is_published?: boolean, published_at?: string | null }, onClick: () => void, onDelete: () => void }) {
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
                            第 {chapter.order} 章
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

                    {/* Status Badge instead of Edit Button */}
                    <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors",
                        chapter.is_published
                            ? (new Date(chapter.published_at || 0) > new Date()
                                ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400")
                            : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                    )}>
                        {chapter.is_published ? (
                            new Date(chapter.published_at || 0) > new Date() ? (
                                <>
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{new Date(chapter.published_at!).toLocaleDateString()}</span>
                                </>
                            ) : (
                                <>
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>已公開</span>
                                </>
                            )
                        ) : (
                            <>
                                <GripVertical className="w-3.5 h-3.5" />
                                <span className="mr-1">草稿</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export function NovelDashboard() {
    const { chapters, reorderChapters, addChapter, setActiveChapter, deleteChapter, fetchChapters } = useChapterStore()
    const { novels, selectedNovelId, selectNovel, updateNovel } = useNovelStore()

    // Fallback if no novel selected (should handle better in real app)
    const activeNovel = novels.find(n => n.id === selectedNovelId) || { id: 'default', title: '未命名小說', created_at: '', user_id: '', genre: '', is_public: false, cover_url: '' }

    // Dialog States
    const [settingsOpen, setSettingsOpen] = useState(false)
    const [collaborateOpen, setCollaborateOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

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

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !selectedNovelId) return

        if (file.size > 2 * 1024 * 1024) {
            alert("圖片大小不能超過 2MB")
            return
        }

        setIsUploading(true)
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${selectedNovelId}-${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('covers')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('covers')
                .getPublicUrl(filePath)

            // Update Novel Record
            await updateNovel(selectedNovelId, { cover_url: publicUrl })
            toast.success("封面更新成功")
        } catch (error: any) {
            console.error('Upload error:', error)
            alert('上傳失敗: ' + error.message)
        } finally {
            setIsUploading(false)
        }
    }

    // Mock genre/visibility for now as they are not in store/db
    const genre = activeNovel.genre || "未分類"
    const isPublic = activeNovel.is_public || false
    const coverUrl = activeNovel.cover_url

    return (
        <div className="min-h-screen bg-[#FDFBF7] dark:bg-neutral-950 p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header Section */}
                <div className="flex flex-col gap-6 pb-8 border-b border-neutral-200 dark:border-neutral-800">

                    {/* Top Bar with User & Collab */}
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 -ml-2"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    返回列表
                                </Button>
                            </Link>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold tracking-wide uppercase">
                                當前專案
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

                    <div className="flex flex-col md:flex-row items-start gap-8">
                        {/* Cover Image Upload Area */}
                        <div className="group relative w-32 h-44 flex-shrink-0 bg-neutral-200 dark:bg-neutral-800 rounded-lg overflow-hidden shadow-inner cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                            {coverUrl ? (
                                <img src={coverUrl} alt="Cover" className="w-full h-full object-cover transition-opacity group-hover:opacity-70" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400">
                                    <ImageIcon className="w-8 h-8 mb-2" />
                                    <span className="text-xs">上傳封面</span>
                                </div>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                {isUploading ? (
                                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                                ) : (
                                    <Upload className="w-6 h-6 text-white" />
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleCoverUpload}
                                disabled={isUploading}
                            />
                        </div>

                        <div className="flex-1 space-y-4 md:mt-2">
                            <h1 className="text-5xl md:text-6xl font-black text-neutral-900 dark:text-white tracking-tight leading-none">
                                {activeNovel.title}
                            </h1>
                            <div className="flex items-center gap-4 text-neutral-500 text-sm font-medium">
                                <span className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded text-neutral-600 dark:text-neutral-400">
                                    <FileText className="w-3 h-3" />
                                    {chapters.length} 章
                                </span>
                                <span className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded text-neutral-600 dark:text-neutral-400">
                                    {genre}
                                </span>
                                <span className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-900 px-2 py-1 rounded text-neutral-600 dark:text-neutral-400">
                                    <Eye className="w-3 h-3" />
                                    {isPublic ? "公開" : "私人"}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">

                            <Button variant="outline" className="border-neutral-300 rounded-full px-6 w-full sm:w-auto" onClick={() => setSettingsOpen(true)}>
                                <Settings className="w-4 h-4 mr-2" />
                                設定
                            </Button>
                            <Button onClick={handleAddChapter} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none rounded-full px-6 w-full sm:w-auto">
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
