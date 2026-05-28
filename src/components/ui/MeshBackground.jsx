export default function MeshBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white"
    >
      {/* 三色柔光斑 */}
      <div className="absolute -top-40 -left-40 h-[640px] w-[640px] rounded-full bg-mist-blue blur-3xl opacity-80" />
      <div className="absolute top-1/3 -right-32 h-[560px] w-[560px] rounded-full bg-mist-peach blur-3xl opacity-80" />
      <div className="absolute -bottom-40 left-1/4 h-[640px] w-[640px] rounded-full bg-mist-mint blur-3xl opacity-80" />
      <div className="absolute top-1/2 left-1/3 h-[420px] w-[420px] rounded-full bg-indigo-100 blur-3xl opacity-60" />

      {/* 细微噪点提升质感 */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.035] mix-blend-multiply">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  )
}
