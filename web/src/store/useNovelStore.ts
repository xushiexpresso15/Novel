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
    error: string | null
    viewMode: 'landing' | 'dashboard'
    selectedNovelId: string | null
    setViewMode: (mode: 'landing' | 'dashboard') => void
    fetchNovels: () => Promise<void>
    createNovel: () => Promise<void>
    selectNovel: (id: string | null) => void
    deleteNovel: (id: string) => Promise<void>
}

export const useNovelStore = create<NovelState>((set, get) => ({
    novels: [],
    isLoading: false,
    error: null,
    viewMode: 'landing', // Default to landing
    selectedNovelId: null,

    setViewMode: (mode) => set({ viewMode: mode }),

    fetchNovels: async () => {
        set({ isLoading: true, error: null })
        try {
            console.log('fetchNovels: fetching...')
            const { data, error } = await supabase
                .from('novels')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            console.log('fetchNovels: success', data.length)
            set({ novels: data || [] })
        } catch (clientError: any) {
            console.error('Supabase Client failed:', clientError)
            set({ error: `Network Error: ${clientError.message}. Please disable AdBlockters.` })
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
        } catch (error: any) {
            console.error('Error deleting novel:', error)
            alert('Failed to delete: ' + error.message)
        }
    }
}))
