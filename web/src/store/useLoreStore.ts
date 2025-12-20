import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export type LoreType = 'character' | 'location' | 'item'

export interface LoreItem {
    id: string
    title: string
    type: LoreType
    description: string
    imageUrl?: string
    user_id?: string
    novel_id?: string
}

interface LoreStore {
    items: LoreItem[]
    isLoading: boolean
    fetchItems: (novelId: string) => Promise<void>
    addItem: (item: Omit<LoreItem, 'id'>, novelId: string) => Promise<void>
    removeItem: (id: string) => Promise<void>
    updateItem: (id: string, data: Partial<LoreItem>) => Promise<void>
}

export const useLoreStore = create<LoreStore>((set, get) => ({
    items: [],
    isLoading: false,

    fetchItems: async (novelId: string) => {
        set({ isLoading: true })
        try {
            const { data, error } = await supabase
                .from('lore_items')
                .select('*')
                .eq('novel_id', novelId)
                .order('created_at', { ascending: false })

            if (error) throw error

            set({ items: data as LoreItem[] || [] })
        } catch (error) {
            console.error('Error fetching lore items:', error)
        } finally {
            set({ isLoading: false })
        }
    },

    addItem: async (item, novelId: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const newItem = {
                ...item,
                user_id: user.id,
                novel_id: novelId
            }

            const { data, error } = await supabase
                .from('lore_items')
                .insert([newItem])
                .select()
                .single()

            if (error) throw error

            set((state) => ({
                items: [data as LoreItem, ...state.items]
            }))
        } catch (error) {
            console.error('Error adding lore item:', error)
        }
    },

    removeItem: async (id) => {
        try {
            // Optimistic update
            const previousItems = get().items
            set((state) => ({
                items: state.items.filter((item) => item.id !== id),
            }))

            const { error } = await supabase
                .from('lore_items')
                .delete()
                .eq('id', id)

            if (error) {
                // Revert
                set({ items: previousItems })
                throw error
            }
        } catch (error) {
            console.error('Error deleting lore item:', error)
        }
    },

    updateItem: async (id, data) => {
        try {
            // Optimistic update
            const previousItems = get().items
            set((state) => ({
                items: state.items.map((item) => (item.id === id ? { ...item, ...data } : item)),
            }))

            const { error } = await supabase
                .from('lore_items')
                .update(data)
                .eq('id', id)

            if (error) {
                // Revert
                set({ items: previousItems })
                throw error
            }

        } catch (error) {
            console.error('Error updating lore item:', error)
        }
    },
}))
