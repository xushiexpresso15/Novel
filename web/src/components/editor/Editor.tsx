'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { IndentParagraph } from './IndentParagraph'
import { LoreNode } from './LoreNode' // Import LoreNode
import { HocuspocusProvider } from '@hocuspocus/provider'
import { IndexeddbPersistence } from 'y-indexeddb'
import * as Y from 'yjs'
import { cn } from '@/lib/utils'
import { useChapterStore } from '@/store/useChapterStore'
import { useEffect, useState, useMemo, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner' // Import Toast

// Define a consistent color for this user (random for MVP)
const getRandomColor = () => {
    const colors = ['#958DF1', '#F98181', '#FBBC88', '#FAF594', '#70CFF8', '#94FADB', '#B9F18D']
    return colors[Math.floor(Math.random() * colors.length)]
}

export function Editor() {
    const { activeChapterId } = useChapterStore()
    const [status, setStatus] = useState('connecting')
    const [provider, setProvider] = useState<HocuspocusProvider | null>(null)

    // Create YJS document
    const ydoc = useMemo(() => new Y.Doc(), [])

    // User info (Mock for MVP)
    const user = useMemo(() => ({
        name: 'Author-' + Math.floor(Math.random() * 100),
        color: getRandomColor(),
    }), [])

    useEffect(() => {
        if (!activeChapterId) return;

        // 1. Connect to WebSocket Server (Hocuspocus)
        // In a real app, this URL should be an environment variable.
        // For GitHub Pages demo, we might not have a backend, so this will fail gracefully
        // and fall back to IndexedDB (Offline mode).
        // Actually, for a pure static demo without a backend, let's just use localhost
        // and let it fail to "Offline" state if deployed.
        // 1. Connect to WebSocket Server (Hocuspocus)
        // const newProvider = new HocuspocusProvider({
        //    url: 'ws://127.0.0.1:1234',
        //    name: `novel-chapter-${activeChapterId}`,
        //    document: ydoc,
        //    onStatus: (event) => {
        //        setStatus(event.status)
        //    },
        // })

        // setProvider(newProvider)
        setProvider(null)

        // 2. Setup Local Persistence (IndexedDB) for Offline Support
        const persistence = new IndexeddbPersistence(
            `novel-chapter-${activeChapterId}`,
            ydoc
        )

        // Cleanup on verify/unmount
        return () => {
            // newProvider.destroy()
            persistence.destroy()
        }
    }, [activeChapterId, ydoc])

    // Effect to handle toasts separately based on status state change to avoid spam
    useEffect(() => {
        if (status === 'connected') {
            toast.success('已連線 (Online)', { description: '多人協作功能已啟用', duration: 3000 })
        } else if (status === 'disconnected') {
            toast.warning('離線模式 (Offline)', { description: '變更將儲存於本地，連線後自動同步', duration: 5000 })
        }
    }, [status])

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                paragraph: false,
                // @ts-ignore - history option exists in runtime but might be missing in type definition depending on version
                history: false,
            }),
            IndentParagraph,
            LoreNode, // Add LoreNode extension
            Placeholder.configure({
                placeholder: '開始你的創作...',
            }),
            // Collaboration Extensions
            Collaboration.configure({
                document: ydoc,
            }),
            //provider ? CollaborationCursor.configure({
            //    provider: provider,
            //    user: user,
            //}) : undefined,
        ].filter(e => e !== undefined),
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-slate dark:prose-invert max-w-none focus:outline-none',
                    'min-h-[calc(100vh-10rem)] p-8 md:p-12',
                    'font-serif text-lg leading-relaxed tracking-wide',
                    'selection:bg-primary/20 selection:text-primary-foreground'
                ),
            },
        },
        onCreate({ editor }) {
            // Sync initial user info
            // editor.commands.updateUser(user)
        }
    }, [provider]) // Re-create editor when provider changes


    if (!editor || !activeChapterId) {
        return (
            <div className="flex h-[800px] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="relative w-full max-w-3xl mx-auto my-8">
            {/* Paper Container */}
            <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-2xl min-h-[800px] transition-shadow duration-500 relative">
                {/* Sync Status Badge (Debug purpose for MVP) */}
                <div className={cn(
                    "absolute top-4 right-4 text-xs px-2 py-1 rounded-full font-mono transition-colors",
                    status === 'connected' ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                )}>
                    {status}
                </div>

                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
