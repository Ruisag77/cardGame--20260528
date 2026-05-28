import { motion } from 'framer-motion'
import GlassCard from '../ui/GlassCard.jsx'

const FEATURES = [
  {
    icon: '🧠',
    bg: 'from-blue-100 to-blue-200',
    title: '三种性格 AI',
    desc: '稳健、激进、保守的机器人各自决策风格不同，让每一局都不重样。',
  },
  {
    icon: '🃏',
    bg: 'from-purple-100 to-pink-200',
    title: '经典炸金花玩法',
    desc: '闷牌、看牌、跟注、加注、比牌、弃牌，原汁原味的规则系统。',
  },
  {
    icon: '✨',
    bg: 'from-amber-100 to-orange-200',
    title: '流畅微动画',
    desc: '发牌、翻牌、筹码飞入、胜负揭晓，每个细节都用 Framer Motion 打磨。',
  },
  {
    icon: '🌐',
    bg: 'from-emerald-100 to-teal-200',
    title: '离线即可玩',
    desc: '纯前端实现，没有服务器、没有账号、没有广告，刷新即继续。',
  },
]

export default function FeatureGrid() {
  return (
    <section id="features" className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10">
      <div className="mb-14 text-center">
        <div className="text-xs uppercase tracking-[0.4em] text-slate-500">
          Features
        </div>
        <h2 className="mt-2 font-serif text-4xl font-bold text-navy sm:text-5xl">
          为什么选择 <span className="text-gradient-royal">CLEAR_CARD</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
          >
            <GlassCard interactive className="flex h-full flex-col gap-4 p-6">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-3xl shadow-glass ${f.bg}`}
                style={{
                  boxShadow:
                    '0 8px 24px rgba(31,38,135,0.15), inset 0 1px 0 rgba(255,255,255,0.7)',
                }}
              >
                {f.icon}
              </div>
              <div className="font-serif text-xl font-bold text-navy">
                {f.title}
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{f.desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
