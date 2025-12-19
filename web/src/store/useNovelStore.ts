import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export interface Novel {
    id: string
    title: string
    created_at: string
    user_id: string
}

interface NovelState {
    novels: Novel[]
    isLoading: boolean
    selectedNovelId: string | null
    fetchNovels: () => Promise<void>
    createNovel: () => Promise<void>
    selectNovel: (id: string | null) => void
    deleteNovel: (id: string) => Promise<void>
}

export const useNovelStore = create<NovelState>((set, get) => ({
    novels: [],
    isLoading: false,
    selectedNovelId: null,

    fetchNovels: async () => {
        set({ isLoading: true })
        try {
            const { data, error } = await supabase
                .from('novels')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            set({ novels: data || [] })
        } catch (error) {
            console.error('Error fetching novels:', error)
        } finally {
            set({ isLoading: false })
        }
    },

    createNovel: async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('novels')
                .insert([
                    {
                        user_id: user.id,
                        title: 'Untitled Novel',
                    }
                ])
                .select()
                .single()

            if (error) throw error

            // Update local state
            set((state) => ({
                novels: [data, ...state.novels]
            }))
        } catch (error) {
            console.error('Error creating novel:', error)
        }
    },

    selectNovel: (id) => set({ selectedNovelId: id }),

    deleteNovel: async (id) => {
        try {
            const { error } = await supabase
                .from('novels')
                .delete()
                .eq('id', id)

            if (error) throw error

            set((state) => ({
                novels: state.novels.filter(n => n.id !== id),
                selectedNovelId: state.selectedNovelId === id ? null : state.selectedNovelId
            }))
        } catch (error) {
            console.error('Error deleting novel:', error)
        }
    }
}))
