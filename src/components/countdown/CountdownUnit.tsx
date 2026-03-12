import { DigitCard } from '@/components/countdown/DigitCard'
import type { TimeUnit } from '@/types/countdown'

type Props = {
	value: number
	label: TimeUnit
	'aria-label': string
}

export function CountdownUnit({ value, label, 'aria-label': ariaLabel }: Props) {
	const tens = Math.floor(value / 10)
	const units = value % 10
	return (
		<div
			role="group"
			aria-label={ariaLabel}
			className="flex flex-col gap-[21px] items-start lg:w-[175px]"
		>
			<div className="flex flex-row gap-[21px] items-center">
				<DigitCard digit={String(tens)} />
				<DigitCard digit={String(units)} />
			</div>
			<span className="font-[family-name:var(--font-montserrat)] font-bold text-base md:text-[24px] lg:text-[36px] leading-[48px] text-white">
				{label}
			</span>
		</div>
	)
}
