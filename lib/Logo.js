export default function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hexagon - flat left/right, pointy top/bottom */}
      <path
        d="M20 2L33 9.5V24.5L20 32L7 24.5V9.5L20 2Z"
        fill="#2B44CC"
      />
      {/* 4-pointed sparkle star */}
      <path
        d="M20 9 L21.4 18.6 L30 20 L21.4 21.4 L20 31 L18.6 21.4 L10 20 L18.6 18.6 Z"
        fill="white"
      />
    </svg>
  )
}
