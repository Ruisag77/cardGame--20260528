# CLEAR_CARD · 炸金花

一个磨砂玻璃质感的炸金花（Three Card Brag）单机网站，挑战三种性格的 AI 对手，纯娱乐、零真金。
---

## 特性

- 🎨 **磨砂玻璃 + 粉彩渐变** 的高级美学，三个页面统一视觉语言
- 🃏 **完整炸金花玩法**：闷牌 / 看牌 / 跟注 / 加注 / 比牌 / 弃牌
- 🧠 **三种 AI 人格**（稳健 / 激进 / 保守），决策风格各异
- ✨ **流畅微动画**：发牌 3D 翻面、当前玩家高亮脉动、彩池数字弹性、比牌摊牌弹窗
- 🪙 **本地金币系统**：localStorage 持久化，每日签到 +1000
- 🌐 **纯前端、零后端**，可静态部署到任意 CDN

---

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview
```

> 需要 Node.js ≥ 18

---

## 页面结构

| 路由 | 页面 | 内容 |
|------|------|------|
| `/` | **Landing** | Hero 浮动扑克牌 / 4 大特性 / 6 种牌型说明 / 金币成长曲线 / 玩家评价 |
| `/lobby` | **大厅** | 玩家信息 + 每日签到 + 4 档房间（新手村 / 进阶馆 / 高手局 / 富豪厅） |
| `/table?ante=&ai=` | **牌桌** | 椭圆玻璃桌面 + 玩家座位 + 操作面板 + 实时行动日志 |

---

## 游戏规则

### 牌型大小（从大到小）

| 等级 | 牌型 | 说明 | 示例 |
|------|------|------|------|
| T1 | 豹子 | 三张同点 | A♠ A♥ A♦ |
| T2 | 顺金 | 同花色连续三张 | 9♥ 10♥ J♥ |
| T3 | 金花 | 三张同花色非连续 | 2♠ 7♠ K♠ |
| T4 | 顺子 | 连续三张不同花 | 5♣ 6♦ 7♥ |
| T5 | 对子 | 两张同点 + 一张杂牌 | Q♠ Q♥ 3♦ |
| T6 | 散牌 | 比最大单张 | A♠ 9♦ 4♣ |

**特殊约定**
- 顺子：`A-K-Q` 最大 > `K-Q-J` > … > `4-3-2` > `A-2-3`（最小）
- 同牌型平点数时再比花色：黑桃 > 红心 > 方块 > 梅花

### 下注与回合

- **底注（Ante）**：每人开局自动下入彩池
- **闷牌**（不看牌）：跟注 = 当前注码 × 1
- **看牌**：跟注 = 当前注码 × 2，从此回合开始所有费用翻倍
- **加注**：可选 1× / 2× / 5× 三档
- **比牌（PK）**：直接与某玩家摊牌，输者出局
- **弃牌**：放弃本轮，已下注码沉入彩池
- **封顶轮（8 轮）**：到达后强制摊牌；闷牌轮上限 4 轮，超过后强制看牌
- 只剩一人时该玩家直接获胜

---

## AI 人格

| 性格 | 特征 |
|------|------|
| **稳健** | 弱牌闷牌+小跟，中等牌偶尔加注，强牌主动比牌 |
| **激进** | 高频加注，常虚张声势，看牌后更激进，敢于诈唬 |
| **保守** | 弱牌易弃，仅强牌跟注，少加注，等强势对决 |

决策因子：手牌强度、跟注金额相对自身筹码比例、剩余玩家数、是否已看牌、当前轮数。

---

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | React 18 + React Router 6 |
| 构建 | Vite 5 |
| 样式 | Tailwind CSS 3（自定义磨砂玻璃 / 粉彩 / 皇家蓝 / 金色 token） |
| 动画 | Framer Motion 11 |
| 状态 | Zustand 4（含 `persist` 中间件） |
| 字体 | Playfair Display（标题）+ Inter（正文） |

**构建尺寸**：JS 338 KB（gzip 110 KB） · CSS 30 KB（gzip 6 KB）

---

## 项目结构

```
cardGame/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx                # 入口 + 路由
    ├── App.jsx                 # 全局布局 + 背景
    ├── index.css               # Tailwind + 玻璃工具类
    │
    ├── pages/
    │   ├── Landing.jsx         # 落地页（聚合 7 个 section）
    │   ├── Lobby.jsx           # 大厅
    │   └── Table.jsx           # 牌桌
    │
    ├── components/
    │   ├── ui/                 # GlassCard / PrimaryButton / MeshBackground
    │   ├── landing/            # Header / Hero / FeatureGrid / RulesSection /
    │   │                       # GrowthChart / Testimonials / Footer
    │   ├── lobby/              # PlayerProfile / RoomCard
    │   └── game/               # PokerCard / PlayerSeat / PotDisplay /
    │                           # BettingPanel / CompareModal / ResultModal /
    │                           # ActionLog
    │
    ├── game/                   # 纯函数游戏引擎（可独立单测）
    │   ├── constants.js        # 花色、点数、牌型枚举
    │   ├── deck.js             # 牌堆 + 洗牌 + 发牌
    │   ├── evaluator.js        # 牌型识别 + 比较 + 强度评分
    │   └── ai.js               # AI 决策（含三种性格）
    │
    └── store/
        └── gameStore.js        # Zustand：游戏状态机 + 回合循环
```

---

## 关键设计

### 游戏状态机（`src/store/gameStore.js`）

```
idle → dealing → playing → showdown → idle
                 ↑    ↓
                 └────┘ （多个玩家轮询）
```

- `_advanceTurn()` 推进到下一个未弃牌玩家，回到队首则 round+1
- `_maybeAITurn()` 在 AI 回合自动延迟 900-1800ms 调用 `decideAction()`
- 闷牌/看牌、跟注、加注、比牌、弃牌全部通过统一入口 `playerAction(id, action, payload)`

### 牌型评估（`src/game/evaluator.js`）

```js
evaluateHand([{suit:'spades',rank:14}, ...])
// → { type, primary, kickers, suitWeight }

compareHands(handA, handB)  // → 1 / 0 / -1
handStrength(cards)         // → 0-1 区间评分，供 AI 使用
```

### 设计 Token

| Token | 值 |
|-------|----|
| `bg.mist-blue` | `#E0F2FE` |
| `bg.mist-peach` | `#FFEDD5` |
| `bg.mist-mint` | `#D1FAE5` |
| `text.navy` | `#0f172a` |
| `accent.royal` | `#1d4ed8` |
| `accent.gold` | `#f59e0b` |
| `.glass` | `bg-white/60 backdrop-blur-xl border border-white/50 shadow-glass` |

---

## 范围边界

本期明确**不做**以下内容：

- ❌ 真人多人联机（需要 WebSocket 后端）
- ❌ 注册登录、账号系统
- ❌ 充值、商城、皮肤系统
- ❌ 移动端深度适配（桌面端为主）
- ❌ 音效
- ❌ 多语言

---

## 免责声明

CLEAR_CARD 是一个**纯娱乐、零真金**的单机牌类游戏 demo：

- 游戏内金币**没有任何现实价值**
- 禁止任何形式的金币兑换、交易或灰色变现
- 请未成年人在监护人陪同下使用
- 仅供学习、设计参考及个人娱乐用途

---

## License

MIT © 2026 CLEAR_CARD
