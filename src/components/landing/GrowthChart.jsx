import { motion } from 'framer-motion'
import GlassCard from '../ui/GlassCard.jsx'

// 模拟金币增长曲线
const POINTS = [
  { d: '第1天', v: 1000 },
  { d: '第2天', v: 1450 },
  { d: '第3天', v: 1300 },
  { d: '第4天', v: 2100 },
  { d: '第5天', v: 2800 },
  { d: '第6天', v: 3650 },
  { d: '第7天', v: 5400 },
]

export default function GrowthChart() {
  const W = 720
  const H = 280
  const padding = { l: 50, r: 30, t: 30, b: 40 }
  const maxV = Math.max(...POINTS.map((p) => p.v))
  const xStep = (W - padding.l - padding.r) / (POINTS.length - 1)
  const yScale = (H - padding.t - padding.b) / maxV

  const linePath = POINTS.map((p, i) => {
    const x = padding.l + i * xStep
    const y = H - padding.b - p.v * yScale
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  const areaPath =
    linePath +
    ` L ${padding.l + (POINTS.length - 1) * xStep} ${H - padding.b}` +
    ` L ${padding.l} ${H - padding.b} Z`

  return (
    <section id="growth" className="relative mx-auto max-w-7xl px-6 py-20 sm:px-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="text-xs uppercase tracking-[0.4em] text-slate-500">
            Coin Growth
          </div>
          <h2 className="mt-2 font-serif text-4xl font-bold text-navy">
            金币会跟你
            <br />
            一起<span className="text-gradient-royal">变厚</span>。
          </h2>
          <p className="mt-5 text-base leading-relaxed text-slate-600">
            从新手村起步，每一次精准的弃牌、每一次精彩的比牌都会沉淀为可视化的成长。
            打开「成长曲线」，你能清晰看到自己从牌渣变成牌神的全过程。
          </p>
          <div className="mt-6 flex items-center gap-6">
            <div>
              <div className="text-xs text-slate-500">日均胜场</div>
              <div className="font-serif text-2xl font-bold text-navy">+18</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">本周收益</div>
              <div className="font-serif text-2xl font-bold text-emerald-600">
                +4,400
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          <GlassCard className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-serif text-lg font-bold text-navy">
                我的金币 · 近 7 天
              </div>
              <div className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                ▲ 440%
              </div>
            </div>

            <svg viewBox={`0 0 ${W} ${H}`} className="h-64 w-full">
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1d4ed8" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>

              {/* 网格线 */}
              {[0.25, 0.5, 0.75, 1].map((r) => {
                const y = H - padding.b - (H - padding.t - padding.b) * r
                return (
                  <line
                    key={r}
                    x1={padding.l}
                    x2={W - padding.r}
                    y1={y}
                    y2={y}
                    stroke="#cbd5e1"
                    strokeDasharray="2 6"
                    strokeWidth="0.5"
                  />
                )
              })}

              {/* 区域填充 */}
              <motion.path
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                d={areaPath}
                fill="url(#areaFill)"
              />

              {/* 折线 */}
              <motion.path
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: 'easeInOut' }}
                d={linePath}
                fill="none"
                stroke="url(#lineGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* 数据点 */}
              {POINTS.map((p, i) => {
                const x = padding.l + i * xStep
                const y = H - padding.b - p.v * yScale
                return (
                  <g key={p.d}>
                    <motion.circle
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + i * 0.06 }}
                      cx={x}
                      cy={y}
                      r={5}
                      fill="white"
                      stroke="#1d4ed8"
                      strokeWidth="2"
                    />
                    <text
                      x={x}
                      y={H - padding.b + 22}
                      textAnchor="middle"
                      className="fill-slate-400 text-[10px]"
                    >
                      {p.d}
                    </text>
                  </g>
                )
              })}

              {/* 末点强调 */}
              <text
                x={padding.l + (POINTS.length - 1) * xStep}
                y={H - padding.b - POINTS[POINTS.length - 1].v * yScale - 12}
                textAnchor="end"
                className="fill-navy text-[12px] font-bold"
              >
                🪙 {POINTS[POINTS.length - 1].v}
              </text>
            </svg>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
