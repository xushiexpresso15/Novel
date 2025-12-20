'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { useNovelStore } from '@/store/useNovelStore'
import { LandingPage } from '@/components/home/LandingPage'
import { Dashboard } from '@/components/home/Dashboard'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'

export default function Home() {
  const { user, isLoading, checkUser, initializeAuthListener } = useAuthStore()
  const { viewMode } = useNovelStore()

  useEffect(() => {
    checkUser()
    const subscription = initializeAuthListener()
    return () => {
      subscription?.unsubscribe()
    }
  }, [checkUser, initializeAuthListener])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    )
  }

  // Not logged in -> Always Landing Page
  if (!user) {
    return <LandingPage />
  }

  // Logged in -> Check viewMode
  if (viewMode === 'landing') {
    return <LandingPage />
  }

  return <Dashboard />
}
