<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（动画篇）· Swiper × GSAP 联动
// ① 视角/切入点：Swiper 负责成熟的滑动/分页交互，GSAP 负责「切幕动效」与「进度联动」，
//    对照纯 CSS 轮播（无进度回调、动效单一）/ React（swiper/react 组件 + 同思路 GSAP）。
// ② 实战定位：产品介绍、活动落地页的沉浸式滑动叙事——滑到哪幕，内容 GSAP 入场，顶部进度条同步。
// ③ 学习模式：🔧固定写法 = new Swiper(el, { modules:[Pagination], ... }) + swiper.on('progress'/'slideChange*') 里调 gsap；
//    👉练习点 = 给不同 slide 配不同 enter 动画、把进度条换成进度环/数字百分比。
// 文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, computed, onMounted } from 'vue'
import { gsap } from 'gsap'
import Swiper from 'swiper'
import { Pagination } from 'swiper/modules'
import 'swiper/css'

// 类型化每幕内容（禁 any）
interface Slide {
  id: number
  c: string // 渐变背景 Tailwind 类
  t: string // 标题
  d: string // 描述
}
const slides: Slide[] = [
  { id: 1, c: 'from-rose-500 to-orange-400', t: '第一幕', d: '滑动切换 · GSAP 驱动内容入场' },
  { id: 2, c: 'from-sky-500 to-cyan-400', t: '第二幕', d: '沉浸式滑动叙事体验' },
  { id: 3, c: 'from-violet-500 to-fuchsia-400', t: '第三幕', d: 'Swiper × GSAP 黄金组合' },
]

const el = ref<HTMLElement | null>(null)
const progress = ref(0) // 顶部进度条（0~1，:style 绑定宽度）
// 类型化内联 style，规避 vue-tsc 对 { width } 字面量的偶发误报
const progressStyle = computed<Record<string, string>>(() => ({ width: `${progress.value * 100}%` }))
let swiper: Swiper | null = null

onMounted(() => {
  if (!el.value) return
  // 🔧 固定写法：npm 化 Swiper（模块化需显式注册 Pagination 模块）
  swiper = new Swiper(el.value, {
    modules: [Pagination],
    slidesPerView: 1,
    loop: true,
    pagination: { el: '.swiper-pagination', clickable: true },
    on: {
      // 切幕时：当前幕内容从下方淡入上浮（GSAP 驱动）
      slideChangeTransitionStart: () => {
        const active = el.value?.querySelector('.swiper-slide-active .content') ?? null
        if (active) {
          gsap.fromTo(
            active,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
          )
        }
      },
    },
  })
  // 进度联动：滑动进度 → 顶部进度条（响应式 ref 直接驱动样式）
  swiper.on('progress', (s: Swiper) => {
    progress.value = s.progress
  })
})
</script>

<template>
  <main class="min-h-screen bg-zinc-950 py-10 text-white">
    <div class="mx-auto max-w-3xl">
      <div class="mb-2 h-1 w-full overflow-hidden rounded bg-white/10">
        <div class="h-full bg-white" :style="progressStyle"></div>
      </div>

      <!-- 🔧 Swiper 容器结构：.swiper > .swiper-wrapper > .swiper-slide + .swiper-pagination -->
      <div ref="el" class="swiper overflow-hidden rounded-2xl">
        <div class="swiper-wrapper">
          <div v-for="s in slides" :key="s.id" class="swiper-slide">
            <div
              class="content flex h-72 flex-col items-center justify-center gap-3 bg-gradient-to-br p-10"
              :class="s.c"
            >
              <h2 class="text-4xl font-black">{{ s.t }}</h2>
              <p class="text-lg">{{ s.d }}</p>
            </div>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>

      <p class="mt-3 text-center text-sm text-white/60">← 拖拽 / 滑动 / 点圆点切换 →</p>
    </div>

    <details class="mx-auto mt-10 max-w-3xl rounded border border-white/10 p-3 text-sm text-white/80">
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
          <tr class="border-b border-white/10"><td class="px-2 py-1">滑动库</td><td class="px-2 py-1">Swiper（框架无关）</td><td class="px-2 py-1">swiper/react 组件</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">初始化</td><td class="px-2 py-1">new Swiper(el, { modules })</td><td class="px-2 py-1">useRef + useEffect new Swiper</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">切幕动效</td><td class="px-2 py-1">on('slideChange*') 里 gsap.fromTo</td><td class="px-2 py-1">同思路</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">进度联动</td><td class="px-2 py-1">on('progress') 驱动 ref</td><td class="px-2 py-1">同思路 state</td></tr>
        </tbody>
      </table>
      <p class="mt-3 text-white/50">
        📝 小结：Swiper 解决「滑动/分页」这种成熟交互（自己写拖拽、惯性、吸附很麻烦），GSAP 解决「切幕时的内容动效」与「进度联动」，
        两者分工明确。易错点：① npm 模块化用法必须 <code>modules: [Pagination]</code> 显式注册模块（bundle 版才自动全带）；
        ② 进度事件 <code>progress</code> 回调里用 <code>swiper.progress</code>（0~1）驱动进度条；
        ③ 切幕动画要查 <code>.swiper-slide-active</code> 里的目标节点，且放在 <code>slideChangeTransitionStart</code> 时机最顺。
      </p>
    </details>
  </main>
</template>
