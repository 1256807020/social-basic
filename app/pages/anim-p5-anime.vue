<script setup lang="ts">
// 【动画组合 8/9 · p5.js + Anime.js】
// 创意编程组合：p5.js 负责 Canvas 原生图形绘制（生成式波纹），Anime.js 编排图形参数（色相）的序列动画，
// p5 每帧读取 Anime 写入的共享状态，快速实现艺术向生成式动效作品。
useHead({
  script: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js' },
  ],
})

const host = ref<HTMLElement | null>(null)

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
    const p5: any = await waitFor(() => (window as any).p5)
    const anime: any = await waitFor(() => (window as any).anime)

    // 共享状态：Anime 编排 hue 循环，p5 每帧消费
    const state = { hue: 200 }

    const sketch = (s: any) => {
      s.setup = () => {
        const c = s.createCanvas(600, 400)
        c.parent(host.value!)
        s.colorMode(s.HSB, 360, 100, 100, 100)
        s.noFill()
      }
      s.draw = () => {
        s.background(10, 10, 12)
        s.stroke(state.hue, 80, 100, 60)
        const t = s.frameCount * 0.03
        for (let i = 0; i < 10; i++) {
          const r = 20 + i * 14 + Math.sin(t + i) * 10
          s.strokeWeight(2)
          s.ellipse(s.width / 2, s.height / 2, r * 2, r * 2)
        }
      }
    }
    new p5(sketch)

    // Anime 循环动画共享状态（色相在 200↔320 间往返）
    anime({ targets: state, hue: [200, 320], duration: 3000, direction: 'alternate', loop: true, easing: 'easeInOutSine' })
  } catch (e: any) {
    console.warn('p5/Anime 加载失败', e.message)
  }
})
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950">
    <h1 class="text-2xl font-bold text-white">p5.js 生成式图形 × Anime.js 参数编排</h1>
    <div ref="host" class="overflow-hidden rounded-2xl border border-white/10"></div>
    <p class="text-sm text-white/60">色相由 Anime.js 循环驱动，p5 每帧渲染。</p>
  </main>
</template>
