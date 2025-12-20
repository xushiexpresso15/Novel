import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export interface Novel {
    id: string
    title: string
    created_at: string
    user_id: string
    genre?: string
    is_public?: boolean
    description?: string
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
    updateNovel: (id: string, data: Partial<Novel>) => Promise<void>
}

export const useNovelStore = create<NovelState>((set) => ({
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
        } catch (clientError: unknown) {
            console.error('Supabase Client failed:', clientError)
            let message = 'Unknown error'
            if (clientError instanceof Error) message = clientError.message
            set({ error: `Network Error: ${message}. Please disable AdBlockters.` })
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
        } catch (error: unknown) {
            console.error('Error deleting novel:', error)
            if (error instanceof Error) {
                alert('Failed to delete: ' + error.message)
            }
        }
    },

    updateNovel: async (id, data) => {
        try {
            // Optimistic update
            set((state) => ({
                novels: state.novels.map(n => n.id === id ? { ...n, ...data } : n)
            }))

            const { error } = await supabase
                .from('novels')
                .update(data)
                .eq('id', id)

            if (error) throw error
        } catch (error: unknown) {
            console.error('Error updating novel:', error)
            // simplified: revert not implemented for MVP
        }
    }
}))
