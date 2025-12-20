'use client'

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Search, Plus, Trash2, Bot, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLoreStore, LoreItem, LoreType } from "@/store/useLoreStore"
import { useChapterStore } from "@/store/useChapterStore"
import { useNovelStore } from "@/store/useNovelStore"
// Remove ScrollArea usage, use native overflow
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

function LoreCard({ item, onDelete, onEdit }: { item: LoreItem, onDelete: () => void, onEdit: () => void }) {
    return (
        <div
            className="group bg-white dark:bg-neutral-800 p-3 rounded-lg border border-neutral-100 dark:border-neutral-700 hover:border-indigo-500/50 cursor-pointer transition-all relative"
            onClick={onEdit}
        >
            <div className="flex items-start justify-between mb-1">
                <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">{item.title}</h4>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded">
                    {item.type}
                </span>
            </div>
            {/* Hover expand effect */}
            <div className="relative">
                <p className="text-xs text-neutral-500 line-clamp-2 group-hover:line-clamp-none leading-relaxed transition-all duration-300">
                    {item.description}
                </p>
            </div>

            {/* Actions */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white dark:bg-neutral-800 shadow-sm rounded-md p-0.5">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-400 hover:text-red-600 hover:bg-red-50"
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete()
                    }}
                >
                    <Trash2 className="w-3 h-3" />
                </Button>
            </div>
        </div>
    )
}

function AddOrEditLoreDialog({
    open,
    onOpenChange,
    editingItem,
    onSave
}: {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    editingItem: LoreItem | null,
    onSave: (item: Partial<LoreItem>) => void
}) {
    const [title, setTitle] = useState(editingItem?.title || "")
    const [type, setType] = useState<LoreType>(editingItem?.type || "character")
    const [description, setDescription] = useState(editingItem?.description || "")

    // State for tracking props changes
    const [prevOpen, setPrevOpen] = useState(open)
    const [prevItem, setPrevItem] = useState(editingItem)

    if (open !== prevOpen || editingItem !== prevItem) {
        setPrevOpen(open)
        setPrevItem(editingItem)
        if (open) {
            setTitle(editingItem?.title || "")
            setType(editingItem?.type || "character")
            setDescription(editingItem?.description || "")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{editingItem ? '編輯資料' : '新增資料'}</DialogTitle>
                    <div className="sr-only">
                        <DialogDescription>
                            在此{editingItem ? '編輯' : '新增'}您的設定資料，包含名稱、類型與詳細描述。
                        </DialogDescription>
                    </div>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>名稱</Label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="例如：林若曦" />
                    </div>
                    <div className="grid gap-2">
                        <Label>類型</Label>
                        <div className="flex gap-2">
                            {(['character', 'location', 'item'] as LoreType[]).map(t => (
                                <Button
                                    key={t}
                                    type="button"
                                    variant={type === t ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setType(t)}
                                    className="capitalize"
                                >
                                    {t}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label>描述</Label>
                        <Textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={5}
                            placeholder="輸入詳細設定..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => {
                        onSave({ title, type, description })
                        onOpenChange(false)
                    }}>儲存</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function RightSidebar() {
    const { items, addItem, removeItem, updateItem, fetchItems } = useLoreStore()
    const { wordCount } = useChapterStore()
    const { selectedNovelId } = useNovelStore()
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState("character") // 'character' | 'location' | 'item' | 'ai'

    useEffect(() => {
        if (selectedNovelId) {
            fetchItems(selectedNovelId)
        }
    }, [fetchItems, selectedNovelId])

    // Dialog States
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<LoreItem | null>(null)

    // AI Chat State
    const [aiInput, setAiInput] = useState('')
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', content: string }[]>([
        { role: 'ai', content: '嗨！我是你的寫作助手。需要幫忙想名字、設定背景，或是梳理劇情嗎？' }
    ])

    const filteredItems = items.filter(item =>
        (searchQuery === '' || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
        item.type === activeTab
    )

    const handleSave = (data: Partial<LoreItem>) => {
        if (editingItem) {
            updateItem(editingItem.id, data)
            toast.success("資料已更新")
        } else {
            if (!selectedNovelId) return
            addItem({
                title: data.title!,
                type: data.type as LoreType,
                description: data.description!
            }, selectedNovelId)
            toast.success("新增成功")
        }
        setEditingItem(null)
    }

    const handleOpenAdd = () => {
        setEditingItem(null)
        setDialogOpen(true)
    }

    const handleOpenEdit = (item: LoreItem) => {
        setEditingItem(item)
        setDialogOpen(true)
    }

    const handleSendAI = async () => {
        if (!aiInput.trim()) return

        const userMsg = aiInput
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }])
        setAiInput('')
        setChatHistory(prev => [...prev, { role: 'ai', content: '思考中...' }])

        try {
            const { data, error } = await supabase.functions.invoke('gemini', {
                body: { prompt: userMsg }
            })

            if (error) throw error

            setChatHistory(prev => {
                const newHistory = [...prev]
                const lastMsg = newHistory[newHistory.length - 1]
                if (lastMsg.role === 'ai' && lastMsg.content === '思考中...') {
                    lastMsg.content = data.text
                } else {
                    newHistory.push({ role: 'ai', content: data.text })
                }
                return newHistory
            })
        } catch (error) {
            console.error('AI Error:', error)
            setChatHistory(prev => {
                const newHistory = [...prev]
                const lastMsg = newHistory[newHistory.length - 1]
                if (lastMsg.role === 'ai' && lastMsg.content === '思考中...') {
                    lastMsg.content = '抱歉，AI 暫時無法回應。請稍後再試。'
                }
                return newHistory
            })
            toast.error('AI 連線失敗')
        }
    }

    // Force integer reading time, minimum 1
    const readingTime = Math.max(1, Math.ceil(wordCount / 500));

    return (
        <div className="w-80 h-screen sticky top-0 border-l border-neutral-200 dark:border-neutral-800 bg-[#FDFBF7] dark:bg-neutral-900 flex flex-col">

            {/* Top Stats */}
            <div className="grid grid-cols-2 gap-2 p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-black/20 shrink-0">
                <div className="bg-[#EAC435] text-white p-3 rounded-lg shadow-sm flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">字數統計</span>
                    <span className="text-2xl font-black">{wordCount.toLocaleString()}</span>
                </div>
                <div className="bg-[#E27D60] text-white p-3 rounded-lg shadow-sm flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">閱讀時間(分)</span>
                    <span className="text-2xl font-black">{readingTime}</span>
                </div>
            </div>

            {/* Content Area - Flex Logic: 
                The Tabs container takes all remaining space (flex-1).
                Inside tabs, the content area takes all remaining space.
            */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
                {/* Fixed Search Header */}
                <div className="px-4 pt-4 shrink-0">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="搜尋設定..."
                            className="pl-9 bg-white dark:bg-neutral-800"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <TabsList className="grid w-full grid-cols-4 bg-neutral-100 dark:bg-neutral-800 h-9 p-1">
                        <TabsTrigger value="character" className="text-xs">角色</TabsTrigger>
                        <TabsTrigger value="location" className="text-xs">地點</TabsTrigger>
                        <TabsTrigger value="item" className="text-xs">物品</TabsTrigger>
                        <TabsTrigger value="ai" className="text-xs"><Bot className="w-3 h-3 mr-1" />AI</TabsTrigger>
                    </TabsList>
                </div>

                {/* Scrollable Content Zone */}
                <div className="flex-1 min-h-0 bg-neutral-50/50 dark:bg-neutral-900/50 relative">

                    {/* AI Tab */}
                    <TabsContent value="ai" className="h-full m-0 p-0 flex flex-col absolute inset-0">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {chatHistory.map((msg, i) => (
                                <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                    <div className={cn(
                                        "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                                        msg.role === 'user'
                                            ? "bg-indigo-600 text-white rounded-br-none"
                                            : "bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-100 dark:border-neutral-700 rounded-bl-none"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shrink-0 flex gap-2">
                            <Input
                                value={aiInput}
                                onChange={e => setAiInput(e.target.value)}
                                placeholder="詢問 AI..."
                                onKeyDown={e => e.key === 'Enter' && handleSendAI()}
                                className="bg-white dark:bg-neutral-800"
                            />
                            <Button size="icon" onClick={handleSendAI} className="bg-indigo-600 hover:bg-indigo-700">
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </TabsContent>

                    {/* Lore Tabs */}
                    {['character', 'location', 'item'].map(type => (
                        <TabsContent key={type} value={type} className="h-full m-0 p-0 absolute inset-0 flex flex-col">
                            {/* The scroll container */}
                            <div className="flex-1 overflow-y-auto p-4">
                                <div className="space-y-3 pb-20">
                                    {filteredItems.length === 0 ? (
                                        <div className="text-center py-8 text-neutral-400 text-sm italic">
                                            尚無{type === 'character' ? '角色' : type === 'location' ? '地點' : '物品'}資料
                                        </div>
                                    ) : (
                                        filteredItems.map(item => (
                                            <LoreCard
                                                key={item.id}
                                                item={item}
                                                onDelete={() => removeItem(item.id)}
                                                onEdit={() => handleOpenEdit(item)}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    ))}
                </div>
            </Tabs>

            {/* Footer with Add Button */}
            {activeTab !== 'ai' && (
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky bottom-0 z-10 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <Button
                        className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-indigo-600 dark:hover:bg-indigo-300 transition-colors shadow-lg shadow-indigo-500/10"
                        onClick={handleOpenAdd}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        新增資料
                    </Button>
                </div>
            )}

            <AddOrEditLoreDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                editingItem={editingItem}
                onSave={handleSave}
            />
        </div>
    )
}
