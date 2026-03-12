import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/homepage/HeroSection'
import { AwardsSection } from '@/components/homepage/AwardsSection'
import { RootFurtherSection } from '@/components/homepage/RootFurtherSection'
import { KudosSection } from '@/components/homepage/KudosSection'
import { WidgetButton } from '@/components/layout/WidgetButton'

export const metadata: Metadata = {
  title: 'Sun Annual Awards 2025',
  description:
    'Sun* Annual Awards 2025 — Root Further. Lễ trao giải thường niên vinh danh những cá nhân và tập thể xuất sắc tại Sun*.',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#00101A]">
      <Header />
      <main>
        <HeroSection />
        <AwardsSection />
        <RootFurtherSection />
        <KudosSection />
      </main>
      <Footer />
      <WidgetButton />
    </div>
  )
}
