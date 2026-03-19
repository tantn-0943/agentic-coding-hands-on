'use client'

interface CategoryFieldProps {
  value: string
  error?: string
  onChange: (value: string) => void
}

export function CategoryField({ value, error, onChange }: CategoryFieldProps) {
  const borderClass = error
    ? 'border-[var(--color-required-red)]'
    : 'border-[var(--color-border-gold)] focus-within:border-[var(--color-primary-gold)] focus-within:border-2'

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-4 max-md:flex-col max-md:items-start">
        {/* Label */}
        <label className="shrink-0 text-[22px] font-bold text-[#00101A] leading-[28px]" style={{ fontFamily: 'var(--font-sans)' }}>
          Danh hiệu
          <span className="ml-0.5 text-base font-bold text-[var(--color-required-red)]" style={{ fontFamily: "'Noto Sans JP'" }}>*</span>
        </label>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Dành tặng một danh hiệu cho đồng đội"
          className={`flex-1 max-md:w-full h-14 px-6 rounded-lg border ${borderClass} bg-white text-base font-bold text-[#00101A] placeholder:text-[var(--color-text-muted)] outline-none`}
          style={{ fontFamily: 'var(--font-sans)', letterSpacing: '0.15px' }}
          maxLength={100}
        />
      </div>

      {/* Description hint */}
      <p
        className="text-base font-bold text-[var(--color-text-muted)] max-md:mt-1 md:ml-[calc(theme(spacing.4)+max-content)]"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        Ví dụ: Người truyền động lực cho tôi. Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn.
      </p>

      {error && <p className="mt-1 text-sm text-[var(--color-required-red)]">{error}</p>}
    </div>
  )
}
