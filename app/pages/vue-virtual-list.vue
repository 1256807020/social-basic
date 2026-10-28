<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 虚拟列表 / 无限滚动（手写窗口化，零依赖）
// ① 视角：从 React 转 Vue3（或纯 Vue3 起步）；虚拟列表心智两端一致（算窗口）。
// ② 实战定位：万级列表 / 下拉无限滚动必须窗口化，否则 DOM 爆炸卡死。
// ③ 学习模式：🔧 固定写法 = 容器撑总高 + 用 scrollTop 算 start/end + translateY 偏移；
//          👉 练习点 = 把 ITEM_H 改成动态高度（需测距缓存，本页固定高度讲清原理）。
// 📌 注意：只挂载「视口 + 缓冲」少量节点；总高度由撑满的占位 div 提供，列表用 translateY 偏移。
// 📌 类型：Row 是前端视图模型（与后端无关），用 interface 锁住自己写错，不引 any。
// ───────────────────────────────────────────────────────────
interface Row {
  id: number
  name: string
  note: string
}

const ITEM_H = 40 // 固定行高（练习点：改成动态需测距缓存）
const VIEWPORT_H = 420 // 视口高度
const BUFFER = 4 // 上下各多渲染几行，避免滚动白屏

// 数据量可调节：演示不同量级下「挂载的 DOM 节点数」始终恒定
const total = ref(10000)
const items = ref<Row[]>([])

function build(n: number): void {
  items.value = Array.from({ length: n }, (_, i) => ({
    id: i,
    name: `项目 #${i + 1}`,
    note: i % 2 ? '奇数行' : '偶数行',
  }))
}
build(total.value)

// ── 窗口化核心：scrollTop → startIndex/endIndex → 只切一段 ──
const scrollTop = ref(0)
const startIndex = computed(() =>
  Math.max(0, Math.floor(scrollTop.value / ITEM_H) - BUFFER),
)
const visibleCount = Math.ceil(VIEWPORT_H / ITEM_H) + BUFFER * 2
const endIndex = computed(() =>
  Math.min(items.value.length, startIndex.value + visibleCount),
)
const visible = computed(() => items.value.slice(startIndex.value, endIndex.value))
const offsetY = computed(() => startIndex.value * ITEM_H) // 整段向上偏移
const totalHeight = computed(() => items.value.length * ITEM_H) // 撑满总高

// 📌 把 :style 对象抽成计算属性，规避 vue-tsc 对行内 { transform } 字面量的类型误报
const viewportStyle = computed<Record<string, string>>(() => ({ height: `${VIEWPORT_H}px` }))
const spacerStyle = computed<Record<string, string>>(() => ({
  height: `${totalHeight.value}px`,
  position: 'relative',
}))
const listStyle = computed<Record<string, string>>(() => ({
  transform: `translateY(${offsetY.value}px)`,
}))
const rowStyle = computed<Record<string, string>>(() => ({ height: `${ITEM_H}px` }))

// 视口 ref：用于「跳转到指定行」程序化滚动
const viewportRef = ref<HTMLElement | null>(null)
const jumpIndex = ref(5000)

function onScroll(e: Event): void {
  // 📌 e.target 是 EventTarget，需收窄为 HTMLElement 才能取 scrollTop（编译期断言，非 any）
  scrollTop.value = (e.target as HTMLElement).scrollTop
}

function jumpTo(): void {
  const max = Math.max(0, items.value.length - 1)
  const idx = Math.min(Math.max(0, Math.floor(Number(jumpIndex.value) || 0)), max)
  if (viewportRef.value) {
    viewportRef.value.scrollTop = idx * ITEM_H // 改 scrollTop 会触发 onScroll 重算窗口
    scrollTop.value = viewportRef.value.scrollTop
  }
}

function applyTotal(): void {
  const n = Math.max(1, Math.floor(Number(total.value) || 1000))
  total.value = n
  build(n)
  scrollTop.value = 0
  if (viewportRef.value) viewportRef.value.scrollTop = 0
}

function scrollToTop(): void {
  if (viewportRef.value) {
    viewportRef.value.scrollTop = 0
    scrollTop.value = 0
  }
}
</script>

<template>
  <main class="min-h-screen bg-zinc-950 px-6 py-12 text-white">
    <div class="mx-auto max-w-xl">
      <h1 class="mb-2 text-3xl font-black">虚拟列表 · {{ total.toLocaleString() }} 行</h1>
      <p class="mb-6 text-white/60">
        只渲染视口内 DOM（当前挂载 <span class="font-bold text-emerald-400">{{ visible.length }}</span> 个节点，占总量的
        {{ ((visible.length / Math.max(1, total)) * 100).toFixed(2) }}%）。
      </p>

      <!-- 控制台：演示「数据量再大，挂载节点数恒定」这一核心卖点 -->
      <div class="mb-4 flex flex-wrap items-end gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <label class="flex flex-col text-xs text-white/60">
          数据总量
          <input
            v-model.number="total"
            type="number"
            min="1"
            class="mt-1 w-28 rounded bg-zinc-900 px-2 py-1 text-sm text-white outline-none ring-emerald-500/40 focus:ring-2"
          />
        </label>
        <button
          class="rounded bg-emerald-500 px-3 py-1.5 text-sm font-semibold hover:bg-emerald-400"
          @click="applyTotal"
        >
          重新生成
        </button>

        <label class="flex flex-col text-xs text-white/60">
          跳转到行号
          <input
            v-model.number="jumpIndex"
            type="number"
            min="0"
            class="mt-1 w-28 rounded bg-zinc-900 px-2 py-1 text-sm text-white outline-none ring-sky-500/40 focus:ring-2"
          />
        </label>
        <button
          class="rounded bg-sky-500 px-3 py-1.5 text-sm font-semibold hover:bg-sky-400"
          @click="jumpTo"
        >
          跳转
        </button>

        <button
          class="rounded bg-white/10 px-3 py-1.5 text-sm font-semibold hover:bg-white/20"
          @click="scrollToTop"
        >
          回到顶部
        </button>
      </div>

      <!-- 视口：固定高 + overflow-auto；内部占位 div 撑满总高，列表整体 translateY 偏移 -->
      <div
        ref="viewportRef"
        class="overflow-auto rounded-2xl border border-white/10 bg-white/5"
        :style="viewportStyle"
        @scroll="onScroll"
      >
        <div :style="spacerStyle">
          <div :style="listStyle">
            <div
              v-for="row in visible"
              :key="row.id"
              class="flex items-center justify-between border-b border-white/5 px-4 text-sm"
              :style="rowStyle"
            >
              <span class="font-medium">{{ row.name }}</span>
              <span class="text-white/50">{{ row.note }}</span>
            </div>
          </div>
        </div>
      </div>

      <p class="mt-3 text-xs text-white/40">
        🔧 原理：无论总量 1 万还是 100 万，挂载节点恒为 visibleCount≈{{ visibleCount }} 个；
        滚动时仅替换切片内容 + 偏移，DOM 不随总量增长。
      </p>
    </div>

    <details class="mx-auto mt-8 max-w-xl rounded border p-4 text-sm">
      <summary class="cursor-pointer font-semibold">Vue2 / Vue3 / React 三向对照 + 小结</summary>
      <table class="mt-2 w-full border-collapse text-left">
        <thead><tr class="border-b">
          <th class="px-2 py-1">维度</th><th class="px-2 py-1">Vue2 (Options)</th><th class="px-2 py-1">Vue3 (本页)</th><th class="px-2 py-1">React</th>
        </tr></thead>
        <tbody>
          <tr class="border-b"><td class="px-2 py-1">思路</td><td class="px-2 py-1">同（算窗口）</td><td class="px-2 py-1">scrollTop→start/end</td><td class="px-2 py-1">同（scrollTop→start/end）</td></tr>
          <tr class="border-b"><td class="px-2 py-1">偏移</td><td class="px-2 py-1">style.transform</td><td class="px-2 py-1">:style translateY</td><td class="px-2 py-1">style=&#123;&#123;transform&#125;&#125;</td></tr>
          <tr class="border-b"><td class="px-2 py-1">现成库</td><td class="px-2 py-1">vue-virtual-scroller</td><td class="px-2 py-1">vue-virtual-scroller / @tanstack/vue-virtual</td><td class="px-2 py-1">react-window / @tanstack/react-virtual</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-400">📝 小结：手写虚拟列表核心是「撑总高 + 算窗口 + 偏移」三步，两端一致；生产直接上 vue-virtual-scroller / react-window 更稳。本页零依赖仅为讲清原理。</p>
    </details>
  </main>
</template>
