<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（动画篇）· Popmotion + Mo.js 创意特效
// ① 视角/切入点：Popmotion 提供「物理动效」（此处 spring 弹性回弹，纯 JS 无 DOM 依赖），Mo.js 生成「自定义粒子爆发」SVG 特效；
//    两者互补：一个做物理手感交互、一个做品牌级视觉爆发。对照 GSAP（授权）/ anime（无原生粒子）/ 纯 CSS（难做粒子）。
// ② 实战定位：高互动品牌创意站、点击/手势反馈、营销落地页彩蛋——点击触发「弹性缩放 + 粒子炸开」。
// ③ 学习模式：🔧popmotion animate({ from, to, type:'spring', stiffness, damping, onUpdate }) 驱动 transform；🔧mojs Burst({radius,count,children}) + tune({x,y}).replay() 在点击处爆发；
//    👉练习点 = 多 Burst 叠加 / 不同 spring 参数手感 / 与 Vue 状态联动变色。文末有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { Burst } from 'mo-js'

const ball = ref<HTMLElement | null>(null)
const status = ref('点击球体')

// 外层声明以便 onBeforeUnmount 清理
let burst: Burst | null = null
let popAnim: { stop: () => void } | null = null

onMounted(async () => {
  try {
    // mo-js 在模块加载时会访问 document.body，必须客户端动态 import；popmotion 一并动态引入保持统一
    const mojsMod = await import('mo-js')
    const mojs = mojsMod.default
    const { animate } = await import('popmotion')

    burst = new mojs.Burst({
      left: 0, top: 0, radius: { 0: 80 }, count: 12,
      children: { shape: 'circle', fill: [{ '#ff6ec4': '#7873f5' }], scale: { 1: 0 }, duration: 900 },
    })

    ball.value!.addEventListener('pointerdown', () => {
      status.value = 'Popmotion 弹性 + Mo.js 粒子爆发'
      // Popmotion：spring 物理回弹（无 DOM 依赖，纯数值驱动 transform）
      popAnim = animate({
        from: 1, to: 0, type: 'spring', stiffness: 260, damping: 12,
        onUpdate: (v: number) => { if (ball.value) ball.value.style.transform = `scale(${0.7 + v * 0.3})` },
      })
      // Mo.js：在点击位置爆发粒子（getBoundingClientRect 是视口坐标，需加滚动偏移才是页面坐标）
      const r = ball.value!.getBoundingClientRect()
      burst!.tune({ x: r.left + window.scrollX + r.width / 2, y: r.top + window.scrollY + r.height / 2 }).replay()
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    status.value = '加载失败：' + msg
  }
})

onBeforeUnmount(() => {
  // 停掉 popmotion 的 rAF 循环，移除 mo-js 自动注入到 body 的 SVG，避免切页面后继续绘制/泄漏
  popAnim?.stop()
  burst?.el?.remove()
})
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950 text-white p-4">
    <div ref="ball" class="h-28 w-28 cursor-pointer rounded-full bg-gradient-to-br from-pink-500 to-indigo-500 shadow-lg"></div>
    <p class="text-sm text-white/70">{{ status }}</p>

    <details class="mt-2 max-w-xl rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white/80">
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
          <tr class="border-b border-white/10"><td class="px-2 py-1">物理动效</td><td class="px-2 py-1">popmotion animate spring</td><td class="px-2 py-1">同（popmotion 框架无关）</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">粒子爆发</td><td class="px-2 py-1">mo-js Burst + tune/replay</td><td class="px-2 py-1">同</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">触发方式</td><td class="px-2 py-1">addEventListener('pointerdown')</td><td class="px-2 py-1">onClick / onPointerDown</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">适用场景</td><td class="px-2 py-1">品牌创意站 / 点击彩蛋</td><td class="px-2 py-1">同</td></tr>
        </tbody>
      </table>
      <p class="mt-3 text-white/50">
        📝 小结：Popmotion 负责「物理手感」（<code>animate({ from, to, type:'spring', stiffness, damping, onUpdate })</code> 把数值回弹映射成
        <code>transform: scale()</code>，纯 JS 无 DOM 依赖）；Mo.js 负责「视觉爆发」（<code>new Burst({ radius, count, children })</code> 生成 SVG 粒子，
        <code>burst.tune({ x, y }).replay()</code> 在点击处重播）。易错点：① 原页用 CDN 全局 <code>window.mojs/window.popmotion</code> 且满屏 <code>any</code>，本页全改 npm 并去 any；
        ② mo-js 官方无类型，本页在 <code>app/types/mo-js.d.ts</code> 补最小声明（结构化类型替代 any）；
        ③ mo-js 加载即访问 <code>document.body</code> 且自动把 SVG append 到 body，Nuxt 里必须**动态 import** 并在 <code>onBeforeUnmount</code> 调
        <code>burst.el?.remove()</code> 清理；④ getBoundingClientRect 给的是视口坐标，要加 <code>scrollX/scrollY</code> 才是 mo-js 需要的页面坐标。
      </p>
    </details>
  </main>
</template>
