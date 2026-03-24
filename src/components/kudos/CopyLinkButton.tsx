'use client'

import { Icon } from '@/components/ui/Icon'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useToast } from '@/hooks/useToast'
import { Toast } from '@/components/ui/Toast'

interface CopyLinkButtonProps {
  kudosId: string
  variant?: 'default' | 'highlight'
}

export function CopyLinkButton({ kudosId, variant = 'default' }: CopyLinkButtonProps) {
  const { copy } = useCopyToClipboard()
  const { message, visible, showToast, hideToast } = useToast()

  const handleCopy = async () => {
    const url = `${window.location.origin}/kudos/${kudosId}`
    const success = await copy(url)
    if (success) {
      showToast('Link copied -- ready to share!')
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleCopy}
        className={`flex cursor-pointer items-center gap-1 transition-colors ${
          variant === 'highlight'
            ? 'text-base font-bold text-[#00101A] hover:text-[#00101A]/80'
            : 'text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary-gold)]'
        }`}
        style={{ fontFamily: 'var(--font-gotham)' }}
      >
        Copy Link
        <Icon name="copy" size={16} />
      </button>
      <Toast message={message} visible={visible} onDismiss={hideToast} />
    </>
  )
}
