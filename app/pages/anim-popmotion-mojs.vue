<script setup lang="ts">
// 【动画组合 7/9 · Popmotion + Mo.js】
// 运动图形创意组合：Popmotion 提供物理动效（此处用 spring 弹性回弹），
// Mo.js 生成自定义粒子爆发特效；适合高互动品牌创意站。点击球体观察两类特效叠加。
// 两者均走 cdnjs 的 UMD 构建（本环境 jsdelivr/unpkg 不可达），全局为 window.mojs / window.popmotion。
useHead({
  script: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/mo-js/1.7.1/mo.umd.js' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/popmotion/11.0.5/popmotion.min.js' },
  ],
})

const ball = ref<HTMLElement | null>(null)
const status = ref('点击球体')

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
    const P: any = await waitFor(() => (window as any).popmotion)
    const mojs: any = await waitFor(() => (window as any).mojs)

    const burst = new mojs.Burst({
      left: 0, top: 0, radius: { 0: 80 }, count: 12,
      children: { shape: 'circle', fill: [{ '#ff6ec4': '#7873f5' }], scale: { 1: 0 }, duration: 900 },
    })

    ball.value!.addEventListener('pointerdown', (e: any) => {
      status.value = 'Popmotion 弹性 + Mo.js 粒子爆发'
      // Popmotion：spring 物理回弹
      P.animate({
        from: 1, to: 0, type: 'spring', stiffness: 260, damping: 12,
        onUpdate: (v: number) => { if (ball.value) ball.value.style.transform = `scale(${0.7 + v * 0.3})` },
      })
      // Mo.js：在点击位置爆发粒子
      const r = ball.value!.getBoundingClientRect()
      burst.tune({ x: r.left + r.width / 2, y: r.top + r.height / 2 }).replay()
    })
  } catch (e: any) {
    status.value = '加载失败：' + e.message + '（请检查网络/CDN）'
  }
})
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950 text-white">
    <div ref="ball" class="h-28 w-28 cursor-pointer rounded-full bg-gradient-to-br from-pink-500 to-indigo-500 shadow-lg"></div>
    <p class="text-sm text-white/70">{{ status }}</p>
  </main>
</template>
