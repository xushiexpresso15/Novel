import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { User, Subscription } from '@supabase/supabase-js'

interface AuthState {
    user: User | null
    isLoading: boolean
    checkUser: () => Promise<void>
    initializeAuthListener: () => Subscription
    signInWithGoogle: () => Promise<void>
    signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    checkUser: async () => {
        try {
            console.log('checkUser: manual check')
            set({ isLoading: true })
            const { data: { session }, error } = await supabase.auth.getSession()
            if (error) console.error('checkUser: error', error)

            // Only update if different
            set((state) => {
                const newUser = session?.user || null
                if (state.user?.id === newUser?.id) return state
                return { user: newUser }
            })
        } catch (error) {
            console.error('Check user error:', error)
        } finally {
            set({ isLoading: false })
        }
    },
    initializeAuthListener: () => {
        console.log('Auth Listener: initializing')
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('Auth Listener:', event)
            set({ user: session?.user || null, isLoading: false })
        })
        return subscription
    },
    signInWithGoogle: async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    // Redirect back to the current page
                    redirectTo: typeof window !== 'undefined' ? window.location.origin + window.location.pathname.replace(/\/$/, '') : undefined,
                    queryParams: {
                        prompt: 'select_account'
                    }
                }
            })
            if (error) throw error
        } catch (error: any) {
            console.error('Login error:', error)
            alert(`Login failed: ${error.message || error.toString()}`)
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
