import { motion } from 'framer-motion'
import { RANK_LABEL, SUIT_SYMBOL, SUIT_COLOR } from '../../game/constants.js'

export default function PokerCard({
  card,
  faceDown = false,
  size = 'md',
  highlight = false,
  delay = 0,
  className = '',
}) {
  const sizes = {
    sm: 'w-12 h-16 text-sm',
    md: 'w-16 h-24 text-lg',
    lg: 'w-24 h-36 text-2xl',
    xl: 'w-28 h-40 text-3xl',
  }
  const dim = sizes[size]

  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0, rotateY: 180 }}
      animate={{
        scale: 1,
        opacity: 1,
        rotateY: faceDown ? 180 : 0,
      }}
      transition={{ delay, type: 'spring', stiffness: 240, damping: 20 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      className={`relative ${dim} ${className}`}
    >
      {/* 牌面 */}
      <div
        className={`absolute inset-0 flex flex-col justify-between rounded-2xl border bg-white/95 p-1.5 shadow-glass backdrop-blur-sm transition-shadow ${
          highlight ? 'ring-2 ring-amber-400 shadow-glass-lg' : 'border-white/80'
        }`}
        style={{ backfaceVisibility: 'hidden' }}
      >
        {card && (
          <>
            <div className={`flex flex-col items-start leading-none ${SUIT_COLOR[card.suit]}`}>
              <span className="font-serif font-bold">{RANK_LABEL[card.rank]}</span>
              <span className="text-base">{SUIT_SYMBOL[card.suit]}</span>
            </div>
            <div
              className={`flex items-center justify-center text-3xl ${SUIT_COLOR[card.suit]}`}
            >
              {SUIT_SYMBOL[card.suit]}
            </div>
            <div
              className={`flex rotate-180 flex-col items-start leading-none ${SUIT_COLOR[card.suit]}`}
            >
              <span className="font-serif font-bold">{RANK_LABEL[card.rank]}</span>
              <span className="text-base">{SUIT_SYMBOL[card.suit]}</span>
            </div>
          </>
        )}
      </div>

      {/* 牌背 */}
      <div
        className="absolute inset-0 overflow-hidden rounded-2xl border border-white/40 shadow-glass"
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background:
            'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #5b21b6 100%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(255,255,255,0.2) 0 2px, transparent 2px 8px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.2) 0 2px, transparent 2px 8px)',
          }}
        />
        <div className="absolute inset-2 rounded-xl border border-white/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-serif text-2xl text-white/90">♠</div>
        </div>
      </div>
    </motion.div>
  )
}
