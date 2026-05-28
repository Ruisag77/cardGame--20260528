import { motion } from 'framer-motion'
import GlassCard from '../ui/GlassCard.jsx'
import PrimaryButton from '../ui/PrimaryButton.jsx'

export default function RoomCard({ room, onEnter, disabled }) {
  return (
    <GlassCard
      interactive
      className="flex flex-col gap-4 overflow-hidden p-6"
    >
      {/* 顶部装饰 */}
      <div
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-60 blur-2xl"
        style={{ background: room.accent }}
      />
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
            {room.tag}
          </div>
          <div className="mt-1 font-serif text-2xl font-bold text-navy">
            {room.name}
          </div>
        </div>
        <div className="text-4xl">{room.icon}</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="底注" value={`🪙 ${room.ante}`} highlight />
        <Stat label="最低准入" value={`🪙 ${room.minBuy}`} />
        <Stat label="AI 对手" value={`${room.aiCount} 人`} />
        <Stat label="在线" value={`${room.online} 桌`} />
      </div>

      <p className="text-sm leading-relaxed text-slate-600">{room.desc}</p>

      <PrimaryButton
        variant={room.featured ? 'primary' : 'ghost'}
        size="md"
        disabled={disabled}
        onClick={onEnter}
      >
        {disabled ? '金币不足' : '进入房间 →'}
      </PrimaryButton>
    </GlassCard>
  )
}

function Stat({ label, value, highlight }) {
  return (
    <div className="rounded-2xl bg-white/55 px-3 py-2 backdrop-blur-md">
      <div className="text-[11px] uppercase tracking-wider text-slate-500">{label}</div>
      <div
        className={`mt-0.5 text-base font-semibold ${
          highlight ? 'text-gold-dark' : 'text-navy'
        }`}
      >
        {value}
      </div>
    </div>
  )
}
