'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserPlus, X } from "lucide-react"

export function CollaborateDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
    const [email, setEmail] = useState("")
    const [collaborators, setCollaborators] = useState([
        { id: '1', name: 'User A', email: 'user.a@example.com', avatar: '' }
    ])

    const handleInvite = () => {
        if (!email) return
        // Mock invite
        setCollaborators([...collaborators, {
            id: String(Date.now()),
            name: email.split('@')[0],
            email,
            avatar: ''
        }])
        setEmail("")
    }

    const removeCollaborator = (id: string) => {
        setCollaborators(collaborators.filter(c => c.id !== id))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>協作管理</DialogTitle>
                    <DialogDescription>邀請其他人一起編輯這本小說。</DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="flex gap-2 items-end">
                        <div className="grid gap-2 flex-1">
                            <Label>邀請使用者</Label>
                            <Input
                                placeholder="輸入 Email..."
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleInvite} size="icon" className="bg-indigo-600 hover:bg-indigo-700">
                            <UserPlus className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-xs text-muted-foreground uppercase tracking-wider">目前成員</Label>
                        <div className="space-y-2">
                            {collaborators.map(user => (
                                <div key={user.id} className="flex items-center justify-between p-2 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{user.name}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-neutral-400 hover:text-red-500" onClick={() => removeCollaborator(user.id)}>
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
