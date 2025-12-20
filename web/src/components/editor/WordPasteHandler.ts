import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export const WordPasteHandler = Extension.create({
    name: 'wordPasteHandler',

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('wordPasteHandler'),
                props: {
                    transformPastedHTML(html) {
                        // Word often wraps content in odd spans or adds extra nonsense.
                        // But mostly, we want to ensure basic formatting isn't lost.
                        // Tiptap's default schema handles most, but let's ensure tabs are kept.

                        // Replace Word's tab-char (which might be lost) with actual \t if it exists in HTML as distinct entities
                        // Usually Word sends HTML. We want to preserve spacing.
                        // Chrome handles paste by converting to HTML.
                        // If we see &nbsp; we should keep them or convert to normal spaces if we prefer.

                        // Actually, the main issue with Word is often the "mso-" styles and weird list handling.
                        // StarterKit usually strips styles.

                        // The user specifically mentioned "selecting symbols like newline or tab".
                        // By removing IndentParagraph and using whitespace-pre-wrap, we solved the selection part.

                        // This handler is a placeholder for more advanced regex if needed.
                        // For now returning the HTML as is allows Tiptap's schema to parse it.
                        return html
                    },
                    transformPastedText(text) {
                        // Ensure tabs in plain text paste are preserved
                        return text
                    }
                },
            }),
        ]
    },
})
