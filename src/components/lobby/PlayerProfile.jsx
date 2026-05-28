import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '../ui/GlassCard.jsx'
import PrimaryButton from '../ui/PrimaryButton.jsx'
import { useGameStore } from '../../store/gameStore.js'

export default function PlayerProfile() {
  const { humanName, humanChips, totalGames, totalWins, claimDaily, setHumanName } =
    useGameStore()
  const [toast, setToast] = useState(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(humanName)

  const winRate = totalGames > 0 ? Math.round((totalWins / totalGames) * 100) : 0

  const handleClaim = () => {
    const ok = claimDaily()
    setToast(ok ? '+1000 金币已到账' : '今天已经领过啦')
    setTimeout(() => setToast(null), 2200)
  }

  const saveName = () => {
    const v = draft.trim().slice(0, 12)
    if (v) setHumanName(v)
    setEditing(false)
  }

  return (
    <GlassCard className="relative flex items-center gap-6 overflow-hidden p-6">
      <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-mist-blue opacity-60 blur-2xl" />
      <div className="absolute -right-8 bottom-0 h-24 w-24 rounded-full bg-mist-peach opacity-60 blur-2xl" />

      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-mist-blue via-white to-mist-peach text-4xl shadow-inner">
        🧑
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          {editing ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => e.key === 'Enter' && saveName()}
              className="rounded-lg border border-white/60 bg-white/80 px-2 py-1 font-serif text-2xl font-bold text-navy outline-none focus:border-royal"
            />
          ) : (
            <>
              <h2 className="font-serif text-2xl font-bold text-navy">{humanName}</h2>
              <button
                onClick={() => {
                  setDraft(humanName)
                  setEditing(true)
                }}
                className="text-xs text-slate-400 transition hover:text-royal"
              >
                ✎ 改名
              </button>
            </>
          )}
        </div>

        <div className="mt-2 flex items-center gap-4 text-sm">
          <div>
            <span className="text-slate-500">金币 </span>
            <span className="text-gold-shimmer text-lg font-bold">🪙 {humanChips}</span>
          </div>
          <div className="text-slate-500">
            场次 <span className="font-semibold text-navy">{totalGames}</span>
          </div>
          <div className="text-slate-500">
            胜率{' '}
            <span className="font-semibold text-emerald-600">{winRate}%</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <PrimaryButton variant="gold" size="md" onClick={handleClaim}>
          🎁 每日签到 +1000
        </PrimaryButton>
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-navy/90 px-3 py-1 text-xs text-white"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  )
}
