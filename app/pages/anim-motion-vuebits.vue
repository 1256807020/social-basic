<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 动画组合 · Motion One（原 Framer Motion 的 vanilla 核心）+ Vue Bits 风格组件
// 【是什么】Motion One = 框架无关的声明式动画引擎（animate(el, keyframes, options)），即 Framer Motion 的 vanilla 版；
//          Vue Bits = React 生态"即拷即用"特效组件库（46.6K★），本仓库是 Vue 无法直接复用，故手写对等替代。
// 【为什么】声明式动画 = 你只描述"起止状态 + 时长/缓动"，引擎用 WAAPI(合成线程)自动补间，比手写 rAF+lerp 省力且更流畅。
// 【怎么用】ESM 经 module 脚本注入 window.Motion → onMounted 拿到后 M.animate(...) 跑入场/循环；鼠标跟随用原生 pointermove 写 CSS 变量。
// 🔧 固定写法：CDN 全局无类型 → 最小类型 MotionApi + declare global Window + 泛型 waitFor<T> 杜绝 any（同 anim-aos-granim 范式）。
// ↔ React：Framer Motion 的 <motion.div initial/animate> + React Bits 组件；Vue2 常用 @vueuse/motion 的 v-motion 指令。
// 📌 实战定位：产品/落地页"高级感"特效（滚动入场、渐变流光、聚光灯、跑马灯），优先声明式引擎而非手写 rAF。
// 🎬 同源异用：本页"声明式 + 时间驱动插值"心智 = Remotion 用 useCurrentFrame()+interpolate() 写视频的底层逻辑；
//          Remotion 把每帧渲染成真实 MP4（离线产出视频资产，非浏览器实时播），React 全量实现见 social-start 高级分支。
// ───────────────────────────────────────────────────────────
useHead({
  script: [
    {
      type: 'module',
      innerHTML:
        "import * as M from 'https://cdn.jsdelivr.net/npm/motion@11/+esm'; window.Motion = M;",
    },
  ],
})

// CDN 全局的最小类型声明（避免 any）
interface MotionApi {
  animate: (
    element: Element,
    keyframes: Record<string, unknown>,
    options?: Record<string, unknown>,
  ) => { finished: Promise<void>; play?: () => void; pause?: () => void }
}

declare global {
  interface Window {
    Motion?: MotionApi
  }
}

const reveal = ref<HTMLElement | null>(null)
const spotlight = ref<HTMLElement | null>(null)
const gradient = ref<HTMLElement | null>(null)

// 泛型轮询：等待 CDN 全局就绪；rAF 比 setInterval 省电、与渲染帧对齐
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

// 速度控制：可经 props.speed 传入（秒/圈），缺省用滑块值
const props = defineProps<{ speed?: number }>()

onMounted(async () => {
  try {
    const M = await waitFor<MotionApi>(() => window.Motion)
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
    // 3) 聚光灯卡片：跟随鼠标移动径向高光（原生 pointermove 写 CSS 变量，无需动画库）
    if (spotlight.value) {
      const el = spotlight.value
      el.addEventListener('pointermove', (e: PointerEvent) => {
        const r = el.getBoundingClientRect()
        el.style.setProperty('--mx', `${e.clientX - r.left}px`)
        el.style.setProperty('--my', `${e.clientY - r.top}px`)
      })
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.warn('Motion 加载失败', msg)
  }
})

const marqueeItems = ['Vue', 'Nuxt', 'Motion', 'GSAP', 'Three.js', 'D3', 'Lottie', 'Swiper']
// 每组重复 3 遍，确保「一组宽度 > 视口宽度」，循环时右边缘才不会露白
const marqueeLoop = [...marqueeItems, ...marqueeItems, ...marqueeItems]
const marqueeDuration = ref(props.speed ?? 50) // 越大越慢
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

    <!-- 速度控制：滑块实时调节跑马灯速度（秒/圈，越大越慢） -->
    <section class="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
      <label class="shrink-0 text-sm text-white/70">速度（秒/圈）</label>
      <input type="range" min="5" max="60" step="1" v-model.number="marqueeDuration" class="flex-1 accent-indigo-400" />
      <span class="w-12 shrink-0 text-right font-mono text-white/80">{{ marqueeDuration }}s</span>
    </section>

    <!-- Vue Bits 风格：跑马灯（双组无缝循环：平移 -50% = 一组宽度） -->
    <section class="overflow-hidden rounded-2xl border border-white/10 py-4">
      <div class="marquee-track flex w-max" :style="{ animationDuration: marqueeDuration + 's' }">
        <div class="marquee-group flex shrink-0">
          <span v-for="(t, i) in marqueeLoop" :key="'a-' + i" class="pr-8 text-xl font-semibold text-white/80">{{ t }} ✦</span>
        </div>
        <div class="marquee-group flex shrink-0" aria-hidden="true">
          <span v-for="(t, i) in marqueeLoop" :key="'b-' + i" class="pr-8 text-xl font-semibold text-white/80">{{ t }} ✦</span>
        </div>
      </div>
    </section>

    <details class="mt-12 rounded border border-white/20 p-3 text-sm text-white">
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
          <tr class="border-b border-white/20"><td class="px-2 py-1">声明式动画</td><td class="px-2 py-1">@vueuse/motion (v-motion)</td><td class="px-2 py-1">Motion One 原生 + 手写组件</td><td class="px-2 py-1">Framer Motion / React Bits</td></tr>
          <tr class="border-b border-white/20"><td class="px-2 py-1">初始化时机</td><td class="px-2 py-1">插件/指令</td><td class="px-2 py-1">onMounted + window.Motion</td><td class="px-2 py-1">组件即动画</td></tr>
          <tr class="border-b border-white/20"><td class="px-2 py-1">鼠标跟随</td><td class="px-2 py-1" colspan="3">原生 pointermove 写 CSS 变量（与框架无关，本页做法）</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-white/70">📝 小结：Motion One / Framer Motion 都是"描述起止状态、引擎自动补间"的声明式动画，底层走 WAAPI（合成线程，比手写 rAF 流畅）；Vue Bits 的特效（聚光灯/跑马灯）在 Vue 里手写等价组件即可，不必强求同库；同源的还有 Remotion（React 框架）：核心 useCurrentFrame()+interpolate() 正是本页"时间驱动插值"的心智，只是渲染目标是视频帧→编码成 MP4，用于自媒体/个性化视频规模化生产（React 侧全量教学在 social-start 高级分支）。</p>
    </details>
  </main>
</template>

<style scoped>
.marquee-track {
  animation: vuemarquee 14s linear infinite;
}
</style>

<style>
/* keyframes 必须放全局 <style>（非 scoped）：scoped 会给 @keyframes 名加 hash，下方 translateX(-50%) 引用不到 */
@keyframes vuemarquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
</style>
