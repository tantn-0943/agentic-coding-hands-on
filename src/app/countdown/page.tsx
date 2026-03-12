import type { Metadata } from 'next'
import Image from 'next/image'
import { CountdownTimer } from '@/components/countdown/CountdownTimer'

export const metadata: Metadata = {
	title: 'SAA 2025 — Sắp ra mắt',
	description: 'Sun Annual Awards 2025 - Sự kiện sẽ bắt đầu sau',
}

export default function CountdownPage() {
	const eventDateStr = process.env.NEXT_PUBLIC_EVENT_START_DATE

	return (
		<main className="relative min-h-screen bg-[#00101A] overflow-hidden">
			<Image
				src="/images/login-bg.jpg"
				alt=""
				aria-hidden={true}
				fill
				sizes="100vw"
				className="object-cover z-0"
				priority
			/>
			<div
				aria-hidden={true}
				className="absolute inset-0 z-[1] pointer-events-none"
				style={{ background: 'var(--gradient-overlay-countdown)' }}
			/>
			<section className="relative z-[2] flex flex-col items-center justify-center min-h-screen py-12 px-4 md:px-12 lg:py-24 lg:px-36 gap-6">
				<h1 className="font-[family-name:var(--font-montserrat)] font-bold text-[22px] md:text-[28px] lg:text-[36px] leading-[48px] text-white text-center">
					Sự kiện sẽ bắt đầu sau
				</h1>
				<CountdownTimer eventDateStr={eventDateStr} />
			</section>
		</main>
	)
}
