<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 虚拟列表 / 无限滚动（手写窗口化，零依赖）
// ① 视角：从 React 转 Vue3（或纯 Vue3 起步）；虚拟列表心智两端一致（算窗口）。
// ② 实战定位：万级列表/下拉无限滚动必须窗口化，否则 DOM 爆炸卡死。
// ③ 学习模式：🔧 固定写法 = 容器撑总高 + 用 scrollTop 算 start/end + transform 偏移；
//          👉 练习点 = 把 ITEM_H 改成动态高度（需测距缓存）。
// 📌 注意：只挂载「视口 + 缓冲」少量节点；总高度由撑满的占位 div 提供，列表用 translateY 偏移。
// ───────────────────────────────────────────────────────────
const TOTAL = 10000
const ITEM_H = 40
const VIEWPORT_H = 420
const BUFFER = 4 // 上下各多渲染几行，避免滚动白屏

const all = Array.from({ length: TOTAL }, (_, i) => ({
  id: i,
  name: `项目 #${i + 1}`,
  note: i % 2 ? '奇数行' : '偶数行',
}))

const scrollTop = ref(0)
const startIndex = computed(() => Math.max(0, Math.floor(scrollTop.value / ITEM_H) - BUFFER))
const visibleCount = Math.ceil(VIEWPORT_H / ITEM_H) + BUFFER * 2
const endIndex = computed(() => Math.min(TOTAL, startIndex.value + visibleCount))
const visible = computed(() => all.slice(startIndex.value, endIndex.value))
const offsetY = computed(() => startIndex.value * ITEM_H)

function onScroll(e: Event) {
  scrollTop.value = (e.target as HTMLElement).scrollTop
}
</script>

<template>
  <main class="min-h-screen bg-zinc-950 px-6 py-12 text-white">
    <div class="mx-auto max-w-xl">
      <h1 class="mb-2 text-3xl font-black">虚拟列表 · {{ TOTAL.toLocaleString() }} 行</h1>
      <p class="mb-6 text-white/60">只渲染视口内 DOM（当前约 {{ visible.length }} 个节点）。</p>

      <div
        class="overflow-auto rounded-2xl border border-white/10 bg-white/5"
        :style="{ height: VIEWPORT_H + 'px' }"
        @scroll="onScroll"
      >
        <div :style="{ height: TOTAL * ITEM_H + 'px', position: 'relative' }">
          <div :style="{ transform: `translateY(${offsetY}px)` }">
            <div
              v-for="row in visible"
              :key="row.id"
              class="flex items-center justify-between border-b border-white/5 px-4 text-sm"
              :style="{ height: ITEM_H + 'px' }"
            >
              <span class="font-medium">{{ row.name }}</span>
              <span class="text-white/50">{{ row.note }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  <details class="mt-8 rounded border p-4 text-sm">
    <summary class="cursor-pointer font-semibold">Vue2 / Vue3 / React 三向对照 + 小结</summary>
    <table class="mt-2 w-full border-collapse text-left">
      <thead><tr class="border-b">
        <th class="px-2 py-1">维度</th><th class="px-2 py-1">Vue2 (Options)</th><th class="px-2 py-1">Vue3 (本页)</th><th class="px-2 py-1">React</th>
      </tr></thead>
      <tbody>
        <tr class="border-b"><td class="px-2 py-1">思路</td><td class="px-2 py-1">同（算窗口）</td><td class="px-2 py-1">scrollTop→start/end</td><td class="px-2 py-1">同（scrollTop→start/end）</td></tr>
        <tr class="border-b"><td class="px-2 py-1">偏移</td><td class="px-2 py-1">style.transform</td><td class="px-2 py-1">:style translateY</td><td class="px-2 py-1">style={{transform}}</td></tr>
        <tr class="border-b"><td class="px-2 py-1">现成库</td><td class="px-2 py-1">vue-virtual-scroller</td><td class="px-2 py-1">vue-virtual-scroller / @tanstack/vue-virtual</td><td class="px-2 py-1">react-window / @tanstack/react-virtual</td></tr>
      </tbody>
    </table>
    <p class="mt-2 text-gray-400">📝 小结：手写虚拟列表核心是「撑总高 + 算窗口 + 偏移」三步，两端一致；生产直接上 vue-virtual-scroller / react-window 更稳。本页零依赖仅为讲清原理。</p>
  </details>
</main>
</template>
