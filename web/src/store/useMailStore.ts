import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

export interface Message {
    id: string
    sender_id: string
    recipient_id: string
    content: string
    is_read: boolean
    created_at: string
}

// Helper type for the UI to group by user
export interface Conversation {
    userId: string
    username: string
    avatarUrl: string
    lastMessage: string
    lastMessageAt: string
    unreadCount: number
}

interface MailState {
    messages: Message[]
    isOpen: boolean
    isLoading: boolean
    unreadTotal: number
    activeConversationId: string | null // ID of the other user

    setIsOpen: (isOpen: boolean) => void
    setActiveConversation: (userId: string | null) => void

    fetchMessages: () => Promise<void>
    sendMessage: (recipientId: string, content: string) => Promise<void>
    markAsRead: (senderId: string) => Promise<void>
    subscribeToMessages: () => void
    unsubscribeFromMessages: () => void
}

export const useMailStore = create<MailState>((set, get) => ({
    messages: [],
    isOpen: false,
    isLoading: false,
    unreadTotal: 0,
    activeConversationId: null,

    setIsOpen: (isOpen) => set({ isOpen }),
    setActiveConversation: (userId) => set({ activeConversationId: userId }),

    fetchMessages: async () => {
        set({ isLoading: true })
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
                .order('created_at', { ascending: true })

            if (error) throw error

            const unreadCount = data.filter(m => m.recipient_id === user.id && !m.is_read).length

            set({ messages: data, unreadTotal: unreadCount })
        } catch (error) {
            console.error('Error fetching messages:', error)
        } finally {
            set({ isLoading: false })
        }
    },

    sendMessage: async (recipientId, content) => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                alert('請先登入')
                return
            }

            const { error } = await supabase
                .from('messages')
                .insert({
                    sender_id: user.id,
                    recipient_id: recipientId,
                    content: content,
                })

            if (error) throw error

            // Optimistic update handled by subscription usually, but we can refetch/append
            await get().fetchMessages()
        } catch (error: any) {
            console.error('Error sending message:', error)
            alert('發送失敗: ' + error.message)
        }
    },

    markAsRead: async (senderId) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // 1. Update DB
        const { error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('recipient_id', user.id)
            .eq('sender_id', senderId)
            .eq('is_read', false)

        if (error) console.error('Error marking as read:', error)

        // 2. Update Local State
        const messages = get().messages.map(m => {
            if (m.recipient_id === user.id && m.sender_id === senderId) {
                return { ...m, is_read: true }
            }
            return m
        })

        const unreadTotal = messages.filter(m => m.recipient_id === user.id && !m.is_read).length
        set({ messages, unreadTotal })
    },

    subscribeToMessages: () => {
        // Implement Realtime later if needed, simple fetch for now is safer for MVP
        // or just rely on manual refresh / periodic poll
    },

    unsubscribeFromMessages: () => {
        // Cleanup
    }
}))
