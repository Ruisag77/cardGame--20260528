import { HAND_TYPE, SUIT_WEIGHT } from './constants.js'

// 检查是否为顺子，返回 {isStraight, topRank}
// 特殊：A-2-3 算最小顺子（topRank=3）；Q-K-A 最大（topRank=14）
function checkStraight(sortedRanks) {
  const [a, b, c] = sortedRanks // 升序
  // A-2-3
  if (a === 2 && b === 3 && c === 14) return { isStraight: true, topRank: 3 }
  // 普通顺子
  if (b === a + 1 && c === b + 1) return { isStraight: true, topRank: c }
  return { isStraight: false, topRank: 0 }
}

/**
 * 评估三张牌的牌型
 * 返回: { type, primary, kickers, suitWeight }
 *   type: HAND_TYPE 枚举
 *   primary: 主要点数（顺子的顶点 / 对子点数 / 豹子点数 / 最大单张）
 *   kickers: 次要比较数组（按降序）
 *   suitWeight: 最大花色权重（用于平局兜底）
 */
export function evaluateHand(cards) {
  const ranks = cards.map((c) => c.rank).sort((a, b) => a - b)
  const suits = cards.map((c) => c.suit)
  const sameSuit = suits.every((s) => s === suits[0])

  const [r1, r2, r3] = ranks
  const maxSuitWeight = Math.max(...cards.map((c) => SUIT_WEIGHT[c.suit]))

  // 豹子
  if (r1 === r2 && r2 === r3) {
    return {
      type: HAND_TYPE.THREE_OF_A_KIND,
      primary: r1,
      kickers: [],
      suitWeight: maxSuitWeight,
    }
  }

  const straight = checkStraight(ranks)

  // 顺金
  if (sameSuit && straight.isStraight) {
    return {
      type: HAND_TYPE.STRAIGHT_FLUSH,
      primary: straight.topRank,
      kickers: [],
      suitWeight: SUIT_WEIGHT[suits[0]],
    }
  }

  // 金花
  if (sameSuit) {
    return {
      type: HAND_TYPE.FLUSH,
      primary: r3,
      kickers: [r2, r1],
      suitWeight: SUIT_WEIGHT[suits[0]],
    }
  }

  // 顺子
  if (straight.isStraight) {
    return {
      type: HAND_TYPE.STRAIGHT,
      primary: straight.topRank,
      kickers: [],
      suitWeight: maxSuitWeight,
    }
  }

  // 对子
  if (r1 === r2 || r2 === r3 || r1 === r3) {
    let pairRank, kicker
    if (r1 === r2) {
      pairRank = r1
      kicker = r3
    } else if (r2 === r3) {
      pairRank = r2
      kicker = r1
    } else {
      pairRank = r1
      kicker = r2
    }
    return {
      type: HAND_TYPE.PAIR,
      primary: pairRank,
      kickers: [kicker],
      suitWeight: maxSuitWeight,
    }
  }

  // 散牌
  return {
    type: HAND_TYPE.HIGH_CARD,
    primary: r3,
    kickers: [r2, r1],
    suitWeight: maxSuitWeight,
  }
}

/**
 * 比较两手牌：返回 1 (A 胜), -1 (B 胜), 0 (极少数情况完全平)
 */
export function compareHands(handA, handB) {
  const a = handA.eval ?? evaluateHand(handA)
  const b = handB.eval ?? evaluateHand(handB)
  if (a.type !== b.type) return a.type > b.type ? 1 : -1
  if (a.primary !== b.primary) return a.primary > b.primary ? 1 : -1
  for (let i = 0; i < a.kickers.length; i++) {
    if (a.kickers[i] !== b.kickers[i]) return a.kickers[i] > b.kickers[i] ? 1 : -1
  }
  if (a.suitWeight !== b.suitWeight) return a.suitWeight > b.suitWeight ? 1 : -1
  return 0
}

/**
 * 0-1 区间的强度评分，用于 AI 决策
 */
export function handStrength(cards) {
  const e = evaluateHand(cards)
  // 牌型分（0-5 映射到 0-0.83）
  const typeScore = e.type / 6
  // 点数分（2-14 映射到 0-0.17）
  const rankScore = ((e.primary - 2) / 12) * (1 / 6)
  return Math.min(1, typeScore + rankScore)
}
