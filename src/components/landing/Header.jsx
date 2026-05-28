import { Link } from 'react-router-dom'
import PrimaryButton from '../ui/PrimaryButton.jsx'

export default function Header() {
  return (
    <header className="sticky top-0 z-30 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-royal text-base font-bold text-white shadow-royal">
            ♠
          </span>
          <span className="font-serif text-xl font-bold tracking-tight text-navy">
            CLEAR_CARD<span className="text-royal">.</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#features" className="hover:text-navy">特色</a>
          <a href="#rules" className="hover:text-navy">玩法</a>
          <a href="#growth" className="hover:text-navy">成长</a>
          <a href="#community" className="hover:text-navy">社区</a>
        </nav>
        <Link to="/lobby">
          <PrimaryButton size="sm">进入大厅 →</PrimaryButton>
        </Link>
      </div>
    </header>
  )
}
