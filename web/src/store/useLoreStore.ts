import { create } from 'zustand'

export type LoreType = 'character' | 'location' | 'item'

export interface LoreItem {
    id: string
    title: string
    type: LoreType
    description: string
    imageUrl?: string // Optional for now
}

interface LoreStore {
    items: LoreItem[]
    addItem: (item: Omit<LoreItem, 'id'>) => void
    removeItem: (id: string) => void
    updateItem: (id: string, data: Partial<LoreItem>) => void
}

export const useLoreStore = create<LoreStore>((set) => ({
    items: [
        {
            id: '1',
            title: '林若曦',
            type: 'character',
            description: '本作女主角，17歲，性格外冷內熱。擁有操縱冰雪的能力。',
            imageUrl: '/avatars/1.png'
        },
        {
            id: '2',
            title: '雲隱村',
            type: 'location',
            description: '位於深山之中的古老村落，四季如春，被結界保護著。',
        },
        {
            id: '3',
            title: '破魔之劍',
            type: 'item',
            description: '傳說中勇者留下的佩劍，對魔族有極大的殺傷力。',
        }
    ],
    addItem: (item) =>
        set((state) => ({
            items: [
                ...state.items,
                { ...item, id: Math.random().toString(36).substr(2, 9) }
            ],
        })),
    removeItem: (id) =>
        set((state) => ({
            items: state.items.filter((item) => item.id !== id),
        })),
    updateItem: (id, data) =>
        set((state) => ({
            items: state.items.map((item) => (item.id === id ? { ...item, ...data } : item)),
        })),
}))
