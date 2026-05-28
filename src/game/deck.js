import { SUITS, RANKS } from './constants.js'

export function createDeck() {
  const deck = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank, id: `${suit}-${rank}` })
    }
  }
  return deck
}

// Fisher-Yates 洗牌
export function shuffle(deck) {
  const a = deck.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 给 N 个玩家各发 3 张牌
export function deal(playerCount, cardsPerPlayer = 3) {
  const deck = shuffle(createDeck())
  const hands = Array.from({ length: playerCount }, () => [])
  // 模拟真实发牌：一人一张轮流
  for (let i = 0; i < cardsPerPlayer; i++) {
    for (let p = 0; p < playerCount; p++) {
      hands[p].push(deck.pop())
    }
  }
  return { hands, remaining: deck }
}
