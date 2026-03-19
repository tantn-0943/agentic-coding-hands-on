'use client'

interface AnonymousToggleProps {
  isChecked: boolean
  name: string
  onToggle: (checked: boolean) => void
  onNameChange: (name: string) => void
}

export function AnonymousToggle({ isChecked, name, onToggle, onNameChange }: AnonymousToggleProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Checkbox row */}
      <label className="flex items-center gap-4 cursor-pointer">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => onToggle(e.target.checked)}
          className="sr-only peer"
        />
        {/* Custom checkbox */}
        <span className="w-6 h-6 shrink-0 rounded border border-[var(--color-text-muted)] bg-white flex items-center justify-center peer-checked:bg-[var(--color-primary-gold)] peer-checked:border-[var(--color-primary-gold)] transition-colors">
          {isChecked && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00101A" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          )}
        </span>
        <span
          className="text-[22px] font-bold text-[var(--color-text-muted)] leading-[28px]"
          style={{ fontFamily: 'var(--font-sans)' }}
        >
          Gửi lời cám ơn và ghi nhận ẩn danh
        </span>
      </label>

      {/* Anonymous name field (conditional) */}
      {isChecked && (
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Nhập tên ẩn danh"
          maxLength={50}
          className="h-14 px-6 rounded-lg border border-[var(--color-border-gold)] bg-white text-base font-bold text-[#00101A] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-primary-gold)] focus:border-2"
          style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.15px' }}
        />
      )}
    </div>
  )
}
