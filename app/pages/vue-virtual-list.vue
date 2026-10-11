<script setup lang="ts">
// 【Vue3 能力 · 虚拟列表 / 无限滚动（手写窗口化，零依赖）】
// 渲染 10,000 行却只挂载「视口内 + 缓冲」的少量 DOM：
// 用 scrollTop 算出应显示的起止索引，容器撑满总高度，列表用 transform 偏移。
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
  </main>
</template>
