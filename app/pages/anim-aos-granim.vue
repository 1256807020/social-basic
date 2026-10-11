<script setup lang="ts">
// 【动画组合 6/9 · AOS.js + Granim.js】
// 轻量落地页动效：AOS 实现元素滚动入场动画，Granim.js 生成交互式动态渐变背景，
// 零复杂配置即可提升普通页面的视觉质感。
useHead({
  link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css' }],
  script: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/granim/2.0.0/granim.min.js' },
  ],
})

const bg = ref<HTMLCanvasElement | null>(null)

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
    const AOS: any = await waitFor(() => (window as any).AOS)
    const Granim: any = await waitFor(() => (window as any).Granim)
    AOS.init({ duration: 900, once: false })
    new Granim({
      element: bg.value!,
      name: 'granim',
      direction: 'diagonal',
      opacity: [0.9, 0.7],
      states: {
        'default-state': { gradients: [['#ff6ec4', '#7873f5'], ['#43e97b', '#38f9d7'], ['#fa709a', '#fee140']] },
      },
    })
  } catch (e: any) {
    console.warn('AOS/Granim 加载失败', e.message)
  }
})
</script>

<template>
  <main class="relative min-h-screen overflow-hidden text-white">
    <canvas ref="bg" class="fixed inset-0 -z-10 h-full w-full"></canvas>
    <div class="mx-auto max-w-3xl space-y-24 py-32">
      <section data-aos="fade-up" class="rounded-2xl bg-black/30 p-8 backdrop-blur">
        <h2 class="text-3xl font-bold">区块 A · 淡入上移</h2>
        <p class="mt-2 text-white/80">AOS `fade-up` 滚动入场。</p>
      </section>
      <section data-aos="fade-left" data-aos-delay="100" class="rounded-2xl bg-black/30 p-8 backdrop-blur">
        <h2 class="text-3xl font-bold">区块 B · 从左滑入</h2>
        <p class="mt-2 text-white/80">AOS `fade-left` + 延迟。</p>
      </section>
      <section data-aos="zoom-in" data-aos-delay="200" class="rounded-2xl bg-black/30 p-8 backdrop-blur">
        <h2 class="text-3xl font-bold">区块 C · 缩放进入</h2>
        <p class="mt-2 text-white/80">AOS `zoom-in`。</p>
      </section>
    </div>
  </main>
</template>
