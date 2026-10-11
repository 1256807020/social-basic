<script setup lang="ts">
// 【动画组合 · @vueuse/motion】
// Vue 原生声明式动画库（Vue 版 framer-motion）：用「变体对象」描述 initial/enter 等状态，
// 框架自动生成过渡，无需手写 keyframes。下面用 useMotion 组合式函数驱动，
// 不依赖全局指令注册，SSR 安全。
import { useMotion } from '@vueuse/motion'
import { ref } from 'vue'

// 主标题：进入时淡入 + 上移 + 轻微缩放
const hero = ref<HTMLElement>()
const { motion: heroMotion, variant: heroVariant } = useMotion(hero, {
  initial: { opacity: 0, y: 50, scale: 0.92 },
  enter: { opacity: 1, y: 0, scale: 1, transition: { duration: 700, ease: 'easeOut' } },
})

// 三张卡片：不同轴 / 延迟，演示「声明式 stagger」
const cards = [
  { t: 'initial → enter', d: '声明式变体，零 keyframes', c: 'from-indigo-500 to-purple-500', axis: 'x', dist: -80, delay: 120 },
  { t: 'spring 缓动', d: '支持 spring / 物理弹性', c: 'from-emerald-500 to-teal-500', axis: 'y', dist: 80, delay: 260 },
  { t: '可被 JS 控制', d: 'variant.value 切换即可重放', c: 'from-rose-500 to-orange-500', axis: 'x', dist: 80, delay: 400 },
]
const refs = [ref<HTMLElement>(), ref<HTMLElement>(), ref<HTMLElement>()]
const motions = refs.map((el, i) =>
  useMotion(el, {
    initial: { opacity: 0, [cards[i].axis]: cards[i].dist },
    enter: { opacity: 1, [cards[i].axis]: 0, transition: { delay: cards[i].delay, duration: 600, ease: 'easeOut' } },
  }),
)

// 重放：先把所有变体切回 initial，下一帧再进入 enter
function replay() {
  heroVariant.value = 'initial'
  motions.forEach((m) => (m.variant.value = 'initial'))
  requestAnimationFrame(() => {
    heroVariant.value = 'enter'
    motions.forEach((m) => (m.variant.value = 'enter'))
  })
}
</script>

<template>
  <main class="min-h-screen bg-zinc-950 px-6 py-12 text-white">
    <div class="mx-auto max-w-3xl">
      <button
        class="mb-6 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20"
        @click="replay"
      >
        ↻ 重放动画
      </button>

      <div ref="hero" v-bind="heroMotion" class="mb-10">
        <h1 class="text-4xl font-black tracking-tight">@vueuse/motion</h1>
        <p class="mt-2 text-white/60">Vue 原生声明式动画：用变体对象描述状态，框架自动补间。</p>
      </div>

      <div class="grid gap-4 sm:grid-cols-3">
        <div
          v-for="(s, i) in cards"
          :key="i"
          :ref="(el) => (refs[i].value = el as HTMLElement)"
          v-bind="motions[i].motion"
          class="rounded-2xl bg-gradient-to-br p-6 shadow-lg"
          :class="s.c"
        >
          <h3 class="text-lg font-bold">{{ s.t }}</h3>
          <p class="mt-1 text-sm text-white/85">{{ s.d }}</p>
        </div>
      </div>

      <p class="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
        核心写法：<code class="text-indigo-300">useMotion(el, ｛ initial, enter ｝)</code>，
        模板里 <code class="text-indigo-300">v-bind="motion"</code> 即可；想重放就改
        <code class="text-indigo-300">variant.value</code>。覆盖 fade / slide / scale / spring 等。
      </p>
    </div>
  </main>
</template>
