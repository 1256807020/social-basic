<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 动画组合 · AOS.js + Granim.js（轻量落地页动效）
// 【是什么】AOS = 元素滚动入场动画库（用 data-aos 声明动画）；Granim = 动态渐变背景库（canvas 渲染流动渐变）。
// 【为什么】零复杂配置即可给普通页面加"高级感"：AOS 管内容入场节奏，Granim 管背景氛围，两者解耦、互不干扰。
// 【怎么用】CDN 引入（useHead）→ onMounted 等全局就绪 → AOS.init() + new Granim({...})；模板用 data-aos="fade-up" 触发。
// 🔧 固定写法：CDN 库是"无类型全局"，下面用「最小类型声明 + 泛型 waitFor<T>」杜绝 any（见 Window 增强 + AosApi/GranimCtor）。
// ↔ React：同思路——useEffect 里 AOS.init() + new Granim()，CDN 全局挂在 window；Vue2 则在 mounted 钩子里调用。
// 📌 实战定位：营销页 / 产品介绍页 / 个人主页的"轻量动效"首选，别为了这点效果引入重型动画框架。
// ───────────────────────────────────────────────────────────
useHead({
  link: [{ rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css' }],
  script: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/granim/2.0.0/granim.min.js' },
  ],
})

// CDN 全局的最小类型声明（避免 any）
interface AosApi {
  init: (opts?: Record<string, unknown>) => void
  refresh: () => void
}
interface GranimOptions {
  element: HTMLCanvasElement
  name?: string
  direction?: 'diagonal' | 'left-right' | 'top-bottom' | 'radial'
  opacity?: number[]
  states: Record<string, { gradients: string[][] }>
}
type GranimInstance = { pause?: () => void; play?: () => void }
type GranimCtor = new (opts: GranimOptions) => GranimInstance

declare global {
  interface Window {
    AOS?: AosApi
    Granim?: GranimCtor
  }
}

const bg = ref<HTMLCanvasElement | null>(null)

// 泛型轮询：等待 CDN 全局就绪；用 rAF 而非 setInterval——与渲染帧对齐、标签页隐藏时自动暂停，更省电。
function waitFor<T>(getter: () => T | undefined, timeout = 8000): Promise<T> {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const tick = () => {
      const v = getter()
      if (v !== undefined) return resolve(v)
      if (Date.now() - start > timeout) return reject(new Error('库加载超时'))
      requestAnimationFrame(tick)
    }
    tick()
  })
}

onMounted(async () => {
  try {
    const AOS = await waitFor<AosApi>(() => window.AOS)
    const Granim = await waitFor<GranimCtor>(() => window.Granim)
    if (!bg.value) return
    AOS.init({ duration: 900, once: false })
    new Granim({
      element: bg.value,
      name: 'granim',
      direction: 'diagonal',
      opacity: [0.9, 0.7],
      states: {
        'default-state': { gradients: [['#ff6ec4', '#7873f5'], ['#43e97b', '#38f9d7'], ['#fa709a', '#fee140']] },
      },
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.warn('AOS/Granim 加载失败', msg)
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

    <details class="mt-16 rounded border border-white/20 p-3 text-sm text-white">
      <summary class="cursor-pointer font-semibold">📚 Vue2 / Vue3 / React 三向对照 & 本项目小结</summary>
      <table class="mt-2 w-full border-collapse text-left">
        <thead>
          <tr class="border-b border-white/30">
            <th class="px-2 py-1">维度</th>
            <th class="px-2 py-1">Vue2 (Options)</th>
            <th class="px-2 py-1">Vue3</th>
            <th class="px-2 py-1">React</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-white/20"><td class="px-2 py-1">引入方式</td><td class="px-2 py-1">vue-aos 插件 / CDN</td><td class="px-2 py-1">useHead CDN</td><td class="px-2 py-1">react-aos / CDN</td></tr>
          <tr class="border-b border-white/20"><td class="px-2 py-1">初始化时机</td><td class="px-2 py-1">mounted</td><td class="px-2 py-1">onMounted</td><td class="px-2 py-1">useEffect(()=&gt;{...},[])</td></tr>
          <tr class="border-b border-white/20"><td class="px-2 py-1">声明动画</td><td class="px-2 py-1" colspan="3">都靠 data-aos="fade-up"（库本身框架无关）</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-white/70">📝 小结：AOS / Granim 都是框架无关的 vanilla 库，差别只在"在哪个生命周期钩子里 init"——Vue3 用 onMounted、React 用 useEffect、Vue2 用 mounted，本质一致。</p>
    </details>
  </main>
</template>
