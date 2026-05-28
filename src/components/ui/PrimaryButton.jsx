import { motion } from 'framer-motion'

const variants = {
  primary:
    'bg-royal text-white shadow-royal hover:bg-royal-dark hover:shadow-royal-lg disabled:bg-slate-300 disabled:shadow-none',
  ghost:
    'bg-white/60 backdrop-blur-md text-navy border border-white/60 hover:bg-white/80 disabled:opacity-50',
  gold: 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-[0_10px_30px_rgba(245,158,11,0.4)] hover:from-amber-500 hover:to-amber-600 disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none',
  danger:
    'bg-rose-500 text-white shadow-[0_10px_30px_rgba(244,63,94,0.35)] hover:bg-rose-600 disabled:bg-slate-300 disabled:shadow-none',
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-full',
  md: 'px-6 py-3 text-base rounded-full',
  lg: 'px-8 py-4 text-lg rounded-full',
}

export default function PrimaryButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-colors disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
