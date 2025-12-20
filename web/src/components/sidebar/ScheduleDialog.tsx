'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { format } from "date-fns"
import { zhTW } from "date-fns/locale"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

interface ScheduleDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (date: Date) => void
    isLoading?: boolean
}

export function ScheduleDialog({ open, onOpenChange, onConfirm, isLoading }: ScheduleDialogProps) {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [timeValue, setTimeValue] = useState("12:00") // Default time

    const handleConfirm = () => {
        if (!date) return

        // Combine date and time
        const [hours, minutes] = timeValue.split(':').map(Number)
        const scheduledDate = new Date(date)
        scheduledDate.setHours(hours)
        scheduledDate.setMinutes(minutes)
        scheduledDate.setSeconds(0)

        // Ensure future date? (Optional, maybe user wants to backdate?)
        // Let's allow any date for flexibility, but maybe warn if past? nah.

        onConfirm(scheduledDate)
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

                <div className="flex flex-col gap-4 py-4">
                    {/* Date Picker */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            選擇日期
                        </label>
                        <div className="border rounded-lg p-2 flex justify-center bg-zinc-50 dark:bg-zinc-950/50">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                                locale={zhTW}
                                className="rounded-md"
                            />
                        </div>
                    </div>

                    {/* Time Picker (Simple Input) */}
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            選擇時間
                        </label>
                        <input
                            type="time"
                            value={timeValue}
                            onChange={(e) => setTimeValue(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="text-sm text-zinc-500 text-center">
                        預計發布時間: <br />
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                            {date ? `${format(date, 'yyyy/MM/dd')} ${timeValue}` : '請選擇日期'}
                        </span>
                    </div>
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
