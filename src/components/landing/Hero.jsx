import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PrimaryButton from '../ui/PrimaryButton.jsx'

// 三张悬浮的玻璃扑克牌（CSS 3D）
function FloatingCard({ rank, suit, color, rotate, delay, offsetX, offsetY, scale = 1 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: rotate - 10 }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ delay, duration: 0.9, type: 'spring', stiffness: 80 }}
      whileHover={{ rotate: rotate + (rotate > 0 ? -4 : 4), y: -10 }}
      style={{
        transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg) scale(${scale})`,
      }}
      className="absolute"
    >
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5 + delay, repeat: Infinity, ease: 'easeInOut' }}
        className="relative h-56 w-40 rounded-3xl border border-white/70 bg-white/65 p-4 shadow-glass-lg backdrop-blur-xl"
        style={{
          boxShadow:
            '0 30px 60px rgba(31,38,135,0.18), inset 0 1px 0 rgba(255,255,255,0.9)',
        }}
      >
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/70 via-transparent to-transparent" />
        <div className={`flex flex-col items-start ${color}`}>
          <span className="font-serif text-3xl font-bold leading-none">{rank}</span>
          <span className="text-xl">{suit}</span>
        </div>
        <div className={`mt-6 flex items-center justify-center text-6xl ${color}`}>
          {suit}
        </div>
        <div className={`absolute bottom-4 right-4 flex rotate-180 flex-col items-start ${color}`}>
          <span className="font-serif text-3xl font-bold leading-none">{rank}</span>
          <span className="text-xl">{suit}</span>
        </div>
      </motion.div>
      {/* 投影 */}
      <div
        className="absolute left-1/2 top-full mt-4 h-3 w-32 -translate-x-1/2 rounded-full bg-navy/20 blur-xl"
      />
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 pb-24 pt-16 sm:px-10 lg:flex-row lg:gap-8 lg:pb-32 lg:pt-24">
      {/* 左侧文案 */}
      <div className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur-xl"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          v0.1 已上线 · 单机畅玩
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="mt-5 font-serif text-5xl font-bold leading-[1.05] tracking-tight text-navy sm:text-6xl lg:text-7xl"
        >
          一手好牌，
          <br />
          <span className="text-gradient-royal">从容亮出。</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600"
        >
          CLEAR_CARD 是一个磨砂玻璃质感的炸金花单机平台。
          挑战拥有不同性格的 AI 对手，在闷牌、跟注、加注、比牌之间博弈心理。
          无需登录，零真金，纯粹的牌局乐趣。
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Link to="/lobby">
            <PrimaryButton size="lg">立即开局 →</PrimaryButton>
          </Link>
          <a href="#rules">
            <PrimaryButton variant="ghost" size="lg">
              玩法说明
            </PrimaryButton>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex items-center gap-6 text-xs text-slate-500"
        >
          <div>
            <div className="text-xl font-bold text-navy">3</div>
            种 AI 人格
          </div>
          <div className="h-8 w-px bg-slate-300/60" />
          <div>
            <div className="text-xl font-bold text-navy">4</div>
            个房间档位
          </div>
          <div className="h-8 w-px bg-slate-300/60" />
          <div>
            <div className="text-xl font-bold text-navy">0</div>
            元 · 真金不参与
          </div>
        </motion.div>
      </div>

      {/* 右侧浮动扑克牌 */}
      <div className="relative h-[420px] w-full flex-1 lg:h-[520px]">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative h-[420px] w-[420px]">
            <FloatingCard rank="A" suit="♠" color="text-navy" rotate={-14} delay={0.2} offsetX={-130} offsetY={20} />
            <FloatingCard rank="A" suit="♥" color="text-rose-500" rotate={0} delay={0.4} offsetX={0} offsetY={-30} scale={1.05} />
            <FloatingCard rank="A" suit="♦" color="text-rose-500" rotate={14} delay={0.6} offsetX={130} offsetY={20} />
            {/* 底部光晕 */}
            <div className="absolute bottom-0 left-1/2 h-20 w-72 -translate-x-1/2 rounded-full bg-royal/20 blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
