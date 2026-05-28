import { motion } from 'framer-motion'
import GlassCard from '../ui/GlassCard.jsx'

const ITEMS = [
  {
    name: '小王',
    role: '上班族 · 牌龄 8 年',
    avatar: '🦊',
    quote:
      '终于有一个没有强迫充值、没有套路弹窗的炸金花。AI 还会闷牌唬我，真服了。',
  },
  {
    name: 'Lily',
    role: '设计师',
    avatar: '🐼',
    quote: 'UI 美得过分，连发牌的那个 0.3 秒都让我截屏存档了。',
  },
  {
    name: '老六',
    role: '前公会会长',
    avatar: '🦉',
    quote:
      '激进派 AI 是真的会诈我，赢一把比赢真人还爽。简直是在跟玩家斗智斗勇。',
  },
  {
    name: '阿茶',
    role: '学生党',
    avatar: '🐺',
    quote: '0 元玩，金币管够，纯纯娱乐。睡前来三把，第二天精神满满（？）',
  },
  {
    name: 'Ken',
    role: '产品经理',
    avatar: '🐯',
    quote:
      '体验流程做得太顺了，从落地页到牌桌一气呵成，连结算动画都让我会心一笑。',
  },
]

export default function Testimonials() {
  return (
    <section id="community" className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10">
      <div className="mb-12 text-center">
        <div className="text-xs uppercase tracking-[0.4em] text-slate-500">
          Player Voices
        </div>
        <h2 className="mt-2 font-serif text-4xl font-bold text-navy">
          来自玩家的<span className="text-gradient-royal">真实声音</span>
        </h2>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-4 pl-2 [scrollbar-width:thin]">
        {ITEMS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="shrink-0"
          >
            <GlassCard className="relative w-80 p-6">
              <div className="absolute -top-5 left-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-mist-blue to-mist-peach text-2xl shadow-glass">
                {t.avatar}
              </div>
              <div className="mt-6 text-sm leading-relaxed text-slate-700">
                "{t.quote}"
              </div>
              <div className="mt-4 border-t border-white/60 pt-3">
                <div className="text-sm font-bold text-navy">{t.name}</div>
                <div className="text-xs text-slate-500">{t.role}</div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
        <div className="shrink-0 pr-6" />
      </div>
    </section>
  )
}
