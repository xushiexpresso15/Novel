import { Paragraph } from '@tiptap/extension-paragraph'

export const IndentParagraph = Paragraph.extend({
    addAttributes() {
        return {
            indent: {
                default: true,
                parseHTML: (element) => element.style.textIndent === '2em',
                renderHTML: (attributes) => {
                    if (attributes.indent) {
                        return {
                            style: 'text-indent: 2em; margin-bottom: 0.5em;',
                        }
                    }
                    return {}
                },
            },
        }
    },
})
