import Image from 'next/image'
import Link from 'next/link'

export function KudosSection() {
  return (
    <section className="py-8 px-4 md:px-10 lg:px-36 bg-[#00101A]" aria-label="Sun* Kudos">
      <div className="max-w-[1224px] mx-auto min-h-[500px] bg-[#0F0F0F] rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-10 px-8 md:px-[52px] min-h-[500px]">
          {/* Left: content */}
          <div className="flex flex-col gap-4 flex-1">
            <p className="font-[family-name:var(--font-montserrat)] font-bold text-[24px] text-white">
              Phong trào ghi nhận
            </p>
            <h2 className="font-[family-name:var(--font-montserrat)] font-bold text-[32px] md:text-[42px] lg:text-[57px] leading-tight lg:leading-[64px] text-[#FFEA9E]">
              Sun* Kudos
            </h2>
            <div className="font-[family-name:var(--font-montserrat)] font-bold text-base text-white tracking-[0.5px] space-y-2 max-w-sm">
              <p className="uppercase text-sm tracking-wider">Điểm mới của SAA 2025</p>
              <p>
                Hoạt động ghi nhận và cảm ơn đồng nghiệp - lần đầu tiên được diễn ra dành cho tất cả
                Sunner. Hoạt động sẽ được triển khai vào tháng 11/2025, khuyến khích người Sun* chia sẻ
                những lời ghi nhận, cảm ơn đồng nghiệp trên hệ thống do BTC công bố. Đây sẽ là chất liệu
                để Hội đồng Heads tham khảo trong quá trình lựa chọn người đạt giải.
              </p>
            </div>
            <Link
              href="/sun-kudos"
              className="inline-flex items-center gap-2 justify-center w-[127px] h-14 bg-[#FFEA9E] text-[#00101A] font-[family-name:var(--font-montserrat)] font-bold text-base rounded hover:opacity-90 active:opacity-80 transition-opacity duration-150 focus-visible:outline-2 focus-visible:outline-[#FFEA9E] focus-visible:outline-offset-2"
            >
              Chi tiết ↗
            </Link>
          </div>

          {/* Right: Kudos logo image */}
          <div className="flex-shrink-0 flex items-center justify-center w-full md:w-auto md:max-w-[400px]">
            <Image
              src="/icons/kudos-logo.svg"
              alt="Sun* Kudos"
              width={300}
              height={180}
              className="w-full max-w-[280px] md:max-w-[340px] lg:max-w-[400px] object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
