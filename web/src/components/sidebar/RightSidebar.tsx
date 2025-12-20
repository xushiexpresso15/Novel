'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLoreStore } from "@/store/useLoreStore"
import { useChapterStore } from "@/store/useChapterStore"
import { Users, MapPin, Box, Plus, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useState } from "react"

function LoreCard({ item, onDelete }: { item: any, onDelete: () => void }) {
    return (
        <div
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', item.title)
                e.dataTransfer.effectAllowed = 'copy'
            }}
            className="group relative p-3 rounded-xl bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-white/5 border border-white/10 transition-all cursor-grab active:cursor-grabbing backdrop-blur-sm shadow-sm hover:shadow-md pr-8"
        >
            <div className="flex items-start gap-3">
                <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white/10",
                    item.category === 'character' ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" :
                        item.category === 'location' ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
                            "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                )}>
                    {item.category === 'character' && <Users className="w-5 h-5" />}
                    {item.category === 'location' && <MapPin className="w-5 h-5" />}
                    {item.category === 'item' && <Box className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{item.description}</p>
                </div>
            </div>

            {/* Delete Button */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 h-6 w-6 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                }}
            >
                <Trash2 className="w-3 h-3" />
            </Button>
        </div>
    )
}

function StatCard({ label, value }: { label: string, value: string | number }) {
    return (
        <div className="bg-[#FAE5D3] dark:bg-neutral-800 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-[#F1C40F] dark:bg-yellow-600 px-3 py-1.5 text-center">
                <span className="text-white dark:text-white font-bold text-sm tracking-wide">{label}</span>
            </div>
            <div className="p-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">{value}</span>
            </div>
        </div>
    )
}

export function RightSidebar() {
    const { items, removeItem } = useLoreStore()
    const { wordCount } = useChapterStore()
    const [searchQuery, setSearchQuery] = useState('')

    const readingTime = Math.ceil(wordCount / 300)

    return (
        <div className="w-64 h-screen sticky top-0 flex flex-col border-l border-neutral-200 dark:border-neutral-800 bg-[#FDFBF7] dark:bg-neutral-900 overflow-hidden">

            {/* Statistics Section */}
            <div className="p-4 space-y-4 border-b border-neutral-200 dark:border-neutral-800">
                <StatCard label="字數統計" value={wordCount} />
                <StatCard label="閱讀時間(分鐘)" value={readingTime} />
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="搜尋設定..."
                        className="pl-9 bg-white dark:bg-black/20 border-neutral-200 dark:border-neutral-700 focus:bg-white dark:focus:bg-black/50 transition-colors"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="character" className="flex-1 flex flex-col">
                <div className="px-4 pt-2">
                    <TabsList className="w-full grid grid-cols-3 bg-neutral-100 dark:bg-white/5">
                        <TabsTrigger value="character">角色</TabsTrigger>
                        <TabsTrigger value="location">地點</TabsTrigger>
                        <TabsTrigger value="item">物品</TabsTrigger>
                    </TabsList>
                </div>

                <ScrollableContent
                    value="character"
                    items={items}
                    category="character"
                    query={searchQuery}
                    onDelete={removeItem}
                />
                <ScrollableContent
                    value="location"
                    items={items}
                    category="location"
                    query={searchQuery}
                    onDelete={removeItem}
                />
                <ScrollableContent
                    value="item"
                    items={items}
                    category="item"
                    query={searchQuery}
                    onDelete={removeItem}
                />
            </Tabs>

            {/* Add Button */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800">
                <Button variant="outline" className="w-full border-dashed border-slate-300 dark:border-slate-700 text-muted-foreground hover:text-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    新增資料
                </Button>
            </div>
        </div>
    )
}

function ScrollableContent({ value, items, category, query, onDelete }: { value: string, items: any[], category: string, query: string, onDelete: (id: string) => void }) {
    const filteredItems = items.filter(i =>
        i.category === category &&
        (i.title.toLowerCase().includes(query.toLowerCase()) || i.description.toLowerCase().includes(query.toLowerCase()))
    )

    return (
        <TabsContent value={value} className="flex-1 overflow-y-auto px-4 py-2 space-y-3 mt-0">
            {filteredItems.map(item => (
                <LoreCard key={item.id} item={item} onDelete={() => onDelete(item.id)} />
            ))}
            {filteredItems.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                    {query ? '找不到符合的資料' : '暫無資料'}
                </div>
            )}
        </TabsContent>
    )
}
