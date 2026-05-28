import { motion, AnimatePresence } from 'framer-motion'
import PokerCard from './PokerCard.jsx'
import { HAND_TYPE_LABEL, PERSONALITY_LABEL } from '../../game/constants.js'

export default function PlayerSeat({
  player,
  isCurrent,
  isHumanView, // 是否是底部主玩家视角
  showCards, // 摊牌时强制展示
  positionClass,
}) {
  const reveal =
    showCards || (player.isHuman && player.hasSeenHand) || (showCards && !player.isFolded)

  return (
    <motion.div
      layout
      className={`absolute flex flex-col items-center ${positionClass}`}
      animate={{ opacity: player.isFolded && !showCards ? 0.4 : 1 }}
    >
      {/* 玩家上方手牌 */}
      <div className="mb-2 flex items-end gap-1">
        {player.hand.length > 0 ? (
          player.hand.map((card, i) => (
            <PokerCard
              key={card.id}
              card={card}
              faceDown={!reveal}
              size={isHumanView ? 'lg' : 'sm'}
              delay={i * 0.08}
            />
          ))
        ) : (
          <div className="h-16 w-12" />
        )}
      </div>

      {/* 玩家信息卡 */}
      <motion.div
        layout
        className={`relative flex items-center gap-3 rounded-2xl border bg-white/70 px-3 py-2 backdrop-blur-xl shadow-glass ${
          isCurrent && !player.isFolded
            ? 'border-royal/60 ring-2 ring-royal/30'
            : 'border-white/60'
        }`}
      >
        {isCurrent && !player.isFolded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-1 -z-10 rounded-2xl bg-royal/10 blur-md"
          />
        )}
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-mist-blue via-white to-mist-peach text-2xl">
          {player.avatar}
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-navy">
            {player.name}
            {player.personality && (
              <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-normal text-slate-500">
                {PERSONALITY_LABEL[player.personality]}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-gold-dark">🪙 {player.chips}</span>
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                player.isBlind ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {player.isBlind ? '闷牌' : '看牌'}
            </span>
          </div>
        </div>

        {/* 最后动作飞出气泡 */}
        <AnimatePresence>
          {player.lastAction && (
            <motion.div
              key={player.lastAction + Math.random()}
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6 }}
              className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-navy/90 px-2.5 py-0.5 text-[11px] font-medium text-white shadow"
            >
              {player.lastAction}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* 摊牌时显示牌型 */}
      {showCards && player.eval && !player.isFolded && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 rounded-full bg-amber-100/90 px-2 py-0.5 text-[11px] font-semibold text-amber-700"
        >
          {HAND_TYPE_LABEL[player.eval.type]}
        </motion.div>
      )}
      {player.isFolded && !showCards && (
        <div className="mt-1 rounded-full bg-slate-200/80 px-2 py-0.5 text-[11px] font-medium text-slate-500">
          已弃牌
        </div>
      )}
    </motion.div>
  )
}
