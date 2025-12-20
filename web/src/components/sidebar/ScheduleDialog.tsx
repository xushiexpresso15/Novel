'use client'

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { format } from "date-fns"
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { zhTW } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

// Register locale
registerLocale('zh-TW', zhTW)

interface ScheduleDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (date: Date) => void
    isLoading?: boolean
}

export function ScheduleDialog({ open, onOpenChange, onConfirm, isLoading }: ScheduleDialogProps) {
    const [date, setDate] = useState<Date | null>(new Date())

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

                <div className="flex flex-col gap-4 py-4 items-center w-full">
                    <div className="w-full relative">
                        <style jsx global>{`
                            .react-datepicker-wrapper {
                                width: 100%;
                            }
                            .react-datepicker__input-container input {
                                width: 100%;
                                padding: 0.5rem 1rem;
                                border-radius: 0.5rem;
                                border: 1px solid #e4e4e7;
                                background-color: transparent;
                                font-size: 0.875rem;
                                color: inherit;
                            }
                            .dark .react-datepicker__input-container input {
                                border-color: #27272a;
                                color: white;
                            }
                            .react-datepicker {
                                font-family: inherit;
                                border-color: #e4e4e7;
                                background-color: white;
                            }
                            .dark .react-datepicker {
                                border-color: #27272a;
                                background-color: #18181b;
                                color: white;
                            }
                            .react-datepicker__header {
                                background-color: #f4f4f5;
                                border-bottom-color: #e4e4e7;
                            }
                            .dark .react-datepicker__header {
                                background-color: #27272a;
                                border-bottom-color: #27272a;
                            }
                            .react-datepicker__current-month, .react-datepicker__day-name {
                                color: inherit;
                            }
                            .dark .react-datepicker__current-month, .dark .react-datepicker__day-name {
                                color: white;
                            }
                            .react-datepicker__day {
                                color: inherit;
                            }
                            .dark .react-datepicker__day {
                                color: #d4d4d8;
                            }
                            .react-datepicker__day:hover {
                                background-color: #f4f4f5;
                            }
                            .dark .react-datepicker__day:hover {
                                background-color: #27272a;
                            }
                            .react-datepicker__day--selected {
                                background-color: #4f46e5 !important;
                                color: white !important;
                            }
                            .react-datepicker__time-container {
                                border-left-color: #e4e4e7;
                            }
                            .dark .react-datepicker__time-container {
                                border-left-color: #27272a;
                            }
                            .react-datepicker__time-container .react-datepicker__time {
                                background-color: white;
                            }
                            .dark .react-datepicker__time-container .react-datepicker__time {
                                background-color: #18181b;
                                color: white;
                            }
                             .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item:hover {
                                background-color: #f4f4f5;
                             }
                             .dark .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item:hover {
                                background-color: #27272a;
                             }
                             .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected {
                                background-color: #4f46e5 !important;
                                color: white !important;
                             }
                        `}</style>
                        <DatePicker
                            selected={date}
                            onChange={(date: Date | null) => setDate(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="yyyy/MM/dd HH:mm"
                            locale="zh-TW"
                            minDate={new Date()}
                            placeholderText="請選擇預約時間"
                            showIcon
                            icon={<CalendarIcon className="w-4 h-4 top-1/2 -translate-y-1/2 right-3 absolute pointer-events-none text-zinc-500" />}
                            className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
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
