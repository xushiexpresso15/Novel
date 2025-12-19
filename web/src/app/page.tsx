'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { LandingPage } from '@/components/home/LandingPage'
import { Dashboard } from '@/components/home/Dashboard'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'

export default function Home() {
  const { user, isLoading, checkUser } = useAuthStore()

  useEffect(() => {
    checkUser()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <LandingPage />
  }

  return <Dashboard />
}
