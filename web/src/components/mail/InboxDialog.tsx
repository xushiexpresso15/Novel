'use client'

import { useEffect, useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useMailStore, Conversation } from '@/store/useMailStore'
import { useAuthStore } from '@/store/useAuthStore'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from "@/components/ui/scroll-area" // Assuming this exists or I'll use div overflow
import { Send, User, MessageSquare } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'

export function InboxDialog() {
    const { isOpen, setIsOpen, messages, fetchMessages, activeConversationId, setActiveConversation, sendMessage, markAsRead } = useMailStore()
    const { user } = useAuthStore()
    const [newMessage, setNewMessage] = useState("")
    const [conversations, setConversations] = useState<Conversation[]>([])
    const scrollRef = useRef<HTMLDivElement>(null)

    // Poll for messages when open
    useEffect(() => {
        if (isOpen && user) {
            fetchMessages()
            const interval = setInterval(fetchMessages, 5000) // Simple polling for MVP
            return () => clearInterval(interval)
        }
    }, [isOpen, user, fetchMessages])

    // Process messages into conversations
    useEffect(() => {
        if (!user || messages.length === 0) return

        const convMap = new Map<string, Conversation>()

        const processMessage = async () => {
            // We need profiles for names/avatars. 
            // Ideally we fetch profiles in bulk, but for MVP we might need to rely on what we have or fetch unique IDs.
            // For now, let's create a placeholder list and maybe fetch real names if possible.
            // Actually, Supabase messages don't join profiles automatically in standard query unless we use a join or view.
        }

        // To make this efficient without complex joins on client:
        // Group by 'other user' ID.
        const tempConvs: Record<string, Conversation> = {}
        const uniqueUserIds = new Set<string>()

        messages.forEach(m => {
            const isMeSender = m.sender_id === user.id
            const otherId = isMeSender ? m.recipient_id : m.sender_id
            uniqueUserIds.add(otherId)

            if (!tempConvs[otherId]) {
                tempConvs[otherId] = {
                    userId: otherId,
                    username: 'Loading...',
                    avatarUrl: '',
                    lastMessage: '',
                    lastMessageAt: '',
                    unreadCount: 0
                }
            }

            // Update latest message info
            // Assuming messages are sorted ASC (oldest first). We want last one.
            const conv = tempConvs[otherId]
            conv.lastMessage = m.content
            conv.lastMessageAt = m.created_at

            if (!isMeSender && !m.is_read) {
                conv.unreadCount++
            }
        })

        // Fetch profiles for these IDs
        if (uniqueUserIds.size > 0) {
            supabase.from('profiles').select('id, username, avatar_url').in('id', Array.from(uniqueUserIds))
                .then(({ data }) => {
                    if (data) {
                        const finalConvs = Object.values(tempConvs).map(c => {
                            const profile = data.find(p => p.id === c.userId)
                            return {
                                ...c,
                                username: profile?.username || 'Unknown User',
                                avatarUrl: profile?.avatar_url || ''
                            }
                        }).sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime())

                        setConversations(finalConvs)
                    }
                })
        } else {
            setConversations([])
        }

    }, [messages, user])

    const currentChatMessages = messages.filter(m =>
        (m.sender_id === user?.id && m.recipient_id === activeConversationId) ||
        (m.recipient_id === user?.id && m.sender_id === activeConversationId)
    )

    // Auto-scroll to bottom of chat
    // Only scroll when switching conversation or when message count changes (new message)
    // This prevents scrolling when polling updates existing messages without adding new ones
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [activeConversationId, currentChatMessages.length])

    // Mark as read when opening conversation
    useEffect(() => {
        if (activeConversationId && isOpen) {
            markAsRead(activeConversationId)
        }
    }, [activeConversationId, messages, isOpen])


    const handleSend = async () => {
        if (!newMessage.trim() || !activeConversationId) return
        await sendMessage(activeConversationId, newMessage)
        setNewMessage("")
    }



    const activeConvUser = conversations.find(c => c.userId === activeConversationId)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-4xl h-[600px] w-full p-0 gap-0 overflow-hidden flex flex-col md:flex-row bg-[#FDFBF7] dark:bg-neutral-900">

                {/* Sidebar: Conversations List */}
                <div className={`${activeConversationId ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 border-r border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-black/20`}>
                    <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                        <h2 className="font-bold text-lg">訊息</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {conversations.length === 0 ? (
                            <div className="text-center py-10 text-neutral-400">
                                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                <p>尚無訊息</p>
                            </div>
                        ) : (
                            conversations.map(conv => (
                                <div
                                    key={conv.userId}
                                    onClick={() => setActiveConversation(conv.userId)}
                                    className={`p-3 rounded-xl flex items-center gap-3 cursor-pointer transition-colors ${activeConversationId === conv.userId
                                        ? 'bg-indigo-50 dark:bg-indigo-900/20'
                                        : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                                        }`}
                                >
                                    <Avatar className="w-10 h-10">
                                        <AvatarImage src={conv.avatarUrl} />
                                        <AvatarFallback>{conv.username[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <span className="font-bold text-sm truncate">{conv.username}</span>
                                            {conv.unreadCount > 0 && (
                                                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                                    {conv.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-neutral-500 truncate">{conv.lastMessage}</p>
                                    </div>
                                    <span className="text-[10px] text-neutral-400 self-start whitespace-nowrap">
                                        {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true, locale: zhTW })}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Main: Chat Window */}
                {activeConversationId ? (
                    <div className="flex-1 flex flex-col h-full bg-white dark:bg-neutral-900/50">
                        {/* Chat Header */}
                        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm sticky top-0 z-10">
                            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setActiveConversation(null)}>
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={activeConvUser?.avatarUrl} />
                                <AvatarFallback>{activeConvUser?.username?.[0]}</AvatarFallback>
                            </Avatar>
                            <span className="font-bold">{activeConvUser?.username || 'Loading...'}</span>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                            {currentChatMessages.map((m) => {
                                const isMe = m.sender_id === user?.id
                                return (
                                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`
                                            max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                                            ${isMe
                                                ? 'bg-indigo-600 text-white rounded-tr-sm'
                                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-sm'}
                                        `}>
                                            {m.content}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex items-center gap-2"
                            >
                                <Input
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    placeholder="輸入訊息..."
                                    className="rounded-full bg-neutral-100 dark:bg-neutral-800 border-none focus-visible:ring-indigo-500"
                                />
                                <Button type="submit" size="icon" className="rounded-full bg-indigo-600 hover:bg-indigo-700" disabled={!newMessage.trim()}>
                                    <Send className="w-4 h-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="hidden md:flex flex-1 flex-col items-center justify-center text-neutral-400">
                        <MessageSquare className="w-16 h-16 mb-4 opacity-10" />
                        <p>選擇一個對話開始聊天</p>
                    </div>
                )}

            </DialogContent>
        </Dialog>
    )
}

function ChevronLeft({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m15 18-6-6 6-6" />
        </svg>
    )
}
