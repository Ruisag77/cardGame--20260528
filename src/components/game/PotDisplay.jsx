import { motion } from 'framer-motion'

export default function PotDisplay({ pot, currentBet, round, maxRound }) {
  return (
    <motion.div
      layout
      className="pointer-events-none flex flex-col items-center"
    >
      <div className="text-xs uppercase tracking-[0.3em] text-slate-500">Pot · 彩池</div>
      <motion.div
        key={pot}
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="text-gold-shimmer font-serif text-5xl font-bold leading-tight"
      >
        🪙 {pot}
      </motion.div>
      <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
        <span>当前注码 · <span className="font-semibold text-navy">{currentBet}</span></span>
        <span className="h-1 w-1 rounded-full bg-slate-300" />
        <span>
          第 <span className="font-semibold text-navy">{round}</span> / {maxRound} 轮
        </span>
      </div>
    </motion.div>
  )
}
