'use client'

import { useEffect } from 'react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <html>
            <body>
                <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-50 p-8 text-center text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
                    <h2 className="mb-4 text-2xl font-bold">Fatal Application Error</h2>
                    <p className="mb-8 max-w-md text-sm text-zinc-500">
                        The application has encountered a critical error and cannot recover.
                    </p>
                    <button
                        onClick={() => reset()}
                        className="rounded bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700"
                    >
                        Try again
                    </button>
                </div>
            </body>
        </html>
    )
}
