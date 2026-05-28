import { motion, AnimatePresence } from 'framer-motion'

export default function ActionLog({ logs }) {
  const recent = logs.slice(-20)
  return (
    <div className="h-full overflow-hidden rounded-3xl border border-white/60 bg-white/65 p-4 backdrop-blur-xl shadow-glass">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-serif text-base font-bold text-navy">行动日志</div>
        <div className="text-[10px] uppercase tracking-widest text-slate-400">Live</div>
      </div>
      <div className="flex flex-col gap-1.5 overflow-y-auto pr-1" style={{ maxHeight: 'calc(100% - 32px)' }}>
        <AnimatePresence initial={false}>
          {recent.map((log, i) => (
            <motion.div
              key={i + log.text}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`rounded-xl px-3 py-1.5 text-xs ${
                log.type === 'system'
                  ? 'bg-slate-100/80 text-slate-600'
                  : log.type === 'compare'
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-white/80 text-navy'
              }`}
            >
              {log.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
