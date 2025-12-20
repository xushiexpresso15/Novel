'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import CharacterCount from '@tiptap/extension-character-count'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { IndentParagraph } from './IndentParagraph'
import { LoreNode } from './LoreNode'
import { cn } from '@/lib/utils'
import { useChapterStore } from '@/store/useChapterStore'
import { useNovelStore } from '@/store/useNovelStore'
import { useEffect, useState, useMemo } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { EditorToolbar } from './EditorToolbar'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

// Define a consistent color for this user (random for MVP)
const getRandomColor = () => {
    const colors = ['#958DF1', '#F98181', '#FBBC88', '#FAF594', '#70CFF8', '#94FADB', '#B9F18D']
    return colors[Math.floor(Math.random() * colors.length)]
}

export function Editor() {
    const { activeChapterId, setWordCount, chapters, updateChapter } = useChapterStore()
    const { selectedNovelId, novels, updateNovel } = useNovelStore()
    const [status, setStatus] = useState('connecting')

    const activeChapter = chapters.find(c => c.id === activeChapterId)
    const activeNovel = novels.find(n => n.id === selectedNovelId)

    // Mock user
    const user = useMemo(() => ({
        name: 'Author-' + Math.floor(Math.random() * 100),
        color: getRandomColor(),
    }), [])

    const countWords = (text: string) => {
        const cjkCount = (text.match(/[\u4e00-\u9fa5]/g) || []).length
        const otherText = text.replace(/[\u4e00-\u9fa5]/g, ' ')
        const englishCount = (otherText.match(/\S+/g) || []).length
        return cjkCount + englishCount
    }

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                paragraph: false,
            }),
            IndentParagraph,
            LoreNode,
            Placeholder.configure({
                placeholder: '開始你的創作...',
            }),
            Underline,
            CharacterCount,
            Image,
            Link.configure({
                openOnClick: false,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        editorProps: {
            attributes: {
                class: cn(
                    'prose prose-lg prose-slate dark:prose-invert max-w-none focus:outline-none',
                    'min-h-[500px] px-8 py-4',
                    'font-serif text-lg leading-relaxed tracking-wide',
                    'selection:bg-yellow-200 selection:text-black'
                ),
            },
        },
        onCreate({ editor }) {
            setWordCount(countWords(editor.getText()))
        },
        onUpdate({ editor }) {
            setWordCount(countWords(editor.getText()))
        }
    }, [activeChapterId])

    if (!activeChapterId) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-[#FDFBF7] dark:bg-neutral-900">
                <div className="text-center text-muted-foreground">
                    <p>請選擇或建立章節</p>
                </div>
            </div>
        )
    }

    if (!editor) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-[#FDFBF7] dark:bg-neutral-900">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-[#FDFBF7] dark:bg-[#1a1a1a]">
            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto scroll-smooth">
                <div className="max-w-4xl mx-auto min-h-screen bg-white dark:bg-[#1E1E1E] shadow-sm my-8 border border-neutral-200 dark:border-neutral-800 relative flex flex-col">

                    {/* Header: Titles */}
                    <div className="px-12 pt-12 pb-4 space-y-4">
                        {/* Novel Title */}
                        <Input
                            className="text-4xl font-bold border-none shadow-none px-0 h-auto focus-visible:ring-0 placeholder:text-neutral-300"
                            placeholder="致墨色的你"
                            value={activeNovel?.title || ''}
                            onChange={(e) => activeNovel && updateNovel(activeNovel.id, { title: e.target.value })}
                        />
                        {/* Chapter Title */}
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-lg"># {String(activeChapter?.order ? activeChapter.order + 1 : 1)}</span>
                            <Input
                                className="text-xl text-muted-foreground border-none shadow-none px-0 h-auto focus-visible:ring-0 placeholder:text-neutral-300"
                                placeholder="篇章標題(選填)"
                                value={activeChapter?.title || ''}
                                onChange={(e) => activeChapterId && updateChapter(activeChapterId, { title: e.target.value })}
                            />
                        </div>
                    </div>

                    <Separator className="mx-12 my-2 w-auto bg-neutral-200" />

                    {/* Sticky Toolbar Wrapper */}
                    <div className="sticky top-0 z-40 bg-white dark:bg-[#1E1E1E] px-8 py-2 border-b border-neutral-100 dark:border-neutral-800">
                        <div className="rounded-lg overflow-hidden border border-amber-200 shadow-sm">
                            <EditorToolbar editor={editor} />
                        </div>
                    </div>

                    {/* Editor Content */}
                    <div className="flex-1 pb-32">
                        <EditorContent editor={editor} />
                    </div>
                </div>
            </div>

            {/* Status Footer if needed, but sidebar has most info */}
        </div>
    )
}
