'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { useEffect } from 'react'

import { useNovelStore } from '@/store/useNovelStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Use selectors to prevent unnecessary re-renders when other parts of the store change
    const checkUser = useAuthStore((state) => state.checkUser)
    const initializeAuthListener = useAuthStore((state) => state.initializeAuthListener)
    const user = useAuthStore((state) => state.user)
    const setViewMode = useNovelStore((state) => state.setViewMode)

    useEffect(() => {
        checkUser()
        const subscription = initializeAuthListener()
        return () => {
            subscription?.unsubscribe()
        }
    }, [checkUser, initializeAuthListener])

    // Auto-redirect to dashboard when logged in
    useEffect(() => {
        if (user) {
            setViewMode('dashboard')
        }
    }, [user, setViewMode])

    return <>{children}</>
}
