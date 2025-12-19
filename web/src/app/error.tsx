'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an aggregation service
        console.error(error)
    }, [error])

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4 text-center">
            <div className="flex max-w-md flex-col items-center space-y-6 rounded-2xl border border-border bg-card p-8 shadow-xl">
                <div className="rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    <AlertCircle className="h-8 w-8" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-bold tracking-tight">
                        系統發生了意外錯誤
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        別擔心，您的資料應該是安全的。這可能是一個暫時性的故障。
                    </p>
                </div>

                <div className="flex gap-4">
                    <Button
                        onClick={
                            // Attempt to recover by trying to re-render the segment
                            () => reset()
                        }
                    >
                        重試 (Try again)
                    </Button>
                    <Button variant="outline" onClick={() => window.location.href = '/'}>
                        回首頁
                    </Button>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-4 max-h-40 w-full overflow-auto rounded bg-muted/50 p-4 text-left text-xs font-mono">
                        {error.message}
                    </div>
                )}
            </div>
        </div>
    )
}
