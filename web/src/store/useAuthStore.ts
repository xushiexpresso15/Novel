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
            console.log('checkUser: starting')
            set({ isLoading: true })
            const { data: { session }, error } = await supabase.auth.getSession()
            if (error) console.error('checkUser: session error', error)

            console.log('checkUser: session retrieved', session?.user?.id)
            set({ user: session?.user || null })

            supabase.auth.onAuthStateChange((event, session) => {
                console.log('checkUser: auth state change', event)
                set({ user: session?.user || null })
            })
        } catch (error) {
            console.error('Check user error:', error)
        } finally {
            console.log('checkUser: logging finished')
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
