import { create } from 'zustand'

export interface Chapter {
    id: string
    title: string
    order: number
}

interface ChapterStore {
    chapters: Chapter[]
    activeChapterId: string | null
    setChapters: (chapters: Chapter[]) => void
    addChapter: () => void
    setActiveChapter: (id: string) => void
    reorderChapters: (activeId: string, overId: string) => void
    updateChapter: (id: string, data: Partial<Chapter>) => void
    wordCount: number
    setWordCount: (count: number) => void
}

export const useChapterStore = create<ChapterStore>((set) => ({
    chapters: [
        { id: '1', title: '第一章：序幕', order: 0 },
        { id: '2', title: '第二章：意外的訪客', order: 1 },
        { id: '3', title: '第三章：覺醒', order: 2 },
    ],
    activeChapterId: '1',
    setChapters: (chapters) => set({ chapters }),
    addChapter: () =>
        set((state) => {
            const newChapter = {
                id: Math.random().toString(36).substr(2, 9),
                title: '新章節',
                order: state.chapters.length,
            }
            return { chapters: [...state.chapters, newChapter] }
        }),
    setActiveChapter: (id) => set({ activeChapterId: id }),
    reorderChapters: (activeId, overId) =>
        set((state) => {
            const oldIndex = state.chapters.findIndex((c) => c.id === activeId)
            const newIndex = state.chapters.findIndex((c) => c.id === overId)

            const newChapters = [...state.chapters]
            const [movedChapter] = newChapters.splice(oldIndex, 1)
            newChapters.splice(newIndex, 0, movedChapter)

            return { chapters: newChapters }
        }),
    updateChapter: (id, data) =>
        set((state) => ({
            chapters: state.chapters.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),
    wordCount: 0,
    setWordCount: (count) => set({ wordCount: count }),
}))
