import GlassCard from '../ui/GlassCard.jsx'

const RULES = [
  { label: '豹子', desc: '三张同点，例如 AAA、KKK', icon: '👑', tier: 1 },
  { label: '顺金', desc: '同花色连续三张', icon: '🌈', tier: 2 },
  { label: '金花', desc: '三张同花色', icon: '🌺', tier: 3 },
  { label: '顺子', desc: '连续三张不同花', icon: '➡️', tier: 4 },
  { label: '对子', desc: '两张同点 + 一张杂牌', icon: '🎯', tier: 5 },
  { label: '散牌', desc: '比最大单张', icon: '🍃', tier: 6 },
]

export default function RulesSection() {
  return (
    <section id="rules" className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10">
      <div className="mb-12 text-center">
        <div className="text-xs uppercase tracking-[0.4em] text-slate-500">Rules</div>
        <h2 className="mt-2 font-serif text-4xl font-bold text-navy">
          牌型从大到小
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
          炸金花共 6 种牌型。同牌型时再比点数，最终仍持平则比花色（黑桃 &gt; 红心 &gt; 方块 &gt; 梅花）。
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {RULES.map((r) => (
          <GlassCard key={r.label} interactive className="flex flex-col items-center gap-3 p-5 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 text-2xl shadow-glass">
              {r.icon}
            </div>
            <div className="font-serif text-lg font-bold text-navy">
              {r.label}
            </div>
            <div className="text-xs text-slate-500">{r.desc}</div>
            <div className="rounded-full bg-slate-100/80 px-2 py-0.5 text-[10px] text-slate-500">
              T{r.tier}
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  )
}
