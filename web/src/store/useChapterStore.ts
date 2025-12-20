import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export interface Chapter {
    id: string
    novel_id: string
    title: string
    order: number
    content?: string
    is_published?: boolean
    published_at?: string | null
}


interface ChapterStore {
    chapters: Chapter[]
    activeChapterId: string | null
    isLoading: boolean
    setChapters: (chapters: Chapter[]) => void
    fetchChapters: (novelId: string) => Promise<void>
    addChapter: (novelId: string) => Promise<void>
    setActiveChapter: (id: string | null) => void
    reorderChapters: (activeId: string, overId: string) => Promise<void>
    updateChapter: (id: string, data: Partial<Chapter>) => Promise<void>
    publishChapter: (id: string) => Promise<void>
    scheduleChapter: (id: string, date: Date) => Promise<void>
    unpublishChapter: (id: string) => Promise<void>
    deleteChapter: (id: string) => Promise<void>
    wordCount: number
    setWordCount: (count: number) => void
}

export const useChapterStore = create<ChapterStore>((set, get) => ({
    chapters: [],
    activeChapterId: null,
    isLoading: false,

    setChapters: (chapters) => set({ chapters }),

    fetchChapters: async (novelId: string) => {
        set({ isLoading: true })
        const { data, error } = await supabase
            .from('chapters')
            .select('*')
            .eq('novel_id', novelId)
            .order('order', { ascending: true })

        if (error) {
            console.error('Error fetching chapters:', error)
        } else {
            set({ chapters: data as Chapter[] || [] })
        }
        set({ isLoading: false })
    },

    addChapter: async (novelId: string) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Get current max order
        const currentChapters = get().chapters
        const maxOrder = currentChapters.length > 0
            ? Math.max(...currentChapters.map(c => c.order))
            : -1

        const newChapter = {
            novel_id: novelId,
            user_id: user.id,
            title: '新章節',
            content: '',
            order: maxOrder + 1
        }

        const { data, error } = await supabase
            .from('chapters')
            .insert([newChapter])
            .select()
            .single()

        if (error) {
            console.error('Error adding chapter:', error)
            toast.error('新增章節失敗')
        } else {
            set((state) => ({ chapters: [...state.chapters, data as Chapter] }))
            // Automatically select the new chapter? optional.
        }
    },

    setActiveChapter: (id) => set({ activeChapterId: id }),

    reorderChapters: async (activeId, overId) => {
        // Optimistic update
        const state = get()
        const oldIndex = state.chapters.findIndex((c) => c.id === activeId)
        const newIndex = state.chapters.findIndex((c) => c.id === overId)

        if (oldIndex === -1 || newIndex === -1) return

        const newChapters = [...state.chapters]
        const [movedChapter] = newChapters.splice(oldIndex, 1)
        newChapters.splice(newIndex, 0, movedChapter)

        // Update order properties
        const updatedChapters = newChapters.map((chapter, index) => ({
            ...chapter,
            order: index
        }))

        set({ chapters: updatedChapters })

        // Persist to DB (Batch update ideally, or loop)
        // For MVP, simplistic loop or RPC is okay.
        // Let's try to update just the affected ones or all.
        for (const chapter of updatedChapters) {
            await supabase.from('chapters').update({ order: chapter.order }).eq('id', chapter.id)
        }
    },

    updateChapter: async (id, data) => {
        // Optimistic
        set((state) => ({
            chapters: state.chapters.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }))

        // Debounce could be good here for content, but direct update for now
        const { error } = await supabase
            .from('chapters')
            .update(data)
            .eq('id', id)

        if (error) {
            console.error('Error updating chapter:', error)
        }
    },

    publishChapter: async (id) => {
        const now = new Date().toISOString()
        const data = { is_published: true, published_at: now }

        // Optimistic
        set((state) => ({
            chapters: state.chapters.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }))

        const { error } = await supabase
            .from('chapters')
            .update(data)
            .eq('id', id)

        if (error) {
            console.error('Error publishing chapter:', error)
            toast.error('發布失敗')
        } else {
            toast.success('章節已發布')
        }
    },

    scheduleChapter: async (id, date) => {
        const scheduledTime = date.toISOString()
        const data = { is_published: true, published_at: scheduledTime }

        // Optimistic
        set((state) => ({
            chapters: state.chapters.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }))

        const { error } = await supabase
            .from('chapters')
            .update(data)
            .eq('id', id)

        if (error) {
            console.error('Error scheduling chapter:', error)
            toast.error('預約失敗')
        } else {
            toast.success('預約成功', {
                description: `將於 ${date.toLocaleString()} 自動公開`
            })
        }
    },

    unpublishChapter: async (id) => {
        const data = { is_published: false, published_at: null }

        // Optimistic
        set((state) => ({
            chapters: state.chapters.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }))

        const { error } = await supabase
            .from('chapters')
            .update(data)
            .eq('id', id)

        if (error) {
            console.error('Error unpublishing chapter:', error)
            toast.error('取消發布失敗')
        } else {
            toast.success('已設為未公開')
        }
    },

    deleteChapter: async (id) => {
        const { error } = await supabase
            .from('chapters')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting chapter:', error)
            toast.error('刪除失敗')
        } else {
            set((state) => ({
                chapters: state.chapters.filter((c) => c.id !== id),
                activeChapterId: state.activeChapterId === id ? null : state.activeChapterId
            }))
        }
    },

    wordCount: 0,
    setWordCount: (count) => set({ wordCount: count }),
}))
