import { motion, AnimatePresence } from 'framer-motion'
import PokerCard from './PokerCard.jsx'
import PrimaryButton from '../ui/PrimaryButton.jsx'
import { HAND_TYPE_LABEL } from '../../game/constants.js'

export default function ResultModal({ open, players, winnerId, amount, onAgain, onLeave }) {
  if (!open) return null
  const winner = players.find((p) => p.id === winnerId)
  if (!winner) return null
  const humanWon = winnerId === 'human'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="relative w-full max-w-3xl rounded-3xl border border-white/60 bg-white/85 px-8 py-8 shadow-glass-lg backdrop-blur-2xl"
          >
            <div className="text-center">
              <div className="text-sm uppercase tracking-[0.35em] text-slate-500">
                {humanWon ? 'Victory · 胜利' : 'Round Result · 本局结果'}
              </div>
              <div className="mt-2 font-serif text-4xl font-bold text-navy">
                {humanWon ? '🎉 你赢了！' : `${winner.name} 赢得本局`}
              </div>
              <div className="mt-1 text-base text-slate-600">
                赢得 <span className="text-gold-shimmer font-bold">🪙 {amount}</span> 金币
              </div>
            </div>

            <div className="my-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {players.map((p) => (
                <div
                  key={p.id}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-3 ${
                    p.id === winnerId
                      ? 'border-amber-300 bg-amber-50/80'
                      : p.isFolded
                      ? 'border-slate-200 bg-slate-50/60 opacity-60'
                      : 'border-white/60 bg-white/60'
                  }`}
                >
                  <div className="text-2xl">{p.avatar}</div>
                  <div className="text-sm font-semibold text-navy">{p.name}</div>
                  <div className="flex gap-1">
                    {p.hand.map((c) => (
                      <PokerCard key={c.id} card={c} faceDown={p.isFolded && p.id !== winnerId && !p.hasSeenHand} size="sm" />
                    ))}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-500">
                    {p.eval ? HAND_TYPE_LABEL[p.eval.type] : '-'}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-3">
              <PrimaryButton variant="ghost" onClick={onLeave}>
                返回大厅
              </PrimaryButton>
              <PrimaryButton variant="primary" onClick={onAgain}>
                再来一局 →
              </PrimaryButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
