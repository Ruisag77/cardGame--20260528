import { handStrength } from './evaluator.js'

/**
 * AI 决策
 * @param {Object} ai - AI 自身状态 {id, chips, hand, isBlind, personality}
 * @param {Object} game - 局面信息 {currentBet, pot, round, maxRound, activePlayers, callAmount, canCompare}
 * @returns {Object} {action, amount?, targetId?}
 *   action ∈ 'fold' | 'see' | 'call' | 'raise' | 'compare'
 */
export function decideAction(ai, game) {
  const { personality, hand, isBlind, chips } = ai
  const { currentBet, round, maxRound, activePlayers, callAmount } = game

  const strength = handStrength(hand)
  const opponentsLeft = activePlayers.length - 1

  // 人格参数
  const profile = {
    steady: { foldThreshold: 0.18, raiseThreshold: 0.55, compareThreshold: 0.7, bluffRate: 0.1, raiseRate: 0.25 },
    aggressive: { foldThreshold: 0.1, raiseThreshold: 0.4, compareThreshold: 0.55, bluffRate: 0.25, raiseRate: 0.45 },
    cautious: { foldThreshold: 0.28, raiseThreshold: 0.65, compareThreshold: 0.78, bluffRate: 0.03, raiseRate: 0.15 },
  }[personality] || { foldThreshold: 0.2, raiseThreshold: 0.55, compareThreshold: 0.7, bluffRate: 0.1, raiseRate: 0.25 }

  // 1. 接近封顶轮且手牌不错 → 主动比牌
  const lateGame = round >= maxRound - 1
  if (game.canCompare && opponentsLeft >= 1) {
    if (strength >= profile.compareThreshold || (lateGame && strength >= 0.4)) {
      return { action: 'compare', targetId: pickWeakestTarget(game.activePlayers, ai.id) }
    }
  }

  // 2. 闷牌时考虑揭牌（多轮后或筹码风险大时）
  if (isBlind) {
    const shouldPeek =
      round >= 3 ||
      callAmount > chips * 0.15 ||
      (personality === 'cautious' && callAmount > chips * 0.08)
    if (shouldPeek && Math.random() < 0.7) {
      return { action: 'see' }
    }
  }

  // 3. 看牌后：根据强度决定
  if (!isBlind) {
    // 弱牌：高概率弃牌，特别是跟注大时
    if (strength < profile.foldThreshold) {
      // 跟注便宜时偶尔诈一下
      if (callAmount <= currentBet * 1.2 && Math.random() < profile.bluffRate) {
        return { action: 'call' }
      }
      return { action: 'fold' }
    }
    // 中等牌：跟注为主
    if (strength < profile.raiseThreshold) {
      // 跟注太贵也会跑
      if (callAmount > chips * 0.4) return { action: 'fold' }
      return { action: 'call' }
    }
    // 强牌：加注或比牌
    if (strength >= profile.compareThreshold && game.canCompare && opponentsLeft >= 1 && round >= 2) {
      return { action: 'compare', targetId: pickWeakestTarget(game.activePlayers, ai.id) }
    }
    if (Math.random() < profile.raiseRate) {
      const mult = strength >= 0.8 ? (Math.random() < 0.4 ? 5 : 2) : 2
      return { action: 'raise', amount: mult }
    }
    return { action: 'call' }
  }

  // 4. 闷牌默认跟注（便宜，多看几轮）
  if (callAmount > chips * 0.25) return { action: 'fold' }
  // 偶尔闷牌加注（虚张声势）
  if (Math.random() < profile.raiseRate * 0.4 && round >= 2) {
    return { action: 'raise', amount: 2 }
  }
  return { action: 'call' }
}

function pickWeakestTarget(activePlayers, selfId) {
  const others = activePlayers.filter((p) => p.id !== selfId)
  if (others.length === 0) return null
  // 优先选筹码最少（输得起 PK）或闷牌玩家
  others.sort((a, b) => {
    if (a.isBlind !== b.isBlind) return a.isBlind ? -1 : 1
    return a.chips - b.chips
  })
  return others[0].id
}
