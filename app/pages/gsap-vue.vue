<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（动画篇）· GSAP 接入 Vue3
// ① 视角/切入点：GSAP 框架无关，本页从 Vue3 <script setup> 视角讲如何在组件里接 GSAP，
//    对照 Vue2（mounted/unmounted）与 React（useRef + useEffect + gsap.context）。
// ② 实战定位：JS 动画天花板——时间线编排(timeline)、交错(stagger)、缓动(ease)、
//    跨浏览器一致；适合复杂序列动画（步骤引导、数据入场、图表联动）。ScrollTrigger 滚动驱动另见 gsap 进阶。
// ③ 学习模式：🔧固定写法 = gsap.to/from/fromTo/timeline + gsap.context 统一清理；
//    👉练习点 = 自己加按钮触发 gsap.to(rotation:'+=360')、改 stagger 数值 / ease 体会节奏差异。
// 文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

// 类型：GSAP 的 context 返回对象（含 revert，便于卸载时统一清理）
let ctx: gsap.Context | null = null
// 时间线实例（非响应式，仅脚本内控制播放进度）
let tl: gsap.core.Timeline | null = null

// 各 demo 的 DOM ref（类型化，禁 any）
const introBox = ref<HTMLDivElement | null>(null)
const tlBoxA = ref<HTMLDivElement | null>(null)
const tlBoxB = ref<HTMLDivElement | null>(null)
const tlBoxC = ref<HTMLDivElement | null>(null)
const staggerWrap = ref<HTMLDivElement | null>(null)
const easeLinear = ref<HTMLDivElement | null>(null)
const easePower = ref<HTMLDivElement | null>(null)
const spinBox = ref<HTMLDivElement | null>(null)

onMounted(() => {
  // 🔧 固定写法：gsap.context 包住全部动画，便于 onUnmounted 统一 revert，避免动画残留/内存泄漏
  ctx = gsap.context(() => {
    // demo1: 入场 from（页面加载即播放一次，从无到有的"出现感"）
    if (introBox.value) {
      gsap.from(introBox.value, { x: -120, opacity: 0, duration: 0.8, ease: 'power2.out' })
    }
    // demo2: 时间线（先建好但 paused，停在 0 帧，等按钮 play；-=0.2 表示与上一段重叠 0.2s）
    if (tlBoxA.value && tlBoxB.value && tlBoxC.value) {
      tl = gsap.timeline({ paused: true })
      tl.from(tlBoxA.value, { y: -40, opacity: 0, duration: 0.5 })
        .from(tlBoxB.value, { x: 80, opacity: 0, duration: 0.5 }, '-=0.2')
        .from(tlBoxC.value, { scale: 0.4, opacity: 0, duration: 0.5 }, '-=0.2')
    }
  })
})

onUnmounted(() => ctx?.revert())

// ── 时间线控制（👉 体会 play/pause/reverse/restart 四态）──
function tlPlay() { tl?.play() }
function tlPause() { tl?.pause() }
function tlReverse() { tl?.reverse() }
function tlRestart() { tl?.restart() }

// ── demo3: 交错动画 stagger（👉 把 stagger 改成 0.3 或 0 体会节奏）──
function playStagger() {
  if (!staggerWrap.value) return
  const items = gsap.utils.toArray<HTMLDivElement>(staggerWrap.value.children)
  gsap.fromTo(
    items,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: 'back.out(1.7)' },
  )
}

// ── demo4: 缓动对比（linear 匀速 vs power3.inOut 缓入缓出）──
function playEase() {
  if (easeLinear.value) gsap.fromTo(easeLinear.value, { x: 0 }, { x: 200, duration: 1, ease: 'none' })
  if (easePower.value) gsap.fromTo(easePower.value, { x: 0 }, { x: 200, duration: 1, ease: 'power3.inOut' })
}

// ── demo5: 旋转练习点（实现原注释里的练习点）──
function spin() {
  if (spinBox.value) gsap.to(spinBox.value, { rotation: '+=360', duration: 0.8, ease: 'power2.inOut' })
}

// 通用小按钮样式（避免 <style> 全局，用 Tailwind 工具类）
const btn = 'rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-indigo-500 active:scale-95'
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-8 p-6 text-slate-100">
    <header class="space-y-1">
      <h1 class="text-2xl font-bold">GSAP 动画 · pages/gsap-vue.vue</h1>
      <p class="text-sm text-slate-400">
        GSAP 是框架无关的 JS 动画引擎。本页演示 Vue3 接入方式：onMounted 初始化、gsap.context 统一清理，含时间线 / 交错 / 缓动 / 旋转练习点。
      </p>
    </header>

    <!-- demo1: 入场 from -->
    <section class="rounded-2xl border border-white/10 bg-white/5 p-4">
      <h2 class="mb-3 font-semibold">① 入场动画（gsap.from，加载即播）</h2>
      <div ref="introBox" class="flex h-16 w-16 items-center justify-center rounded bg-blue-600 text-xs">from</div>
    </section>

    <!-- demo2: 时间线控制 -->
    <section class="rounded-2xl border border-white/10 bg-white/5 p-4">
      <h2 class="mb-3 font-semibold">② 时间线 Timeline（play / pause / reverse / restart）</h2>
      <div class="mb-3 flex gap-2">
        <button :class="btn" @click="tlPlay">▶ Play</button>
        <button :class="btn" @click="tlPause">⏸ Pause</button>
        <button :class="btn" @click="tlReverse">⏪ Reverse</button>
        <button :class="btn" @click="tlRestart">↻ Restart</button>
      </div>
      <div class="flex gap-3">
        <div ref="tlBoxA" class="flex h-14 w-14 items-center justify-center rounded bg-emerald-600 text-xs">A</div>
        <div ref="tlBoxB" class="flex h-14 w-14 items-center justify-center rounded bg-amber-600 text-xs">B</div>
        <div ref="tlBoxC" class="flex h-14 w-14 items-center justify-center rounded bg-rose-600 text-xs">C</div>
      </div>
    </section>

    <!-- demo3: 交错 stagger -->
    <section class="rounded-2xl border border-white/10 bg-white/5 p-4">
      <h2 class="mb-3 font-semibold">③ 交错动画 stagger（逐格延迟入场）</h2>
      <button :class="btn" class="mb-3" @click="playStagger">▶ 播放交错</button>
      <div ref="staggerWrap" class="grid grid-cols-6 gap-2">
        <div
          v-for="n in 12"
          :key="n"
          class="flex h-10 w-10 items-center justify-center rounded bg-cyan-600 text-xs"
        >{{ n }}</div>
      </div>
    </section>

    <!-- demo4: 缓动对比 -->
    <section class="rounded-2xl border border-white/10 bg-white/5 p-4">
      <h2 class="mb-3 font-semibold">④ 缓动对比 ease（linear 匀速 vs power3.inOut）</h2>
      <button :class="btn" class="mb-3" @click="playEase">▶ 同时播放</button>
      <div class="relative h-24 space-y-3">
        <div ref="easeLinear" class="flex h-8 w-8 items-center justify-center rounded bg-slate-400 text-xs text-slate-900">线性</div>
        <div ref="easePower" class="flex h-8 w-8 items-center justify-center rounded bg-fuchsia-500 text-xs">缓动</div>
      </div>
    </section>

    <!-- demo5: 旋转练习点 -->
    <section class="rounded-2xl border border-white/10 bg-white/5 p-4">
      <h2 class="mb-3 font-semibold">⑤ 练习点：按钮触发 gsap.to(rotation:'+=360')</h2>
      <button :class="btn" class="mb-3" @click="spin">🔄 旋转 360°</button>
      <div ref="spinBox" class="flex h-16 w-16 items-center justify-center rounded bg-indigo-600 text-xs">spin</div>
    </section>

    <details class="mt-6 rounded border border-white/10 p-3 text-sm">
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
          <tr class="border-b border-white/10"><td class="px-2 py-1">动画库</td><td class="px-2 py-1">GSAP（框架无关）</td><td class="px-2 py-1">GSAP（框架无关）</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">初始化</td><td class="px-2 py-1">onMounted / mounted</td><td class="px-2 py-1">useEffect + useRef</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">清理</td><td class="px-2 py-1">onUnmounted ctx.revert()</td><td class="px-2 py-1">useEffect cleanup ctx.revert()</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">时间线</td><td class="px-2 py-1">gsap.timeline() + play/pause</td><td class="px-2 py-1">gsap.timeline() + play/pause</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">交错</td><td class="px-2 py-1">stagger: 0.12</td><td class="px-2 py-1">stagger: 0.12</td></tr>
        </tbody>
      </table>
      <p class="mt-3 text-slate-400">
        📝 小结：GSAP 框架无关，Vue/React 写法几乎一致；核心是 <code>gsap.context</code> 包裹 + 卸载时
        <code>ctx.revert()</code> 统一清理，避免动画残留与内存泄漏。易错点：时间线实例别放进响应式 ref（它是命令式对象）；
        from 动画的初始值会被 GSAP 接管，组件卸载前若未 revert 会留下内联样式。
      </p>
    </details>
  </main>
</template>
