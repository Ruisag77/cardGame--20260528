import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import PlayerProfile from '../components/lobby/PlayerProfile.jsx'
import RoomCard from '../components/lobby/RoomCard.jsx'
import PrimaryButton from '../components/ui/PrimaryButton.jsx'
import { useGameStore } from '../store/gameStore.js'

const ROOMS = [
  {
    id: 'starter',
    name: '新手村',
    tag: 'Casual',
    ante: 10,
    minBuy: 100,
    aiCount: 2,
    online: 86,
    desc: '门槛最低，节奏轻松。先在这里热热手，熟悉炸金花的基本操作。',
    icon: '🌱',
    accent: 'radial-gradient(circle, #d1fae5, transparent 70%)',
  },
  {
    id: 'pro',
    name: '进阶馆',
    tag: 'Featured',
    ante: 50,
    minBuy: 500,
    aiCount: 3,
    online: 142,
    desc: '人均高手出没。AI 会判断你的下注习惯，敢闷牌也敢比牌。',
    icon: '🔥',
    accent: 'radial-gradient(circle, #fed7aa, transparent 70%)',
    featured: true,
  },
  {
    id: 'expert',
    name: '高手局',
    tag: 'High Stakes',
    ante: 200,
    minBuy: 2000,
    aiCount: 3,
    online: 58,
    desc: '激进风格 AI 比例更高，一局可能就翻倍或归零。心理战开始。',
    icon: '💎',
    accent: 'radial-gradient(circle, #bae6fd, transparent 70%)',
  },
  {
    id: 'vip',
    name: '富豪厅',
    tag: 'V.I.P',
    ante: 1000,
    minBuy: 10000,
    aiCount: 4,
    online: 12,
    desc: '只有真正的牌神才敢踏入。每一手都是上万金币的搏杀。',
    icon: '👑',
    accent: 'radial-gradient(circle, #e9d5ff, transparent 70%)',
  },
]

export default function Lobby() {
  const navigate = useNavigate()
  const { humanChips, refillChips } = useGameStore()

  return (
    <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10 sm:py-14">
      {/* 顶部导航 */}
      <header className="mb-8 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="font-serif text-xl font-bold text-navy"
        >
          CLEAR_CARD<span className="text-royal">.</span>
        </button>
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={refillChips}
            className="rounded-full border border-white/60 bg-white/60 px-3 py-1.5 text-xs font-medium text-slate-500 backdrop-blur-xl transition hover:bg-white/80"
            title="调试用：金币补满到 5000"
          >
            🔄 重置金币
          </button>
        </div>
      </header>

      {/* 玩家信息 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PlayerProfile />
      </motion.div>

      {/* 房间标题 */}
      <div className="mt-12 mb-6 flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.35em] text-slate-500">
            Choose Your Table
          </div>
          <h1 className="font-serif text-3xl font-bold text-navy">挑一桌开局</h1>
        </div>
        <div className="text-sm text-slate-500">
          共 <span className="font-semibold text-navy">{ROOMS.length}</span> 个房间
        </div>
      </div>

      {/* 房间网格 */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2"
      >
        {ROOMS.map((room) => {
          const disabled = humanChips < room.minBuy
          return (
            <motion.div
              key={room.id}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <RoomCard
                room={room}
                disabled={disabled}
                onEnter={() =>
                  navigate(`/table?ante=${room.ante}&ai=${room.aiCount}`)
                }
              />
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
