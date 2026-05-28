import { motion } from 'framer-motion'
import { forwardRef } from 'react'

const GlassCard = forwardRef(function GlassCard(
  { children, className = '', interactive = false, as: Tag = 'div', ...rest },
  ref,
) {
  const base =
    'relative rounded-3xl bg-white/60 backdrop-blur-xl border border-white/50 shadow-glass'
  const interactiveStyles = interactive
    ? 'transition-all duration-300 hover:bg-white/75 hover:shadow-glass-lg hover:-translate-y-0.5'
    : ''

  if (Tag === motion.div || rest._motion) {
    return (
      <motion.div ref={ref} className={`${base} ${interactiveStyles} ${className}`} {...rest}>
        {/* 左上微光高光 */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/70 via-transparent to-transparent opacity-60" />
        <div className="relative">{children}</div>
      </motion.div>
    )
  }
  return (
    <Tag ref={ref} className={`${base} ${interactiveStyles} ${className}`} {...rest}>
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/70 via-transparent to-transparent opacity-60" />
      <div className="relative">{children}</div>
    </Tag>
  )
})

export default GlassCard
