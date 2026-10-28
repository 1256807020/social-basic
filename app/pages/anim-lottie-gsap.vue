<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（动画篇）· Lottie × GSAP 协作
// ① 视角/切入点：Lottie 负责渲染 AE 导出的矢量动效（设计师↔开发桥梁），GSAP 负责「播放时机/进度控制」并把进度同步给页面其它元素，
//    对照纯 Lottie（只能一次性播完、交互弱）/ React（lottie-react 组件 + 同思路 GSAP）/ 纯 CSS（无法还原复杂矢量动效）。
// ② 实战定位：品牌动效、引导页、加载动画——用 Lottie 还原设计，用 GSAP 接管交互（播放/暂停/拖动），并让进度条与叙事文字同时间轴联动。
// ③ 学习模式：🔧固定写法 = lottie.loadAnimation({ animationData })，GSAP 用 gsap.to(clip,{t:1}) 驱动一个 0~1 进度对象，
//    onUpdate 里 anim.goToAndStop(p*(totalFrames-1)) + 同步进度条/步骤高亮；👉练习点 = 多段动画分段控制、进度联动更多 UI。
// 文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, reactive, onMounted } from 'vue'
import { gsap } from 'gsap'
import type { AnimationItem } from 'lottie-web'

const lottieBox = ref<HTMLElement | null>(null)
const status = ref('加载中…')
const playing = ref(false)
const activeStep = ref(0)

// GSAP 驱动的播放进度代理（0~1），进度条与叙事步骤都从它派生（响应式，无需命令式改 DOM）
const clip = reactive({ t: 0 })
let anim: AnimationItem | null = null
let tween: gsap.core.Tween | null = null

// 类型化每步叙事（禁 any）
interface Step {
  t: string
  d: string
}
const steps: Step[] = [
  { t: '① 设计师在 AE 导出 Lottie JSON', d: '高复杂度矢量动效，像素级还原品牌。' },
  { t: '② GSAP 接管播放时机', d: '不再只能「一次性播完」，可暂停 / 拖动 / 正放倒放。' },
  { t: '③ 进度联动页面其它元素', d: '进度条与叙事文字随同一时间轴同步，时序统一。' },
]

// 内联最小可用 Lottie（蓝圈旋转 + 脉冲），采用 Bodymovin 标准导出格式（i/o 补间句柄 + e 终值）
const data = {
  v: '5.7.4', fr: 30, ip: 0, op: 60, w: 200, h: 200, nm: 'demo', ddd: 0, assets: [],
  layers: [{
    ddd: 0, ind: 1, ty: 4, nm: 'c', sr: 1, ao: 0, bm: 0,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 1, k: [
        { t: 0, s: [0], e: [360], i: { x: [0.5], y: [1] }, o: { x: [0.5], y: [0] } },
        { t: 60 },
      ] },
      p: { a: 0, k: [100, 100, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 1, k: [
        { t: 0, s: [60, 60, 100], e: [100, 100, 100], i: { x: [0.5, 0.5, 0.5], y: [1, 1, 1] }, o: { x: [0.5, 0.5, 0.5], y: [0, 0, 0] } },
        { t: 30, s: [100, 100, 100], e: [60, 60, 100], i: { x: [0.5, 0.5, 0.5], y: [1, 1, 1] }, o: { x: [0.5, 0.5, 0.5], y: [0, 0, 0] } },
        { t: 60 },
      ] },
    },
    shapes: [
      // 注意：Lottie 组内数组第一个形状渲染在最上层，白点组须放在蓝色大圆之前
      { ty: 'gr', nm: 'g2',
        it: [
          { ty: 'el', nm: 'e2', p: { a: 0, k: [0, -26] }, s: { a: 0, k: [26, 26] } },
          { ty: 'fl', nm: 'f2', c: { a: 0, k: [1, 1, 1, 1] }, o: { a: 0, k: 100 }, r: 1, bm: 0 },
          { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } },
        ] },
      { ty: 'gr', nm: 'g1',
        it: [
          { ty: 'el', nm: 'e', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] } },
          { ty: 'fl', nm: 'f', c: { a: 0, k: [0.31, 0.62, 1, 1] }, o: { a: 0, k: 100 }, r: 1, bm: 0 },
          { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } },
        ] },
    ],
    ip: 0, op: 60, st: 0,
  }],
}

function applyProgress(p: number) {
  if (!anim) return
  clip.t = p
  anim.goToAndStop(p * (anim.totalFrames - 1), true)
  activeStep.value = Math.min(steps.length - 1, Math.floor(p * steps.length))
}

function play() {
  if (!anim) return
  if (clip.t >= 0.999) { clip.t = 0; applyProgress(0) }
  playing.value = true
  tween?.kill()
  // 🔧 GSAP 只负责把 0~1 进度平滑推进，真正画面由 anim.goToAndStop 控制
  tween = gsap.to(clip, {
    t: 1,
    duration: 4 * (1 - clip.t),
    ease: 'none',
    onUpdate: () => applyProgress(clip.t),
    onComplete: () => { playing.value = false },
  })
}
function pause() {
  playing.value = false
  tween?.pause()
}
function restart() {
  tween?.kill()
  playing.value = false
  applyProgress(0)
}
function scrub(e: Event) {
  tween?.kill()
  playing.value = false
  const target = e.target as HTMLInputElement
  applyProgress(Number(target.value) / 100)
}

onMounted(async () => {
  try {
    // 动态 import，避免 Nuxt SSR 阶段触碰 lottie-web 的浏览器 API
    const lottie = (await import('lottie-web')).default
    anim = lottie.loadAnimation({
      container: lottieBox.value!,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: data,
    })
    anim.addEventListener('DOMLoaded', () => {
      applyProgress(0)
      status.value = 'GSAP 已接管：点播放 / 拖动滑块，进度条与叙事同步联动'
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    status.value = '加载失败：' + msg
  }
})
</script>

<template>
  <main class="min-h-screen space-y-8 bg-zinc-950 p-8 text-white">
    <h1 class="text-4xl font-black">Lottie + GSAP 动效协作</h1>
    <p class="max-w-2xl text-white/70">
      Lottie 渲染 AE 导出的矢量动效，GSAP 控制播放时机并把进度同步给页面其它元素 —— 这是两者最经典的分工。
    </p>

    <!-- Lottie 舞台 + GSAP 控制 -->
    <section class="grid gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-2">
      <div class="flex flex-col items-center justify-center gap-4">
        <div ref="lottieBox" class="h-48 w-48"></div>
        <p class="text-sm text-white/60">{{ status }}</p>
        <div class="flex gap-2">
          <button @click="play" :disabled="playing"
            class="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold disabled:opacity-40">播放</button>
          <button @click="pause" :disabled="!playing"
            class="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold disabled:opacity-40">暂停</button>
          <button @click="restart"
            class="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold">重置</button>
        </div>
        <div class="flex w-full items-center gap-2">
          <span class="text-xs text-white/50">拖动</span>
          <input type="range" min="0" max="100" :value="clip.t * 100" @input="scrub"
            class="flex-1 accent-indigo-400" />
          <span class="w-10 text-right font-mono text-xs text-white/60">{{ Math.round(clip.t * 100) }}%</span>
        </div>
      </div>

      <!-- 联动：进度条 + 叙事步骤（均从 clip.t 响应式派生） -->
      <div class="flex flex-col gap-4">
        <div>
          <p class="mb-1 text-xs text-white/50">GSAP 联动进度条</p>
          <div class="h-2 w-full overflow-hidden rounded bg-white/10">
            <div class="h-full bg-blue-500" :style="{ width: (clip.t * 100) + '%' }"></div>
          </div>
        </div>
        <ul class="space-y-3">
          <li v-for="(s, i) in steps" :key="i"
            class="rounded-xl border border-white/10 p-3 transition-opacity duration-300"
            :class="activeStep === i ? 'bg-white/10 opacity-100' : 'opacity-40'">
            <p class="font-semibold">{{ s.t }}</p>
            <p class="text-sm text-white/60">{{ s.d }}</p>
          </li>
        </ul>
      </div>
    </section>

    <details class="rounded border border-white/10 p-3 text-sm text-white/80">
      <summary class="cursor-pointer font-semibold">📚 Vue2 / Vue3 / React 三向对照 & 本项目小结</summary>
      <table class="mt-3 w-full border-collapse text-left">
        <thead>
          <tr class="border-b border-white/20">
            <th class="px-2 py-1">维度</th>
            <th class="px-2 py-1">Vue2 / Vue3</th>
            <th class="px-2 py-1">React</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-white/10"><td class="px-2 py-1">渲染库</td><td class="px-2 py-1">lottie-web（框架无关）</td><td class="px-2 py-1">lottie-react / @lottiefiles/react-lottie</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">播放控制</td><td class="px-2 py-1">gsap.to(clip) 驱动进度</td><td class="px-2 py-1">useEffect + gsap 同思路</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">进度联动</td><td class="px-2 py-1">onUpdate 里 goToAndStop + ref</td><td class="px-2 py-1">同思路 state</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">设计师协作</td><td class="px-2 py-1">AE 导出 JSON 即所见即所得</td><td class="px-2 py-1">同</td></tr>
        </tbody>
      </table>
      <p class="mt-3 text-white/50">
        📝 小结：Lottie 解「复杂矢量动效还原」（设计师在 AE 画、导出 JSON，开发直接播），GSAP 解「交互控制」（播放/暂停/拖动/进度联动）。
        易错点：① Lottie 自带的 play/stop 是「一次性播完」，要可控必须 <code>autoplay:false</code> + 自己用 GSAP 推进一个 0~1 进度对象，再 <code>goToAndStop(frame)</code>；
        ② 进度条/叙事文字从同一进度对象派生，时序天然统一；③ Nuxt 里 <code>lottie-web</code> 用动态 <code>import()</code> 避免 SSR 阶段触碰浏览器 API。
      </p>
    </details>
  </main>
</template>
