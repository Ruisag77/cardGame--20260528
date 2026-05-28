import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PrimaryButton from '../ui/PrimaryButton.jsx'
import { GAME_CONFIG } from '../../game/constants.js'
import { helpers } from '../../store/gameStore.js'

export default function BettingPanel({
  me,
  currentBet,
  opponents, // 可比牌的对手 [{id, name, avatar}]
  onAction,
  disabled,
}) {
  const [raiseMenu, setRaiseMenu] = useState(false)
  const [compareMenu, setCompareMenu] = useState(false)

  if (!me) return null

  const callAmt = helpers.callCost(me, currentBet)
  const compareAmt = helpers.compareCost(me, currentBet)
  const canCompare = opponents.length >= 1 && me.chips >= compareAmt
  const canCall = me.chips >= callAmt
  const canSee = me.isBlind

  return (
    <div className="pointer-events-auto relative flex flex-col items-center gap-3">
      {/* 二级菜单：加注档位 */}
      <AnimatePresence>
        {raiseMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-3 flex gap-2 rounded-2xl border border-white/60 bg-white/85 p-2 shadow-glass-lg backdrop-blur-xl"
          >
            {GAME_CONFIG.raiseMultipliers.map((mult) => {
              const newBet = currentBet * mult
              const cost = me.isBlind ? newBet : newBet * 2
              const ok = me.chips >= cost
              return (
                <PrimaryButton
                  key={mult}
                  size="sm"
                  variant="gold"
                  disabled={!ok}
                  onClick={() => {
                    setRaiseMenu(false)
                    onAction('raise', { multiplier: mult })
                  }}
                >
                  加注 {mult}× · 花费 {cost}
                </PrimaryButton>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 二级菜单：比牌目标 */}
      <AnimatePresence>
        {compareMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-3 flex gap-2 rounded-2xl border border-white/60 bg-white/85 p-2 shadow-glass-lg backdrop-blur-xl"
          >
            <div className="self-center pl-1 text-xs text-slate-500">
              选择对手 · 花费 {compareAmt}：
            </div>
            {opponents.map((op) => (
              <button
                key={op.id}
                onClick={() => {
                  setCompareMenu(false)
                  onAction('compare', { targetId: op.id })
                }}
                className="flex items-center gap-2 rounded-full bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
              >
                <span className="text-lg">{op.avatar}</span>
                {op.name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-2">
        <PrimaryButton
          variant="ghost"
          size="md"
          disabled={disabled || !canSee}
          onClick={() => onAction('see')}
        >
          👁 看牌
        </PrimaryButton>
        <PrimaryButton
          variant="ghost"
          size="md"
          disabled={disabled}
          onClick={() => onAction('fold')}
        >
          ✋ 弃牌
        </PrimaryButton>
        <PrimaryButton
          variant="primary"
          size="md"
          disabled={disabled || !canCall}
          onClick={() => onAction('call')}
        >
          ✓ 跟注 {callAmt}
        </PrimaryButton>
        <PrimaryButton
          variant="gold"
          size="md"
          disabled={disabled}
          onClick={() => {
            setCompareMenu(false)
            setRaiseMenu((v) => !v)
          }}
        >
          ⬆ 加注
        </PrimaryButton>
        <PrimaryButton
          variant="danger"
          size="md"
          disabled={disabled || !canCompare}
          onClick={() => {
            setRaiseMenu(false)
            setCompareMenu((v) => !v)
          }}
        >
          ⚔ 比牌
        </PrimaryButton>
      </div>
      <div className="text-xs text-slate-500">
        {me.isBlind ? '闷牌跟注价 = 当前注码' : '看牌跟注价 = 当前注码 × 2'}
      </div>
    </div>
  )
}
