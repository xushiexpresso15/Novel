'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { useEffect } from 'react'

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { checkUser, initializeAuthListener } = useAuthStore()

    useEffect(() => {
        checkUser()
        const subscription = initializeAuthListener()
        return () => {
            subscription?.unsubscribe()
        }
    }, [checkUser, initializeAuthListener])

    return <>{children}</>
}
