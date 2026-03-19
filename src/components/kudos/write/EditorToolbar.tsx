'use client'

import type { Editor } from '@tiptap/react'
import { Icon, type IconName } from '@/components/ui/Icon'
import { useCallback } from 'react'

interface EditorToolbarProps {
  editor: Editor | null
}

interface ToolbarButton {
  icon: IconName
  label: string
  action: (editor: Editor) => void
  isActive: (editor: Editor) => boolean
}

const TOOLBAR_BUTTONS: ToolbarButton[] = [
  {
    icon: 'bold',
    label: 'Bold',
    action: (e) => e.chain().focus().toggleBold().run(),
    isActive: (e) => e.isActive('bold'),
  },
  {
    icon: 'italic',
    label: 'Italic',
    action: (e) => e.chain().focus().toggleItalic().run(),
    isActive: (e) => e.isActive('italic'),
  },
  {
    icon: 'strikethrough',
    label: 'Strikethrough',
    action: (e) => e.chain().focus().toggleStrike().run(),
    isActive: (e) => e.isActive('strike'),
  },
  {
    icon: 'ordered-list',
    label: 'Ordered List',
    action: (e) => e.chain().focus().toggleOrderedList().run(),
    isActive: (e) => e.isActive('orderedList'),
  },
  {
    icon: 'link',
    label: 'Link',
    action: (e) => {
      const url = window.prompt('Enter URL:')
      if (url) {
        e.chain().focus().setLink({ href: url }).run()
      }
    },
    isActive: (e) => e.isActive('link'),
  },
  {
    icon: 'quote',
    label: 'Quote',
    action: (e) => e.chain().focus().toggleBlockquote().run(),
    isActive: (e) => e.isActive('blockquote'),
  },
]

export function EditorToolbar({ editor }: EditorToolbarProps) {
  const handleClick = useCallback((btn: ToolbarButton) => {
    if (editor) btn.action(editor)
  }, [editor])

  return (
    <div className="flex h-10 items-stretch border border-[var(--color-border-gold)] rounded-t-lg overflow-hidden">
      {/* Format buttons */}
      {TOOLBAR_BUTTONS.map((btn) => {
        const active = editor ? btn.isActive(editor) : false
        return (
          <button
            key={btn.icon}
            type="button"
            onClick={() => handleClick(btn)}
            aria-label={btn.label}
            aria-pressed={active}
            className={`px-4 py-2.5 border-r border-[var(--color-border-gold)] transition-colors duration-150 ${
              active
                ? 'bg-[rgba(255,234,158,0.20)]'
                : 'bg-transparent hover:bg-[rgba(255,234,158,0.10)]'
            }`}
          >
            <Icon name={btn.icon} size={20} className="text-[#00101A]" />
          </button>
        )
      })}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Community Standards link */}
      <a
        href="#"
        className="flex items-center px-4 text-base font-bold text-[var(--color-primary-gold)] hover:underline"
        style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.15px' }}
      >
        Tiêu chuẩn cộng đồng
      </a>
    </div>
  )
}
