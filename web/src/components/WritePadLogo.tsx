import React from 'react'

export function WritePadLogo({ className = "w-8 h-8", classNameText = "text-xl" }: { className?: string, classNameText?: string }) {
    return (
        <div className="flex items-center gap-2 group">
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={`text-indigo-600 dark:text-indigo-400 transition-colors ${className}`}
            >
                {/* Pen Body/W Shape */}
                <path
                    d="M30 20 L42 75 L50 55 L58 75 L70 20"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-80"
                />

                {/* Nib Point */}
                <path
                    d="M50 55 L50 90"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                />

                {/* Decorative Nib Top */}
                <path
                    d="M30 20 C30 15 40 10 50 10 C60 10 70 15 70 20"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                />
            </svg>
            <span className={`font-bold tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors ${classNameText}`}>
                WritePad
            </span>
        </div>
    )
}

export function WritePadIcon({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`text-indigo-600 dark:text-indigo-400 ${className}`}
        >
            <path
                d="M30 20 L42 75 L50 55 L58 75 L70 20"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-80"
            />
            <path
                d="M50 55 L50 90"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
            />
            <path
                d="M30 20 C30 15 40 10 50 10 C60 10 70 15 70 20"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
            />
        </svg>
    )
}
