import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { Novel } from './useNovelStore'

export interface Profile {
    id: string
    username: string
    avatar_url: string | null
    bio: string | null
    created_at?: string
}

interface PublicState {
    currentProfile: Profile | null
    publicNovels: Novel[]
    currentNovel: Novel | null
    currentChapters: any[]
    exploreNovels: (Novel & { profiles: Profile })[]
    isLoading: boolean
    error: string | null

    fetchProfile: (userId: string) => Promise<void>
    fetchPublicNovels: (userId: string) => Promise<void>
    fetchNovelDetails: (novelId: string) => Promise<void>
    fetchPublicChapters: (novelId: string) => Promise<void>
    fetchExploreNovels: () => Promise<void>
}

export const usePublicStore = create<PublicState>((set) => ({
    currentProfile: null,
    publicNovels: [],
    currentNovel: null,
    currentChapters: [],
    exploreNovels: [],
    isLoading: false,
    error: null,

    fetchProfile: async (userId) => {
        set({ isLoading: true, error: null })
        try {
            // First try fetching from profiles table
            let { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) {
                // formatting error handling
                console.warn('Profile fetch error, might not exist yet:', error.message)
            }

            // If no profile found (maybe trigger didn't run or old user), mock or fallback?
            // For now, if no profile, we can't show much, but let's assume it exists or we handle null.
            set({ currentProfile: data })
        } catch (e) {
            console.error(e)
            set({ error: 'Failed to load profile' })
        } finally {
            set({ isLoading: false })
        }
    },

    fetchPublicNovels: async (userId) => {
        set({ isLoading: true, error: null })
        try {
            const { data, error } = await supabase
                .from('novels')
                .select('*')
                .eq('user_id', userId)
                .eq('is_public', true)
                .order('created_at', { ascending: false })

            if (error) throw error
            set({ publicNovels: data || [] })
        } catch (e) {
            console.error(e)
            set({ error: 'Failed to load novels' })
        } finally {
            set({ isLoading: false })
        }
    },

    fetchNovelDetails: async (novelId) => {
        set({ isLoading: true, error: null })
        try {
            const { data, error } = await supabase
                .from('novels')
                .select('*, profiles(username, avatar_url)')
                .eq('id', novelId)
                .single()

            if (error) throw error
            set({ currentNovel: data })
        } catch (e) {
            console.error(e)
            set({ error: 'Failed to load novel details' })
        } finally {
            set({ isLoading: false })
        }
    },

    fetchPublicChapters: async (novelId) => {
        set({ isLoading: true })
        try {
            const { data, error } = await supabase
                .from('chapters')
                .select('id, title, order, created_at') // Exclude content for list to save bandwidth if possible, or include for reading? 
                // Actually usually we separate list vs reading. But for simplicity let's fetch basic info.
                // Creating a separate fetch for content might be better for "reading" action.
                .eq('novel_id', novelId)
                .order('order', { ascending: true })

            if (error) throw error
            set({ currentChapters: data || [] })
        } catch (e) {
            console.error(e)
        } finally {
            set({ isLoading: false })
        }
    },

    fetchExploreNovels: async () => {
        set({ isLoading: true, error: null })
        try {
            const { data, error } = await supabase
                .from('novels')
                .select('*, profiles(username, avatar_url)')
                .eq('is_public', true)
                .order('created_at', { ascending: false })

            if (error) throw error
            // @ts-ignore
            set({ exploreNovels: data || [] })
        } catch (e) {
            console.error(e)
            set({ exploreNovels: [], error: 'Failed to load explore novels' })
        } finally {
            set({ isLoading: false })
        }
    }
}))
