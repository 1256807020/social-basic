<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（动画篇）· GSAP Flip 插件（布局过渡）
// ① 视角/切入点：GSAP Flip = "First, Last, Invert, Play"，记录元素「变化前/后」位置并自动补间，
//    对照 Vue2（mounted 里操作 DOM）/ Vue3（<Transition> 只能做进入离开，做不了布局重排）/ React（framer-motion layout 属性）。
// ② 实战定位：列表重排、展开收起、网格↔列表/详情 这类「容器尺寸或兄弟顺序变了」的平滑过渡，
//    用 Flip 一行 `Flip.from(state, ...)` 替代手写 getBoundingClientRect + 反向 transform。
// ③ 学习模式：🔧固定写法 = Flip.getState(targets) 拍快照 → 改数据/DOM → Flip.from(state, vars)；
//    👉练习点 = 把 vars 的 absolute / stagger / ease 改掉体会差异（absolute 防止重排时重叠抖动）。
// 文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, nextTick, onMounted } from 'vue'
import { gsap } from 'gsap'
import { Flip } from 'gsap/Flip'

// 🔧 固定写法：注册插件（只做一次，不碰 DOM，SSR 安全）
gsap.registerPlugin(Flip)

// 6 种配色（as const 锁字面量；索引用 ! 兜底 noUncheckedIndexedAccess）
const COLORS = [
  'bg-indigo-500',
  'bg-emerald-500',
  'bg-rose-500',
  'bg-amber-500',
  'bg-sky-500',
  'bg-fuchsia-500',
] as const

interface Box {
  id: number
  c: string
}

// 初始 9 宫格（本地状态演示，纯前端知识点，不接 /api）
const boxes = ref<Box[]>(
  Array.from({ length: 9 }, (_, i) => ({ id: i, c: COLORS[i % COLORS.length]! })),
)
// 布局模式：grid=3 列方格，list=单列长条（演示「网格↔列表」切换）
const layout = ref<'grid' | 'list'>('grid')
const gridEl = ref<HTMLElement | null>(null)

// 取所有待补间的方块节点（类型化 NodeList）
function boxNodes(): HTMLElement[] {
  if (!gridEl.value) return []
  return Array.from(gridEl.value.querySelectorAll<HTMLElement>('.box'))
}

// demo1：打乱顺序（First 拍快照 → 改数组顺序使 DOM 重排 → Invert+Play 补间）
async function shuffle() {
  if (!gridEl.value) return
  const state = Flip.getState(boxNodes()) // 1) First：记录当前位置
  boxes.value = [...boxes.value].sort(() => Math.random() - 0.5) // 2) Last：改顺序，DOM 随之重排
  await nextTick() // 等 Vue 把新顺序渲染进 DOM
  Flip.from(state, { duration: 0.6, ease: 'power1.inOut', absolute: true, stagger: 0.03 }) // 3) Invert+Play
}

// demo2：布局切换（网格 ↔ 列表），Flip 让方块平滑伸缩/换位而非瞬变
async function toggleLayout() {
  if (!gridEl.value) return
  const state = Flip.getState(boxNodes())
  layout.value = layout.value === 'grid' ? 'list' : 'grid'
  await nextTick()
  Flip.from(state, { duration: 0.5, ease: 'power2.inOut', absolute: true })
}

onMounted(() => {
  // 进入即播放一次「从列表→网格」的入场，直观看到 Flip 能力（可选演示）
  if (gridEl.value) {
    const state = Flip.getState(boxNodes())
    layout.value = 'grid'
    requestAnimationFrame(() => {
      Flip.from(state, { duration: 0.5, ease: 'power2.out', absolute: true })
    })
  }
})
</script>

<template>
  <main class="min-h-screen bg-zinc-950 px-6 py-12 text-white">
    <div class="mx-auto max-w-2xl">
      <h1 class="mb-2 text-3xl font-black">GSAP Flip · 布局动画</h1>
      <p class="mb-6 text-white/60">
        Flip 记录元素「变化前/后」位置并自动补间。下面两个场景都用它：方块丝滑换位、网格↔列表平滑切换。
      </p>

      <div class="mb-8 flex gap-3">
        <button
          class="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold transition hover:bg-indigo-400 active:scale-95"
          @click="shuffle"
        >
          🔀 打乱顺序
        </button>
        <button
          class="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold transition hover:bg-emerald-400 active:scale-95"
          @click="toggleLayout"
        >
          ▦ 切换布局（{{ layout === 'grid' ? '网格 → 列表' : '列表 → 网格' }}）
        </button>
      </div>

      <!-- :class 动态切 grid-cols-3 / grid-cols-1，Flip 负责补间 -->
      <div ref="gridEl" class="grid gap-4" :class="layout === 'grid' ? 'grid-cols-3' : 'grid-cols-1'">
        <div
          v-for="b in boxes"
          :key="b.id"
          class="box flex aspect-square items-center justify-center rounded-2xl text-2xl font-black text-white/90"
          :class="[b.c, layout === 'list' ? '!aspect-auto !h-14' : '']"
        >
          {{ b.id + 1 }}
        </div>
      </div>
    </div>

    <details class="mx-auto mt-10 max-w-2xl rounded border border-white/10 p-3 text-sm text-white/80">
      <summary class="cursor-pointer font-semibold">📚 Vue2 / Vue3 / React 三向对照 & 本项目小结</summary>
      <table class="mt-3 w-full border-collapse text-left">
        <thead>
          <tr class="border-b border-white/20">
            <th class="px-2 py-1">维度</th>
            <th class="px-2 py-1">Vue2 / Vue3</th>
            <th class="px-2 py-1">React</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-white/10"><td class="px-2 py-1">布局过渡方案</td><td class="px-2 py-1">GSAP Flip（本页）</td><td class="px-2 py-1">framer-motion layout 属性</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">内置能力</td><td class="px-2 py-1">&lt;Transition&gt; 只做进入/离开</td><td class="px-2 py-1">&lt;AnimatePresence&gt; 同左</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">核心三步</td><td class="px-2 py-1">getState → 改 DOM → Flip.from</td><td class="px-2 py-1">layout + 自动补间</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">防重叠抖动</td><td class="px-2 py-1">vars.absolute: true</td><td class="px-2 py-1">layout 内部处理</td></tr>
        </tbody>
      </table>
      <p class="mt-3 text-white/50">
        📝 小结：Flip 的卖点是「我不管你为什么位移/缩放，只要前后快照不同就补间」。传统做法要自己
        getBoundingClientRect 算差再 reverse transform，Flip 把这套 First-Last-Invert-Play 封装好了。
        易错点：① 必须在改 DOM <b>之后</b>、且等 nextTick 渲染完再 Flip.from；② 重排期间兄弟元素互相挤压时加
        <code>absolute: true</code> 让元素脱离文档流，避免抖动；③ 插件要先 <code>gsap.registerPlugin(Flip)</code>。
      </p>
    </details>
  </main>
</template>
