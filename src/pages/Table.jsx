import { useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGameStore } from '../store/gameStore.js'
import PlayerSeat from '../components/game/PlayerSeat.jsx'
import PotDisplay from '../components/game/PotDisplay.jsx'
import BettingPanel from '../components/game/BettingPanel.jsx'
import CompareModal from '../components/game/CompareModal.jsx'
import ResultModal from '../components/game/ResultModal.jsx'
import ActionLog from '../components/game/ActionLog.jsx'
import PrimaryButton from '../components/ui/PrimaryButton.jsx'
import { GAME_CONFIG } from '../game/constants.js'

// 不同玩家数量下的座位坐标（绝对定位百分比，相对牌桌容器）
const SEAT_LAYOUTS = {
  2: ['bottom-4 left-1/2 -translate-x-1/2', 'top-4 left-1/2 -translate-x-1/2'],
  3: [
    'bottom-4 left-1/2 -translate-x-1/2',
    'top-1/3 -translate-y-1/2 left-4',
    'top-1/3 -translate-y-1/2 right-4',
  ],
  4: [
    'bottom-4 left-1/2 -translate-x-1/2',
    'top-1/3 -translate-y-1/2 left-4',
    'top-4 left-1/2 -translate-x-1/2',
    'top-1/3 -translate-y-1/2 right-4',
  ],
  5: [
    'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-1/3 left-4',
    'top-4 left-1/4',
    'top-4 right-1/4',
    'bottom-1/3 right-4',
  ],
}

export default function Table() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const ante = Number(params.get('ante')) || 10
  const aiCount = Number(params.get('ai')) || 3

  const {
    players,
    pot,
    currentBet,
    round,
    phase,
    compareEvent,
    actionLog,
    currentPlayerIndex,
    winnerId,
    lastResult,
    startGame,
    playerAction,
    resetTable,
  } = useGameStore()

  // 进入时自动开始
  useEffect(() => {
    startGame({ ante, aiCount })
    return () => resetTable()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const layout = SEAT_LAYOUTS[players.length] || SEAT_LAYOUTS[4]
  const me = players.find((p) => p.id === 'human')
  const isMyTurn =
    phase === 'playing' &&
    players[currentPlayerIndex] &&
    players[currentPlayerIndex].id === 'human' &&
    !me?.isFolded

  const opponents = useMemo(
    () => players.filter((p) => p.id !== 'human' && !p.isFolded),
    [players],
  )

  return (
    <div className="relative min-h-screen w-full">
      {/* 顶部栏 */}
      <header className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-8 py-5">
        <button
          onClick={() => navigate('/lobby')}
          className="rounded-full border border-white/60 bg-white/60 px-4 py-2 text-sm font-medium text-navy backdrop-blur-xl transition hover:bg-white/80"
        >
          ← 返回大厅
        </button>
        <div className="rounded-full border border-white/60 bg-white/70 px-5 py-2 text-sm font-semibold text-navy backdrop-blur-xl">
          底注 <span className="text-royal">{ante}</span>
          <span className="mx-2 text-slate-300">|</span>
          AI <span className="text-royal">{aiCount}</span>
        </div>
      </header>

      <div className="mx-auto flex min-h-screen max-w-[1500px] gap-6 px-8 pb-10 pt-24">
        {/* 牌桌主区 */}
        <div className="relative flex-1">
          {/* 椭圆玻璃桌面 */}
          <div className="relative mx-auto h-[640px] w-full max-w-[1080px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 rounded-[50%] border border-white/60 bg-gradient-to-br from-white/60 via-white/40 to-white/60 shadow-glass-lg backdrop-blur-2xl"
              style={{
                boxShadow:
                  '0 30px 80px rgba(31,38,135,0.12), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 0 80px rgba(224,242,254,0.5)',
              }}
            />
            {/* 桌面装饰圆环 */}
            <div className="pointer-events-none absolute inset-10 rounded-[50%] border border-white/40" />
            <div className="pointer-events-none absolute inset-20 rounded-[50%] border border-white/30" />

            {/* 中央彩池 */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <PotDisplay
                pot={pot}
                currentBet={currentBet}
                round={round}
                maxRound={GAME_CONFIG.maxRound}
              />
            </div>

            {/* 玩家座位 */}
            {players.map((p, i) => (
              <PlayerSeat
                key={p.id}
                player={p}
                isCurrent={i === currentPlayerIndex && phase === 'playing'}
                isHumanView={p.id === 'human'}
                showCards={phase === 'showdown'}
                positionClass={layout[i]}
              />
            ))}
          </div>

          {/* 操作面板 */}
          <div className="mt-8 flex justify-center">
            {phase === 'playing' && me && !me.isFolded ? (
              <BettingPanel
                me={me}
                currentBet={currentBet}
                opponents={opponents}
                onAction={(action, payload) => playerAction('human', action, payload)}
                disabled={!isMyTurn}
              />
            ) : phase === 'showdown' ? (
              <div className="text-center text-sm text-slate-500">本局结算中…</div>
            ) : me?.isFolded ? (
              <div className="text-center text-sm text-slate-500">你已弃牌，等待结算</div>
            ) : (
              <div className="text-center text-sm text-slate-500">准备开始…</div>
            )}
          </div>
        </div>

        {/* 右侧日志栏 */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="h-[700px]">
            <ActionLog logs={actionLog} />
          </div>
        </aside>
      </div>

      {/* 比牌动画 */}
      <CompareModal event={compareEvent} players={players} />

      {/* 结算弹窗 */}
      <ResultModal
        open={phase === 'showdown' && !!winnerId}
        players={players}
        winnerId={winnerId}
        amount={lastResult?.amount || 0}
        onAgain={() => startGame({ ante, aiCount })}
        onLeave={() => navigate('/lobby')}
      />
    </div>
  )
}
