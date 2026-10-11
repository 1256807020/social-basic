<script setup lang="ts">
// 【动画组合 9/9 · Swiper + GSAP】
// 滑动交互增强：Swiper 提供成熟的移动/PC 滑动切换，GSAP 绑定滑动进度/切换事件，
// 同步驱动页面内 DOM/SVG 动效，实现丝滑沉浸式滑动叙事。
useHead({
  link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.1.14/swiper-bundle.min.css' }],
  script: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.1.14/swiper-bundle.min.js' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js' },
  ],
})

const el = ref<HTMLElement | null>(null)

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
    const Swiper: any = await waitFor(() => (window as any).Swiper)
    const gsap: any = await waitFor(() => (window as any).gsap)

    const swiper = new Swiper(el.value!, {
      slidesPerView: 1,
      loop: true,
      pagination: { el: '.swiper-pagination', clickable: true },
      on: {
        slideChangeTransitionStart: () => {
          const active = el.value!.querySelector('.swiper-slide-active .content')
          if (active) gsap.fromTo(active, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' })
        },
      },
    })
    // 绑定滑动进度 → 顶部进度条（GSAP 驱动）
    swiper.on('progress', (sw: any) => {
      const bar = el.value!.querySelector('#prog') as HTMLElement
      if (bar) bar.style.width = `${sw.progress * 100}%`
    })
  } catch (e: any) {
    console.warn('Swiper/GSAP 加载失败', e.message)
  }
})

const slides = [
  { c: 'from-rose-500 to-orange-400', t: '第一幕', d: '滑动切换 · GSAP 驱动内容入场' },
  { c: 'from-sky-500 to-cyan-400', t: '第二幕', d: '沉浸式滑动叙事体验' },
  { c: 'from-violet-500 to-fuchsia-400', t: '第三幕', d: 'Swiper × GSAP 黄金组合' },
]
</script>

<template>
  <main class="min-h-screen bg-zinc-950 py-10 text-white">
    <div class="mx-auto max-w-3xl">
      <div class="mb-2 h-1 w-full overflow-hidden rounded bg-white/10">
        <div id="prog" class="h-full bg-white" style="width: 0%"></div>
      </div>
      <div ref="el" class="swiper overflow-hidden rounded-2xl">
        <div class="swiper-wrapper">
          <div v-for="(s, i) in slides" :key="i" class="swiper-slide">
            <div class="content flex h-72 flex-col items-center justify-center gap-3 bg-gradient-to-br p-10" :class="s.c">
              <h2 class="text-4xl font-black">{{ s.t }}</h2>
              <p class="text-lg">{{ s.d }}</p>
            </div>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
      <p class="mt-3 text-center text-sm text-white/60">← 拖拽 / 滑动 / 点圆点切换 →</p>
    </div>
  </main>
</template>
