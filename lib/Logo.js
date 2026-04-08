import Image from 'next/image'

export default function Logo({ size = 32 }) {
  return (
    <Image
      src="/images/jp-logo.png"
      alt="JapaLearn AI Logo"
      width={size}
      height={size}
      className="rounded-full object-contain"
      priority
    />
  )
}
