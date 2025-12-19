'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLoreStore } from "@/store/useLoreStore"
import { Users, MapPin, Box, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

function LoreCard({ item }: { item: any }) {
    return (
        <div
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', item.title)
                e.dataTransfer.effectAllowed = 'copy'
            }}
            className="group relative p-3 rounded-xl bg-white/50 dark:bg-black/20 hover:bg-white/80 dark:hover:bg-white/5 border border-white/10 transition-all cursor-grab active:cursor-grabbing backdrop-blur-sm shadow-sm hover:shadow-md"
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
        </div>
    )
}

export function RightSidebar() {
    const { items } = useLoreStore()

    return (
        <div className="w-80 h-screen sticky top-0 flex flex-col border-l border-white/20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
            {/* Search Bar */}
            <div className="p-4 border-b border-white/10">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="搜尋設定..."
                        className="pl-9 bg-white/50 dark:bg-black/20 border-transparent focus:bg-white dark:focus:bg-black/50 transition-colors"
                    />
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="character" className="flex-1 flex flex-col">
                <div className="px-4 pt-2">
                    <TabsList className="w-full grid grid-cols-3 bg-black/5 dark:bg-white/5">
                        <TabsTrigger value="character">角色</TabsTrigger>
                        <TabsTrigger value="location">地點</TabsTrigger>
                        <TabsTrigger value="item">物品</TabsTrigger>
                    </TabsList>
                </div>

                <ScrollableContent value="character" items={items} category="character" />
                <ScrollableContent value="location" items={items} category="location" />
                <ScrollableContent value="item" items={items} category="item" />
            </Tabs>

            {/* Add Button */}
            <div className="p-4 border-t border-white/10">
                <Button variant="outline" className="w-full border-dashed border-slate-300 dark:border-slate-700 text-muted-foreground hover:text-foreground">
                    <Plus className="w-4 h-4 mr-2" />
                    新增資料
                </Button>
            </div>
        </div>
    )
}

function ScrollableContent({ value, items, category }: { value: string, items: any[], category: string }) {
    const filteredItems = items.filter(i => i.category === category)

    return (
        <TabsContent value={value} className="flex-1 overflow-y-auto px-4 py-2 space-y-3 mt-0">
            {filteredItems.map(item => (
                <LoreCard key={item.id} item={item} />
            ))}
            {filteredItems.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                    暫無資料
                </div>
            )}
        </TabsContent>
    )
}
