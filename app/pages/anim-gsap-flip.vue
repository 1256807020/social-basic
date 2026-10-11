<script setup lang="ts">
// 【动画组合 · GSAP Flip 插件】
// Flip = "First, Last, Invert, Play"：记录元素「变化前」与「变化后」的位置，
// 自动补间出平滑的布局过渡。典型场景：列表重排、展开收起、网格↔详情。
// 这里点击「打乱顺序」，GSAP Flip 让方块丝滑换位（库走 CDN，与现有动画 demo 一致）。
useHead({
  script: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/Flip.min.js' },
  ],
})

const boxes = ref(
  Array.from({ length: 9 }, (_, i) => ({
    id: i,
    c: ['bg-indigo-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-sky-500', 'bg-fuchsia-500'][i % 6],
  })),
)
const grid = ref<HTMLElement>()

function waitFor(getter: () => any, timeout = 8000) {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const tick = () => {
      const v = getter()
      if (v) return resolve(v)
      if (Date.now() - start > timeout) return reject(new Error('库加载超时'))
      requestAnimationFrame(tick)
    }
    tick()
  })
}

async function shuffle() {
  const gsap: any = await waitFor(() => (window as any).gsap)
  const Flip: any = await waitFor(() => (window as any).Flip)
  gsap.registerPlugin(Flip)

  // 1) First：记录当前位置
  const state = Flip.getState(grid.value!.querySelectorAll('.box'))
  // 2) Last：改变数据顺序（DOM 随之重排）
  boxes.value = [...boxes.value].sort(() => Math.random() - 0.5)
  // 3) Invert + Play：下一帧对比差异并补间
  await nextTick()
  Flip.from(state, { duration: 0.6, ease: 'power1.inOut', absolute: true, stagger: 0.03 })
}
</script>

<template>
  <main class="min-h-screen bg-zinc-950 px-6 py-12 text-white">
    <div class="mx-auto max-w-2xl">
      <h1 class="mb-2 text-3xl font-black">GSAP Flip · 布局动画</h1>
      <p class="mb-6 text-white/60">点击打乱，方块会平滑换位而非瞬移。</p>

      <button
        class="mb-8 rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-semibold transition hover:bg-indigo-400"
        @click="shuffle"
      >
        🔀 打乱顺序
      </button>

      <div ref="grid" class="grid grid-cols-3 gap-4">
        <div
          v-for="b in boxes"
          :key="b.id"
          class="box flex aspect-square items-center justify-center rounded-2xl text-2xl font-black text-white/90"
          :class="b.c"
        >
          {{ b.id + 1 }}
        </div>
      </div>
    </div>
  </main>
</template>
