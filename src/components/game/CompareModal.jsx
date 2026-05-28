import { motion, AnimatePresence } from 'framer-motion'
import PokerCard from './PokerCard.jsx'
import { HAND_TYPE_LABEL } from '../../game/constants.js'

export default function CompareModal({ event, players }) {
  if (!event) return null
  const from = players.find((p) => p.id === event.fromId)
  const to = players.find((p) => p.id === event.toId)
  const loser = players.find((p) => p.id === event.loserId)
  if (!from || !to) return null

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-navy/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            className="relative rounded-3xl border border-white/60 bg-white/85 px-10 py-8 shadow-glass-lg backdrop-blur-2xl"
          >
            <div className="mb-6 text-center font-serif text-2xl font-bold text-navy">
              ⚔ 比牌！
            </div>
            <div className="flex items-center gap-8">
              <PlayerColumn
                player={from}
                won={loser.id !== from.id}
              />
              <div className="text-3xl text-rose-500">VS</div>
              <PlayerColumn
                player={to}
                won={loser.id !== to.id}
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center text-lg font-semibold text-navy"
            >
              {loser.name} 出局
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function PlayerColumn({ player, won }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="text-3xl">{player.avatar}</div>
      <div className="text-sm font-semibold text-navy">{player.name}</div>
      <div className="flex gap-1.5">
        {player.hand.map((c, i) => (
          <PokerCard key={c.id} card={c} size="md" delay={i * 0.12} />
        ))}
      </div>
      <div
        className={`rounded-full px-3 py-1 text-sm font-semibold ${
          won
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-slate-100 text-slate-500'
        }`}
      >
        {HAND_TYPE_LABEL[player.eval.type]} · {won ? '胜' : '负'}
      </div>
    </div>
  )
}
