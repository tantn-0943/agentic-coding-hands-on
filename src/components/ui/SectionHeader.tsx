interface SectionHeaderProps {
  subtitle: string
  title: string
  children?: React.ReactNode
}

export function SectionHeader({ subtitle, title, children }: SectionHeaderProps) {
  return (
    <div className="border-t border-[var(--color-divider)] pt-10">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <span
            className="font-[var(--font-svn-gotham)] text-sm font-medium text-[var(--color-primary-gold)]"
            style={{ fontFamily: 'var(--font-svn-gotham), var(--font-montserrat), sans-serif' }}
          >
            {subtitle}
          </span>
          <h2
            className="text-4xl font-bold text-white"
            style={{
              fontFamily: 'var(--font-svn-gotham), var(--font-montserrat), sans-serif',
              textShadow: 'var(--text-shadow-gold-glow)',
            }}
          >
            {title}
          </h2>
        </div>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </div>
  )
}
