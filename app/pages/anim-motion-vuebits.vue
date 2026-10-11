<script setup lang="ts">
// 【动画组合 4/9 · Motion（原 Framer Motion）+ React Bits（Vue 移植版）】
// 说明：React Bits 是 React 生态组件库（46.6K★），本仓库是 Nuxt/Vue，无法直接复用。
// 这里用「框架无关的 Motion One（vanilla）」承担声明式物理动效，并手写几个
// "Vue Bits 风格" 即拷即用组件（渐变文字 / 聚光灯卡片 / 跑马灯）作为对等替代。
// Motion One 为 ESM，经 module 脚本注入到 window.Motion。
useHead({
  script: [
    {
      type: 'module',
      innerHTML:
        "import * as M from 'https://cdn.jsdelivr.net/npm/motion@11/+esm'; window.Motion = M;",
    },
  ],
})

const reveal = ref<HTMLElement | null>(null)
const spotlight = ref<HTMLElement | null>(null)
const gradient = ref<HTMLElement | null>(null)

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

onMounted(async () => {
  try {
    const M: any = await waitFor(() => (window as any).Motion)
    // 1) 滚动入场（对应 React Bits 的 scroll reveal）
    if (reveal.value) {
      await M.animate(
        reveal.value,
        { opacity: [0, 1], y: [40, 0] },
        { duration: 0.8, easing: [0.22, 1, 0.36, 1], delay: 0.2 },
      )
    }
    // 2) 渐变文字循环流动
    if (gradient.value) {
      M.animate(
        gradient.value,
        { backgroundPosition: ['0% 50%', '100% 50%'] },
        { duration: 3, repeat: Infinity, easing: 'linear' },
      )
    }
    // 3) 聚光灯卡片：跟随鼠标移动径向高光
    if (spotlight.value) {
      spotlight.value.addEventListener('pointermove', (e: any) => {
        const r = spotlight.value!.getBoundingClientRect()
        spotlight.value!.style.setProperty('--mx', `${e.clientX - r.left}px`)
        spotlight.value!.style.setProperty('--my', `${e.clientY - r.top}px`)
      })
    }
  } catch (e: any) {
    console.warn('Motion 加载失败', e.message)
  }
})

const marqueeItems = ['Vue', 'Nuxt', 'Motion', 'GSAP', 'Three.js', 'D3', 'Lottie', 'Swiper']
</script>

<template>
  <main class="min-h-screen space-y-10 bg-zinc-950 p-8 text-white">
    <h1 ref="gradient"
      class="bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-400 bg-[length:200%_auto] bg-clip-text text-4xl font-black text-transparent">
      Motion One + Vue Bits 风格组件
    </h1>

    <section ref="reveal" class="rounded-2xl border border-white/10 bg-white/5 p-6">
      <p class="text-lg">滚动后淡入上移（Motion 声明式物理动效）。</p>
    </section>

    <!-- Vue Bits 风格：聚光灯卡片 -->
    <section ref="spotlight"
      class="relative overflow-hidden rounded-2xl border border-white/10 p-8"
      style="background: radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(99,102,241,.25), transparent 40%), #111;">
      <h2 class="text-2xl font-bold">聚光灯卡片（Spotlight）</h2>
      <p class="mt-2 text-white/70">移动鼠标，高光跟随光标 —— React Bits「Spotlight Card」的 Vue 移植。</p>
    </section>

    <!-- Vue Bits 风格：跑马灯 -->
    <section class="overflow-hidden rounded-2xl border border-white/10 py-4">
      <div class="marquee flex w-max gap-8">
        <span v-for="(t, i) in [...marqueeItems, ...marqueeItems]" :key="i" class="text-xl font-semibold text-white/80">
          {{ t }} ✦
        </span>
      </div>
    </section>
  </main>
</template>

<style scoped>
.marquee {
  animation: marquee 12s linear infinite;
}
:global(@keyframes marquee) {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
</style>
