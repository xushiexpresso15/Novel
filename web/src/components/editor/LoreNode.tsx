import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'

export const LoreNode = Node.create({
    name: 'loreNode',

    group: 'block',

    atom: true,

    addAttributes() {
        return {
            title: {
                default: 'Unknown',
            },
            category: {
                default: 'item',
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'lore-card',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['lore-card', mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(LoreComponent)
    },
})

function LoreComponent(props: any) {
    const { title, category } = props.node.attrs

    return (
        <NodeViewWrapper className="my-4">
            <div className="inline-flex items-center gap-2 p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 text-sm select-none" contentEditable={false}>
                <span className="font-semibold px-2 py-0.5 rounded bg-white/50 text-xs uppercase tracking-wider">{category}</span>
                {title}
            </div>
        </NodeViewWrapper>
    )
}
