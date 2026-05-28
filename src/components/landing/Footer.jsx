export default function Footer() {
  return (
    <footer className="relative mt-10 border-t border-white/50 bg-white/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-10 sm:px-10 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-royal text-base font-bold text-white shadow-royal">
              ♠
            </span>
            <span className="font-serif text-xl font-bold tracking-tight text-navy">
              CLEAR_CARD<span className="text-royal">.</span>
            </span>
          </div>
          <p className="mt-3 max-w-md text-xs leading-relaxed text-slate-500">
            CLEAR_CARD 是一个纯娱乐、零真金的炸金花单机平台。
            游戏中的金币没有任何现实价值，禁止任何形式的兑换或交易。
            请未成年人在监护人陪同下使用。
          </p>
        </div>
        <div className="grid grid-cols-3 gap-10 text-sm">
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
              产品
            </div>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#features" className="hover:text-navy">特色</a></li>
              <li><a href="#growth" className="hover:text-navy">成长</a></li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
         玩法
            </div>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#rules" className="hover:text-navy">规则</a></li>
              <li><a href="#community" className="hover:text-navy">评价</a></li>
            </ul>
          </div>
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
              关于
            </div>
            <ul className="space-y-2 text-slate-600">
              <li>© 2026 CLEAR_CARD</li>
              <li>仅供娱乐使用</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
