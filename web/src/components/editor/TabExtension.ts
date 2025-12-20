import { Extension } from '@tiptap/core'

export const TabExtension = Extension.create({
    name: 'tab',

    addKeyboardShortcuts() {
        return {
            Tab: () => {
                return this.editor.commands.insertContent('\t')
            },
        }
    },
})
