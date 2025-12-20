'use client'

import { Mail } from 'lucide-react'
import { useMailStore } from '@/store/useMailStore'
import { useEffect } from 'react'

export function MailButton() {
    const { unreadTotal, setIsOpen, fetchMessages } = useMailStore()

    // Periodically fetch unread count (or subscribe in real app)
    useEffect(() => {
        fetchMessages()
    }, [fetchMessages])

    return (
        <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
        >
            <Mail className="w-5 h-5 text-neutral-600 dark:text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
            {unreadTotal > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 text-[10px] font-bold flex items-center justify-center bg-red-500 text-white rounded-full ring-2 ring-white dark:ring-black">
                    {unreadTotal > 9 ? '9+' : unreadTotal}
                </span>
            )}
        </button>
    )
}
