import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { deal } from '../game/deck.js'
import { evaluateHand, compareHands } from '../game/evaluator.js'
import { decideAction } from '../game/ai.js'
import {
  GAME_CONFIG,
  PERSONALITIES,
  AI_AVATARS,
  AI_NAMES,
} from '../game/constants.js'

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

function shuffleNames(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function createPlayers(humanName, humanChips, aiCount) {
  const players = [
    {
      id: 'human',
      name: humanName || '你',
      avatar: '🧑',
      chips: humanChips,
      isHuman: true,
      personality: null,
      hand: [],
      eval: null,
      isBlind: true,
      isFolded: false,
      hasSeenHand: false,
      lastAction: null,
      betThisRound: 0,
      isOut: false,
    },
  ]
  const names = shuffleNames(AI_NAMES).slice(0, aiCount)
  const avatars = shuffleNames(AI_AVATARS).slice(0, aiCount)
  for (let i = 0; i < aiCount; i++) {
    players.push({
      id: `ai-${i}`,
      name: names[i],
      avatar: avatars[i],
      chips: humanChips, // AI 起手筹码与玩家相同，体验更平衡
      isHuman: false,
      personality: PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)],
      hand: [],
      eval: null,
      isBlind: true,
      isFolded: false,
      hasSeenHand: false,
      lastAction: null,
      betThisRound: 0,
      isOut: false,
    })
  }
  return players
}

// 计算某玩家的跟注金额：闷牌 = currentBet，看牌 = currentBet * 2
function callCost(player, currentBet) {
  return player.isBlind ? currentBet : currentBet * 2
}

// 比牌费用：闷牌 = currentBet，看牌 = currentBet * 2
function compareCost(player, currentBet) {
  return player.isBlind ? currentBet : currentBet * 2
}

const initialPersistedState = {
  humanChips: GAME_CONFIG.initialChips,
  humanName: '玩家',
  lastDailyClaim: 0,
  totalWins: 0,
  totalGames: 0,
}

export const useGameStore = create(
  persist(
    (set, get) => ({
      ...initialPersistedState,

      // === 会话内状态（不持久化）===
      ante: 10,
      currentBet: 10,
      pot: 0,
      players: [],
      currentPlayerIndex: 0,
      round: 1,
      phase: 'idle', // idle | dealing | playing | showdown | ended
      winnerId: null,
      winners: [],
      actionLog: [],
      compareEvent: null, // {fromId, toId, loserId}
      lastResult: null, // 上局结果摘要

      // === Setup ===
      setHumanName: (name) => set({ humanName: name }),
      claimDaily: () => {
        const today = new Date().toDateString()
        const last = new Date(get().lastDailyClaim).toDateString()
        if (today === last) return false
        set((s) => ({
          humanChips: s.humanChips + 1000,
          lastDailyClaim: Date.now(),
        }))
        return true
      },

      startGame: ({ ante = 10, aiCount = 3 } = {}) => {
        const { humanChips, humanName } = get()
        if (humanChips < ante * 4) {
          // 金币不足以支付几轮 → 自动补到 5000
          set({ humanChips: GAME_CONFIG.initialChips })
        }
        const players = createPlayers(humanName, get().humanChips, aiCount)
        set({
          ante,
          currentBet: ante,
          pot: 0,
          players,
          currentPlayerIndex: 0,
          round: 1,
          phase: 'dealing',
          winnerId: null,
          winners: [],
          actionLog: [{ type: 'system', text: `新一局开始 · 底注 ${ante}` }],
          compareEvent: null,
          lastResult: null,
        })

        // 收底注
        setTimeout(() => get()._collectAntes(), 400)
        // 发牌
        setTimeout(() => get()._dealCards(), 800)
        // 开始第一个回合
        setTimeout(() => get()._beginPlaying(), 1600)
      },

      _collectAntes: () => {
        set((s) => {
          const ante = s.ante
          const players = s.players.map((p) => ({
            ...p,
            chips: p.chips - ante,
            betThisRound: ante,
          }))
          // 同步玩家本人筹码持久化
          const human = players.find((p) => p.id === 'human')
          return {
            players,
            pot: s.pot + ante * players.length,
            humanChips: human.chips,
          }
        })
      },

      _dealCards: () => {
        const { players } = get()
        const { hands } = deal(players.length)
        set({
          players: players.map((p, i) => ({
            ...p,
            hand: hands[i],
            eval: evaluateHand(hands[i]),
          })),
        })
      },

      _beginPlaying: () => {
        set({ phase: 'playing', currentPlayerIndex: 0 })
        get()._maybeAITurn()
      },

      _advanceTurn: () => {
        const { players, currentPlayerIndex, round, currentBet, ante } = get()
        const activeCount = players.filter((p) => !p.isFolded).length

        // 只剩一人 → 直接获胜
        if (activeCount === 1) {
          const winner = players.find((p) => !p.isFolded)
          return get()._endRound([winner.id])
        }

        // 寻找下一个未弃牌玩家
        let next = (currentPlayerIndex + 1) % players.length
        let safety = 0
        while (players[next].isFolded && safety < players.length) {
          next = (next + 1) % players.length
          safety++
        }

        // 是否进入下一轮（回到第一位活跃玩家）
        const firstActive = players.findIndex((p) => !p.isFolded)
        const newRound = next === firstActive ? round + 1 : round

        // 达到封顶轮：强制摊牌
        if (newRound > GAME_CONFIG.maxRound) {
          return get()._forceShowdown()
        }

        // 闷牌轮数到限：强制看牌
        let nextPlayers = players
        if (newRound > GAME_CONFIG.blindLimit) {
          nextPlayers = players.map((p) =>
            !p.isFolded && p.isBlind
              ? { ...p, isBlind: false, hasSeenHand: true }
              : p,
          )
        }

        set({
          currentPlayerIndex: next,
          round: newRound,
          players: nextPlayers,
        })
        get()._maybeAITurn()
      },

      _maybeAITurn: () => {
        const { players, currentPlayerIndex, phase } = get()
        if (phase !== 'playing') return
        const current = players[currentPlayerIndex]
        if (!current || current.isHuman || current.isFolded) return

        // AI 思考延迟
        const delay = 900 + Math.random() * 900
        setTimeout(() => {
          const state = get()
          if (state.phase !== 'playing') return
          const me = state.players[state.currentPlayerIndex]
          if (!me || me.id !== current.id || me.isFolded) return

          const activePlayers = state.players.filter((p) => !p.isFolded)
          const decision = decideAction(
            me,
            {
              currentBet: state.currentBet,
              pot: state.pot,
              round: state.round,
              maxRound: GAME_CONFIG.maxRound,
              activePlayers,
              callAmount: callCost(me, state.currentBet),
              canCompare: activePlayers.length >= 2 && state.round >= 1,
            },
          )

          // 执行 AI 决策
          switch (decision.action) {
            case 'fold':
              get().playerAction(me.id, 'fold')
              break
            case 'see':
              get().playerAction(me.id, 'see')
              // 看牌不消耗回合，立即重新决策
              setTimeout(() => get()._maybeAITurn(), 500)
              break
            case 'call':
              get().playerAction(me.id, 'call')
              break
            case 'raise':
              get().playerAction(me.id, 'raise', { multiplier: decision.amount || 2 })
              break
            case 'compare':
              get().playerAction(me.id, 'compare', { targetId: decision.targetId })
              break
            default:
              get().playerAction(me.id, 'call')
          }
        }, delay)
      },

      // 玩家或 AI 通用操作入口
      playerAction: (playerId, action, payload = {}) => {
        const state = get()
        if (state.phase !== 'playing') return
        const idx = state.players.findIndex((p) => p.id === playerId)
        if (idx === -1) return
        const me = state.players[idx]
        if (me.isFolded) return
        if (state.players[state.currentPlayerIndex].id !== playerId && action !== 'see') return

        switch (action) {
          case 'see': {
            if (!me.isBlind) return
            set((s) => ({
              players: s.players.map((p) =>
                p.id === playerId
                  ? { ...p, isBlind: false, hasSeenHand: true, lastAction: '看牌' }
                  : p,
              ),
              actionLog: [
                ...s.actionLog,
                { type: 'action', playerId, text: `${me.name} 看了牌` },
              ],
            }))
            return // 不推进回合
          }

          case 'fold': {
            set((s) => ({
              players: s.players.map((p) =>
                p.id === playerId ? { ...p, isFolded: true, lastAction: '弃牌' } : p,
              ),
              actionLog: [
                ...s.actionLog,
                { type: 'action', playerId, text: `${me.name} 弃牌` },
              ],
            }))
            get()._advanceTurn()
            return
          }

          case 'call': {
            const cost = callCost(me, state.currentBet)
            const actualCost = Math.min(cost, me.chips)
            set((s) => {
              const players = s.players.map((p) =>
                p.id === playerId
                  ? {
                      ...p,
                      chips: p.chips - actualCost,
                      betThisRound: p.betThisRound + actualCost,
                      lastAction: `跟注 ${actualCost}`,
                    }
                  : p,
              )
              const human = players.find((p) => p.id === 'human')
              return {
                players,
                pot: s.pot + actualCost,
                humanChips: human ? human.chips : s.humanChips,
                actionLog: [
                  ...s.actionLog,
                  { type: 'action', playerId, text: `${me.name} 跟注 ${actualCost}` },
                ],
              }
            })
            // 筹码不足强制弃牌
            if (actualCost < cost) {
              setTimeout(() => {
                set((s) => ({
                  players: s.players.map((p) =>
                    p.id === playerId ? { ...p, isFolded: true } : p,
                  ),
                }))
              }, 0)
            }
            get()._advanceTurn()
            return
          }

          case 'raise': {
            const mult = payload.multiplier || 2
            const newBet = state.currentBet * mult
            const cost = me.isBlind ? newBet : newBet * 2
            const actualCost = Math.min(cost, me.chips)
            set((s) => {
              const players = s.players.map((p) =>
                p.id === playerId
                  ? {
                      ...p,
                      chips: p.chips - actualCost,
                      betThisRound: p.betThisRound + actualCost,
                      lastAction: `加注 x${mult}`,
                    }
                  : p,
              )
              const human = players.find((p) => p.id === 'human')
              return {
                players,
                pot: s.pot + actualCost,
                currentBet: newBet,
                humanChips: human ? human.chips : s.humanChips,
                actionLog: [
                  ...s.actionLog,
                  {
                    type: 'action',
                    playerId,
                    text: `${me.name} 加注 ${mult}× → 新注码 ${newBet}`,
                  },
                ],
              }
            })
            get()._advanceTurn()
            return
          }

          case 'compare': {
            const targetId = payload.targetId
            const target = state.players.find((p) => p.id === targetId)
            if (!target || target.isFolded) return
            const cost = compareCost(me, state.currentBet)
            const actualCost = Math.min(cost, me.chips)
            const cmp = compareHands(me.hand, target.hand)
            const loserId = cmp >= 0 ? targetId : playerId // 平局也算发起者赢（不会真平）

            set((s) => {
              const players = s.players.map((p) => {
                if (p.id === playerId) {
                  return {
                    ...p,
                    chips: p.chips - actualCost,
                    betThisRound: p.betThisRound + actualCost,
                    lastAction: `比牌 → ${target.name}`,
                  }
                }
                if (p.id === loserId) {
                  return { ...p, isFolded: true, hasSeenHand: true }
                }
                return p
              })
              const human = players.find((p) => p.id === 'human')
              const loserName = players.find((p) => p.id === loserId).name
              return {
                players,
                pot: s.pot + actualCost,
                humanChips: human ? human.chips : s.humanChips,
                compareEvent: { fromId: playerId, toId: targetId, loserId },
                actionLog: [
                  ...s.actionLog,
                  {
                    type: 'compare',
                    playerId,
                    text: `${me.name} 与 ${target.name} 比牌 · ${loserName} 出局`,
                  },
                ],
              }
            })
            setTimeout(() => set({ compareEvent: null }), 2500)
            get()._advanceTurn()
            return
          }

          default:
            return
        }
      },

      _forceShowdown: () => {
        const { players } = get()
        const active = players.filter((p) => !p.isFolded)
        let winnerId = active[0].id
        for (let i = 1; i < active.length; i++) {
          if (compareHands(active[i].hand, active.find((p) => p.id === winnerId).hand) > 0) {
            winnerId = active[i].id
          }
        }
        const losers = active.filter((p) => p.id !== winnerId).map((p) => p.id)
        set((s) => ({
          actionLog: [
            ...s.actionLog,
            { type: 'system', text: '达到封顶轮 · 强制摊牌' },
          ],
        }))
        // 标记其他人弃牌以触发结算
        set((s) => ({
          players: s.players.map((p) =>
            losers.includes(p.id) ? { ...p, isFolded: true, hasSeenHand: true } : p,
          ),
        }))
        get()._endRound([winnerId], true)
      },

      _endRound: (winnerIds, isShowdown = false) => {
        const state = get()
        const winnerId = winnerIds[0]
        const winner = state.players.find((p) => p.id === winnerId)
        const winAmount = state.pot
        const players = state.players.map((p) => ({
          ...p,
          chips: p.id === winnerId ? p.chips + winAmount : p.chips,
          hasSeenHand: isShowdown ? true : p.hasSeenHand,
        }))
        const human = players.find((p) => p.id === 'human')
        const humanWon = winnerId === 'human'

        set((s) => ({
          players,
          phase: 'showdown',
          winnerId,
          winners: [winner],
          pot: 0,
          humanChips: human ? human.chips : s.humanChips,
          totalGames: s.totalGames + 1,
          totalWins: s.totalWins + (humanWon ? 1 : 0),
          lastResult: {
            winnerId,
            winnerName: winner.name,
            amount: winAmount,
            humanDelta: human.chips - s.humanChips,
            isShowdown,
          },
          actionLog: [
            ...s.actionLog,
            {
              type: 'system',
              text: `${winner.name} 赢得 ${winAmount} 金币`,
            },
          ],
        }))
      },

      resetTable: () => {
        set({
          phase: 'idle',
          players: [],
          pot: 0,
          currentBet: 0,
          round: 1,
          winnerId: null,
          actionLog: [],
          compareEvent: null,
        })
      },

      // 调试：补满金币
      refillChips: () => set({ humanChips: GAME_CONFIG.initialChips }),
    }),
    {
      name: 'clear-card-storage',
      partialize: (s) => ({
        humanChips: s.humanChips,
        humanName: s.humanName,
        lastDailyClaim: s.lastDailyClaim,
        totalWins: s.totalWins,
        totalGames: s.totalGames,
      }),
    },
  ),
)

// 工具导出（供 UI 使用）
export const helpers = { callCost, compareCost }
