// 花色：黑桃 > 红心 > 方块 > 梅花
export const SUITS = ['spades', 'hearts', 'diamonds', 'clubs']

export const SUIT_SYMBOL = {
  spades: '♠',
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
}

export const SUIT_COLOR = {
  spades: 'text-navy',
  hearts: 'text-rose-500',
  diamonds: 'text-rose-500',
  clubs: 'text-navy',
}

export const SUIT_WEIGHT = {
  spades: 4,
  hearts: 3,
  diamonds: 2,
  clubs: 1,
}

// 点数 2-14（A=14）
export const RANKS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

export const RANK_LABEL = {
  2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9',
  10: '10', 11: 'J', 12: 'Q', 13: 'K', 14: 'A',
}

// 牌型枚举（数字越大越强）
export const HAND_TYPE = {
  HIGH_CARD: 0,
  PAIR: 1,
  STRAIGHT: 2,
  FLUSH: 3,
  STRAIGHT_FLUSH: 4,
  THREE_OF_A_KIND: 5,
}

export const HAND_TYPE_LABEL = {
  0: '散牌',
  1: '对子',
  2: '顺子',
  3: '金花',
  4: '顺金',
  5: '豹子',
}

// 游戏配置
export const GAME_CONFIG = {
  initialChips: 5000,
  maxRound: 8,             // 最大回合（防止无限加注）
  blindLimit: 4,           // 闷牌最多持续 4 轮
  raiseMultipliers: [1, 2, 5],
}

export const PERSONALITIES = ['steady', 'aggressive', 'cautious']

export const PERSONALITY_LABEL = {
  steady: '稳健',
  aggressive: '激进',
  cautious: '保守',
}

// AI 头像（占位 emoji，避免引入图片资源）
export const AI_AVATARS = ['🦊', '🐼', '🦉', '🐻', '🦁', '🐯', '🦄', '🐺']
export const AI_NAMES = ['老狐狸', '熊大爷', '夜猫子', '小诸葛', '冷面侠', '快枪手', '锦鲤君', '黑桃Q']
