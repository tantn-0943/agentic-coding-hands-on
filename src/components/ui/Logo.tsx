import Image from 'next/image'

export default function Logo() {
  return (
    <Image
      src="/images/saa-logo.png"
      alt="Sun Annual Awards 2025"
      width={52}
      height={56}
      priority
    />
  )
}
