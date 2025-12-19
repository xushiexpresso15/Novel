import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthState {
    user: User | null
    isLoading: boolean
    checkUser: () => Promise<void>
    signInWithGoogle: () => Promise<void>
    signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    checkUser: async () => {
        try {
            set({ isLoading: true })
            const { data: { session } } = await supabase.auth.getSession()
            set({ user: session?.user || null })

            const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
                set({ user: session?.user || null })
            })
        } catch (error) {
            console.error('Check user error:', error)
        } finally {
            set({ isLoading: false })
        }
    },
    signInWithGoogle: async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    // Redirect back to the current page
                    redirectTo: typeof window !== 'undefined' ? window.location.origin + window.location.pathname.replace(/\/$/, '') : undefined
                }
            })
            if (error) throw error
        } catch (error) {
            console.error('Login error:', error)
        }
    },
    signOut: async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            set({ user: null })
        } catch (error) {
            console.error('Logout error:', error)
        }
    }
}))
