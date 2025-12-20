'use client'

import { Editor } from '@tiptap/react'
import {
    Bold, Italic, Underline, Strikethrough,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Quote, Link, Image, Undo, Redo,
    Heading1, Heading2, Heading3,
    List, ListOrdered, Indent, Outdent,
    Maximize, Minimize, Type
} from 'lucide-react'
import { Toggle } from "@/components/ui/toggle"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface EditorToolbarProps {
    editor: Editor | null
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
    if (!editor) return null

    return (
        <div className="sticky top-0 z-50 w-full bg-[#fae8b0] dark:bg-amber-900/40 border-b border-black/5 px-2 py-2 flex items-center gap-1 flex-wrap shadow-sm transition-all">

            {/* History */}
            <div className="flex items-center gap-0.5">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().chain().focus().undo().run()}
                    className="h-8 w-8 p-0 text-amber-900 dark:text-amber-100 hover:bg-black/5"
                >
                    <Undo className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().chain().focus().redo().run()}
                    className="h-8 w-8 p-0 text-amber-900 dark:text-amber-100 hover:bg-black/5"
                >
                    <Redo className="h-4 w-4" />
                </Button>
            </div>

            <Separator orientation="vertical" className="h-6 bg-amber-900/20 mx-1" />

            {/* Text Style */}
            <div className="flex items-center gap-0.5">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('bold')}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    className="h-8 w-8 p-0 data-[state=on]:bg-amber-400/50 hover:bg-amber-200/50 text-amber-900 dark:text-amber-100"
                >
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('italic')}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    className="h-8 w-8 p-0 data-[state=on]:bg-amber-400/50 hover:bg-amber-200/50 text-amber-900 dark:text-amber-100"
                >
                    <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('strike')}
                    onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                    className="h-8 w-8 p-0 data-[state=on]:bg-amber-400/50 hover:bg-amber-200/50 text-amber-900 dark:text-amber-100"
                >
                    <Strikethrough className="h-4 w-4" />
                </Toggle>
            </div>

            <Separator orientation="vertical" className="h-6 bg-amber-900/20 mx-1" />

            {/* Headings */}
            <div className="flex items-center gap-0.5">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('heading', { level: 1 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className="h-8 w-8 p-0 data-[state=on]:bg-amber-400/50 hover:bg-amber-200/50 text-amber-900 dark:text-amber-100"
                >
                    <Heading1 className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive('heading', { level: 2 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className="h-8 w-8 p-0 data-[state=on]:bg-amber-400/50 hover:bg-amber-200/50 text-amber-900 dark:text-amber-100"
                >
                    <Heading2 className="h-4 w-4" />
                </Toggle>
            </div>

            <Separator orientation="vertical" className="h-6 bg-amber-900/20 mx-1" />

            {/* Alignment (Placeholder icons as exact Tiptap align may need extension) */}
            <div className="flex items-center gap-0.5">
                <Toggle
                    size="sm"
                    // onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                    className="h-8 w-8 p-0 hover:bg-amber-200/50 text-amber-900 dark:text-amber-100"
                >
                    <AlignLeft className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    // onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                    className="h-8 w-8 p-0 hover:bg-amber-200/50 text-amber-900 dark:text-amber-100"
                >
                    <AlignCenter className="h-4 w-4" />
                </Toggle>
            </div>

            <Separator orientation="vertical" className="h-6 bg-amber-900/20 mx-1" />

            {/* Inserts */}
            <div className="flex items-center gap-0.5">
                <Toggle
                    size="sm"
                    pressed={editor.isActive('blockquote')}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                    className="h-8 w-8 p-0 data-[state=on]:bg-amber-400/50 hover:bg-amber-200/50 text-amber-900 dark:text-amber-100"
                >
                    <Quote className="h-4 w-4" />
                </Toggle>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-amber-900 dark:text-amber-100 hover:bg-black/5"
                >
                    <Link className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-amber-900 dark:text-amber-100 hover:bg-black/5"
                >
                    <Image className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex-1" />

            {/* View */}
            <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-amber-900 dark:text-amber-100 hover:bg-black/5 ml-auto"
            >
                <Maximize className="h-4 w-4" />
            </Button>

        </div>
    )
}
