'use client'

import { Icon } from '@/components/ui/Icon'

interface FormActionsProps {
  isDisabled: boolean
  isLoading: boolean
  onCancel: () => void
}

export function FormActions({ isDisabled, isLoading, onCancel }: FormActionsProps) {
  return (
    <div className="flex gap-6">
      {/* Cancel */}
      <button
        type="button"
        onClick={onCancel}
        className="px-10 py-4 rounded border border-[var(--color-border-gold)] bg-[var(--color-secondary-btn)] text-base font-bold text-[#00101A] transition-colors duration-150 hover:bg-[var(--color-secondary-btn-hover)] flex items-center gap-2"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        Hủy
        <Icon name="close-x" size={16} className="text-[#00101A]" />
      </button>

      {/* Submit */}
      <button
        type="submit"
        disabled={isDisabled || isLoading}
        className="flex-1 h-[60px] rounded-lg bg-[var(--color-primary-gold)] text-[22px] font-bold text-[#00101A] transition-colors duration-150 hover:bg-[var(--color-gold-hover)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        {isLoading ? (
          <span className="inline-block w-6 h-6 border-2 border-[#00101A] border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            Gửi
            <Icon name="send" size={24} className="text-[#00101A]" />
          </>
        )}
      </button>
    </div>
  )
}
