'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Mention from '@tiptap/extension-mention'
import { forwardRef, useImperativeHandle } from 'react'
import { EditorToolbar } from './EditorToolbar'

interface RichTextEditorProps {
  onChange?: (html: string) => void
  error?: string
}

export interface RichTextEditorHandle {
  getHTML: () => string
  isEmpty: () => boolean
}

export const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
  function RichTextEditor({ onChange, error }, ref) {
    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          bulletList: false,
          heading: false,
          codeBlock: false,
          code: false,
          horizontalRule: false,
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: { class: 'text-[var(--color-primary-gold)] underline' },
        }),
        Placeholder.configure({
          placeholder: 'Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!',
        }),
        Mention.configure({
          HTMLAttributes: { class: 'font-bold text-[var(--color-primary-gold)]' },
          suggestion: {
            items: async ({ query }: { query: string }) => {
              if (!query.trim()) return []
              try {
                const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
                const data = await res.json() as { data: Array<{ id: string; name: string }> }
                return (data.data ?? []).slice(0, 10)
              } catch {
                return []
              }
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Tiptap suggestion render types are complex
            render: () => {
              let element: HTMLDivElement | null = null
              let currentItems: Array<{ id: string; name: string }> = []
              let selectedIndex = 0
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              let commandFn: ((item: any) => void) | null = null

              const renderDropdown = () => {
                if (!element) return
                element.innerHTML = currentItems.map((item, index) =>
                  `<button type="button" data-index="${index}" class="w-full px-3 py-2 text-left text-sm hover:bg-[rgba(255,234,158,0.10)] ${index === selectedIndex ? 'bg-[rgba(255,234,158,0.10)]' : ''}" style="font-family: var(--font-sans)">${item.name}</button>`
                ).join('')

                element.querySelectorAll('button').forEach((btn) => {
                  btn.addEventListener('click', () => {
                    const idx = parseInt(btn.dataset.index ?? '0')
                    commandFn?.({ id: currentItems[idx].name })
                  })
                })
              }

              return {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onStart: (props: any) => {
                  element = document.createElement('div')
                  element.className = 'absolute z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border border-[var(--color-border-gold)] bg-white shadow-lg'
                  element.style.minWidth = '200px'
                  currentItems = props.items
                  commandFn = props.command
                  renderDropdown()

                  const rect = props.clientRect?.()
                  if (rect) {
                    element.style.position = 'fixed'
                    element.style.left = `${rect.left}px`
                    element.style.top = `${rect.bottom + 4}px`
                  }
                  document.body.appendChild(element)
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onUpdate: (props: any) => {
                  currentItems = props.items
                  commandFn = props.command
                  selectedIndex = 0
                  renderDropdown()
                },
                onKeyDown: (props: { event: KeyboardEvent }) => {
                  if (props.event.key === 'ArrowDown') {
                    selectedIndex = Math.min(selectedIndex + 1, currentItems.length - 1)
                    renderDropdown()
                    return true
                  }
                  if (props.event.key === 'ArrowUp') {
                    selectedIndex = Math.max(selectedIndex - 1, 0)
                    renderDropdown()
                    return true
                  }
                  if (props.event.key === 'Enter') {
                    commandFn?.({ id: currentItems[selectedIndex]?.name })
                    return true
                  }
                  return false
                },
                onExit: () => {
                  element?.remove()
                  element = null
                },
              }
            },
          },
        }),
      ],
      editorProps: {
        attributes: {
          class: 'w-full min-h-[200px] p-4 px-6 bg-white border border-[var(--color-border-gold)] border-t-0 rounded-b-lg outline-none text-base font-bold text-[#00101A] prose prose-sm max-w-none',
          style: 'font-family: var(--font-sans); letter-spacing: 0.15px',
        },
      },
      onUpdate: ({ editor: updatedEditor }) => {
        onChange?.(updatedEditor.getHTML())
      },
    })

    useImperativeHandle(ref, () => ({
      getHTML: () => editor?.getHTML() ?? '',
      isEmpty: () => editor?.isEmpty ?? true,
    }))

    const borderClass = error ? 'ring-1 ring-[var(--color-required-red)]' : ''

    return (
      <div>
        <div className={borderClass}>
          <EditorToolbar editor={editor} />
          <EditorContent editor={editor} />
        </div>

        {/* Hint text */}
        <p
          className="mt-4 text-center text-base font-bold text-[#00101A]"
          style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.5px' }}
        >
          Bạn có thể &ldquo;@ + tên&rdquo; để nhắc tới đồng nghiệp khác
        </p>

        {error && <p className="mt-1 text-sm text-[var(--color-required-red)]">{error}</p>}
      </div>
    )
  }
)
