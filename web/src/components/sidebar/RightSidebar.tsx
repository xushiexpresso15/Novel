'use client'

import { useState } from "react"
import { Search, Plus, Trash2, Bot, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLoreStore, LoreItem, LoreType } from "@/store/useLoreStore"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

function LoreCard({ item, onDelete, onEdit }: { item: LoreItem, onDelete: () => void, onEdit: () => void }) {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    <div
                        className="group bg-white dark:bg-neutral-800 p-3 rounded-lg border border-neutral-100 dark:border-neutral-700 hover:border-indigo-500/50 cursor-pointer transition-all relative"
                        onDoubleClick={onEdit}
                    >
                        <div className="flex items-start justify-between mb-1">
                            <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">{item.title}</h4>
                            <span className="text-[10px] uppercase tracking-wider text-neutral-400 bg-neutral-100 dark:bg-neutral-900 px-1.5 py-0.5 rounded">
                                {item.type}
                            </span>
                        </div>
                        <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                            {item.description}
                        </p>

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
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-[300px] p-4 bg-white dark:bg-neutral-900 border-neutral-200 shadow-xl">
                    <h4 className="font-bold mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.description}</p>
                    <p className="text-xs text-indigo-400 mt-2 italic">雙擊卡片以編輯</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
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

    // Reset form when opening for new item
    if (open && !editingItem && title !== "" && !title) {
        // This logic is tricky in functional render, better use useEffect inside or key reset
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingItem ? '編輯資料' : '新增資料'}</DialogTitle>
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
                        // Reset manually if needed or rely on parent key
                        if (!editingItem) {
                            setTitle("")
                            setDescription("")
                        }
                    }}>儲存</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export function RightSidebar() {
    const { items, addItem, removeItem, updateItem } = useLoreStore()
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState("character") // 'character' | 'location' | 'item' | 'ai'

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
            addItem({
                title: data.title!,
                type: data.type as LoreType,
                description: data.description!
            })
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

    const handleSendAI = () => {
        if (!aiInput.trim()) return

        const userMsg = aiInput
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }])
        setAiInput('')

        // Simulate AI Response
        setTimeout(() => {
            setChatHistory(prev => [...prev, { role: 'ai', content: `這是對 "${userMsg}" 的模擬回應。 (AI 功能尚未連接)` }])
        }, 1000)
    }

    return (
        <div className="w-80 h-screen sticky top-0 border-l border-neutral-200 dark:border-neutral-800 bg-[#FDFBF7] dark:bg-neutral-900 flex flex-col overflow-hidden">

            {/* Top Stats */}
            <div className="grid grid-cols-2 gap-2 p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-black/20">
                <div className="bg-[#EAC435] text-white p-3 rounded-lg shadow-sm flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">字數統計</span>
                    <span className="text-2xl font-black">2,451</span>
                </div>
                <div className="bg-[#E27D60] text-white p-3 rounded-lg shadow-sm flex flex-col items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">閱讀時間(分)</span>
                    <span className="text-2xl font-black">12</span>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                    <div className="px-4 pt-4">
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

                    <div className="flex-1 overflow-y-auto min-h-0 bg-neutral-50/50 dark:bg-neutral-900/50 p-4">
                        <TabsContent value="ai" className="h-full mt-0">
                            <div className="flex flex-col h-full">
                                <ScrollArea className="flex-1 pr-4">
                                    <div className="space-y-4">
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
                                </ScrollArea>
                                <div className="mt-4 pt-2 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
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
                            </div>
                        </TabsContent>

                        {['character', 'location', 'item'].map(type => (
                            <TabsContent key={type} value={type} className="mt-0 space-y-3 pb-20">
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
                            </TabsContent>
                        ))}
                    </div>
                </Tabs>
            </div>

            {/* Footer with Add Button (Only show on non-AI tabs) */}
            {activeTab !== 'ai' && (
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky bottom-0 z-10">
                    <Button
                        className="w-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-indigo-600 dark:hover:bg-indigo-300 transition-colors shadow-lg shadow-indigo-500/10"
                        onClick={handleOpenAdd}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        新增資料
                    </Button>
                </div>
            )}

            {/* Keeping the Dialog Mounted */}
            <AddOrEditLoreDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                editingItem={editingItem}
                onSave={handleSave}
            />
        </div>
    )
}
