'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useNovelStore, Novel } from "@/store/useNovelStore"
import { toast } from "sonner"

const GENRES = [
    '羅曼史', '校園', '奇幻', '玄幻', '武俠', '仙俠',
    '都市', '歷史', '軍事', '懸疑', '科幻', '遊戲',
    '同人', '輕小說'
]

interface NovelSettingsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    novel: Novel | undefined
}

export function NovelSettingsDialog({ open, onOpenChange, novel }: NovelSettingsDialogProps) {
    const { updateNovel } = useNovelStore()
    const [title, setTitle] = useState("")
    const [genre, setGenre] = useState("")
    const [description, setDescription] = useState("")
    const [isPublic, setIsPublic] = useState(false)

    const [prevOpen, setPrevOpen] = useState(open)
    const [prevNovel, setPrevNovel] = useState(novel)

    if (open !== prevOpen || novel !== prevNovel) {
        setPrevOpen(open)
        setPrevNovel(novel)
        if (open && novel) {
            setTitle(novel.title)
            setGenre(novel.genre || "")
            setDescription(novel.description || "")
            setIsPublic(novel.is_public || false)
        }
    }

    const handleSave = async () => {
        if (!novel) return

        try {
            await updateNovel(novel.id, {
                title,
                genre,
                description,
                is_public: isPublic
            })
            toast.success("小說設定已更新")
            onOpenChange(false)
        } catch {
            toast.error("更新失敗")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>小說設定</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label>小說名稱</Label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} />
                    </div>

                    <div className="grid gap-2">
                        <Label>小說屬性</Label>
                        <Select value={genre} onValueChange={setGenre}>
                            <SelectTrigger>
                                <SelectValue placeholder="選擇分類..." />
                            </SelectTrigger>
                            <SelectContent>
                                {GENRES.map(g => (
                                    <SelectItem key={g} value={g}>{g}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>小說簡介</Label>
                        <Textarea
                            placeholder="請輸入小說簡介..."
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            className="h-32 resize-none"
                        />
                    </div>

                    <div className="flex items-center justify-between space-x-2">
                        <div className="flex flex-col space-y-1">
                            <Label>公開狀態</Label>
                            <span className="text-xs text-muted-foreground">{isPublic ? "已公開 (所有人可見)" : "未公開 (僅自己可見)"}</span>
                        </div>
                        <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>儲存設定</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
