'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { useEffect } from 'react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Use selectors to prevent unnecessary re-renders when other parts of the store change
    const checkUser = useAuthStore((state) => state.checkUser)
    const initializeAuthListener = useAuthStore((state) => state.initializeAuthListener)

    useEffect(() => {
        checkUser()
        const subscription = initializeAuthListener()
        return () => {
            subscription?.unsubscribe()
        }
    }, [checkUser, initializeAuthListener])

    return <>{children}</>
}
