type Props = {
	digit: string
}

export function DigitCard({ digit }: Props) {
	return (
		<div className="relative w-[48px] h-[76px] md:w-[62px] md:h-[100px] lg:w-[77px] lg:h-[123px] rounded-xl overflow-hidden">
			<div
				aria-hidden="true"
				className="absolute inset-0 rounded-xl opacity-50 backdrop-blur-[24.96px]"
				style={{
					background: 'var(--gradient-digit-card)',
					border: '0.75px solid var(--color-accent)',
				}}
			/>
			<span className="relative z-10 flex items-center justify-center w-full h-full font-[family-name:var(--font-digital)] font-normal text-[46px] md:text-[60px] lg:text-[74px] text-white leading-none select-none">
				{digit}
			</span>
		</div>
	)
}
