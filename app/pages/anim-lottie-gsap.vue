<script setup lang="ts">
// 【动画组合 5/9 · Lottie + GSAP】
// 设计师与开发无缝衔接：Lottie 渲染矢量动效（此处内联一段手写 bodymovin JSON，无需外部资源），
// GSAP + ScrollTrigger 控制播放时机 / 滚动进度（scrub），并联动页面 DOM 元素，解决纯 Lottie 交互弱的问题。
useHead({
  script: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js' },
  ],
})

const lottieBox = ref<HTMLElement | null>(null)
const bar = ref<HTMLElement | null>(null)
const status = ref('加载中…')

// 内联最小可用 Lottie（蓝圈旋转 + 脉冲），避免依赖外部 JSON 资源
const data = {
  v: '5.7.0', fr: 30, ip: 0, op: 60, w: 200, h: 200, nm: 'demo', ddd: 0, assets: [],
  layers: [{
    ddd: 0, ind: 1, ty: 4, nm: 'c', sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 1, k: [{ t: 0, s: [0] }, { t: 60, s: [360] }] },
      p: { a: 0, k: [100, 100, 0] }, a: { a: 0, k: [0, 0, 0] },
      s: { a: 1, k: [{ t: 0, s: [50, 50, 100] }, { t: 30, s: [100, 100, 100] }, { t: 60, s: [50, 50, 100] }] },
    },
    shapes: [{
      ty: 'gr',
      it: [
        { ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] } },
        { ty: 'fl', c: { a: 0, k: [0.31, 0.62, 1, 1] }, o: { a: 0, k: 100 } },
        { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
      ],
    }],
    ip: 0, op: 60, st: 0,
  }],
}

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
    const lottie: any = await waitFor(() => (window as any).lottie)
    const gsap: any = await waitFor(() => (window as any).gsap)
    const ScrollTrigger: any = await waitFor(() => (window as any).ScrollTrigger)
    gsap.registerPlugin(ScrollTrigger)

    const anim = lottie.loadAnimation({ container: lottieBox.value!, renderer: 'svg', loop: false, autoplay: false, animationData: data })
    anim.addEventListener('DOMLoaded', () => {
      // GSAP 把滚动进度映射到 Lottie 帧 + 联动进度条宽度
      ScrollTrigger.create({
        trigger: '#stage', start: 'top top', end: 'bottom bottom', scrub: true,
        onUpdate: (self: any) => {
          anim.goToAndStop(self.progress * (anim.totalFrames - 1), true)
          if (bar.value) bar.value.style.width = `${self.progress * 100}%`
        },
      })
      status.value = '向下滚动 → Lottie 随进度播放 + 进度条联动'
    })
  } catch (e: any) {
    status.value = '加载失败：' + e.message + '（请检查网络/CDN）'
  }
})
</script>

<template>
  <div id="stage">
    <section class="sticky top-0 flex h-screen flex-col items-center justify-center gap-6 bg-zinc-900 text-white">
      <div ref="lottieBox" class="h-48 w-48"></div>
      <p class="text-sm text-white/70">{{ status }}</p>
      <div class="h-2 w-64 overflow-hidden rounded bg-white/10">
        <div ref="bar" class="h-full bg-blue-500" style="width: 0%"></div>
      </div>
    </section>
    <section class="h-screen"></section>
    <section class="h-screen"></section>
  </div>
</template>
