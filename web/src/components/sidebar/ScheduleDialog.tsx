'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { useState } from "react"
import { format } from "date-fns"

interface ScheduleDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (date: Date) => void
    isLoading?: boolean
}

export function ScheduleDialog({ open, onOpenChange, onConfirm, isLoading }: ScheduleDialogProps) {
    const [date, setDate] = useState<Date | undefined>(new Date())

    const handleConfirm = () => {
        if (!date) return
        onConfirm(date)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                <DialogHeader>
                    <DialogTitle>預約發布</DialogTitle>
                    <DialogDescription>
                        選擇章節自動公開的日期與時間。
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4 items-center">
                    <DateTimePicker date={date} setDate={setDate} />

                    {date && (
                        <div className="text-sm text-zinc-500 text-center mt-2">
                            預計發布時間: <br />
                            <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                {format(date, 'yyyy/MM/dd HH:mm')}
                            </span>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
                    <Button onClick={handleConfirm} disabled={!date || isLoading}>
                        {isLoading ? "排程中..." : "確認預約"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
