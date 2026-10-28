<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（动画篇）· p5.js × Anime.js v4 生成式图形
// ① 视角/切入点：p5.js 负责 Canvas 原生图形绘制（生成式同心波纹），Anime.js v4 负责「参数编排」——两者通过一个共享普通对象通信，
//    Anime 把色相等参数循环写入共享 state，p5 每帧 draw 读取渲染。对照纯 rAF 手动算时间 / GSAP（授权）。
// ② 实战定位：创意编程 / generative art / 数据艺术化展示 / 互动背景——p5 画、Anime 控节奏，解耦「画什么」与「怎么动」。
// ③ 学习模式：🔧p5 instance 模式 new p5(sketch)（sketch 内 setup/draw 生命周期）+ 共享 state 对象 + animejs animate({ targets: state, ..., loop, alternate, ease }) 驱动；
//    👉练习点 = 多参数联动（色相+半径+透明度）/ 事件触发 / p5 交互（mouseX 影响波纹）/ 与 Vue 状态双向。文末有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type p5 from 'p5'

const host = ref<HTMLElement | null>(null)

// 放到外层以便 onBeforeUnmount 清理；仅在 onMounted（客户端）内赋值
let p5Instance: p5 | null = null
let anim: { pause: () => void } | null = null

onMounted(async () => {
  try {
    // p5 / animejs 均含浏览器 API，动态 import 避免 Nuxt SSR 阶段触碰 window/document
    const p5Mod = await import('p5')
    const P5 = p5Mod.default
    const { animate } = await import('animejs')

    // 共享状态：Anime 编排 hue 循环，p5 每帧消费
    const state = { hue: 200 }

    const sketch = (s: p5) => {
      s.setup = () => {
        s.createCanvas(600, 400)
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
    p5Instance = new P5(sketch, host.value!)

    // Anime v4：把共享 state 当 target 做循环往返（替代 v3 的 anime({direction:'alternate',easing:})）
    // Anime v4 的 animate 是「位置参数」：animate(targets, parameters)
    anim = animate(state, {
      hue: [200, 320],
      duration: 3000,
      loop: true,
      alternate: true,
      ease: 'inOutSine',
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.warn('p5/Anime 加载失败', msg)
  }
})

onBeforeUnmount(() => {
  anim?.pause()
  // p5 必须 remove()，否则 draw 循环与 canvas 会泄漏、切页面后继续绘制
  p5Instance?.remove()
})
</script>

<template>
  <main class="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 p-4">
    <h1 class="text-2xl font-bold text-white">p5.js 生成式图形 × Anime.js 参数编排</h1>
    <div ref="host" class="overflow-hidden rounded-2xl border border-white/10"></div>
    <p class="text-sm text-white/60">色相由 Anime.js 循环驱动，p5 每帧渲染。</p>

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
          <tr class="border-b border-white/10"><td class="px-2 py-1">创意画布</td><td class="px-2 py-1">p5 instance 模式 <code>new p5(sketch)</code></td><td class="px-2 py-1">@p5-wrapper/react / react-p5 包装</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">参数编排</td><td class="px-2 py-1">animejs animate 直驱共享 state</td><td class="px-2 py-1">同（animejs 与框架无关）</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">通信方式</td><td class="px-2 py-1">共享普通对象（Anime 写 / p5 每帧读）</td><td class="px-2 py-1">同</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">适用场景</td><td class="px-2 py-1">生成式艺术 / 互动背景 / 数据艺术化</td><td class="px-2 py-1">同</td></tr>
        </tbody>
      </table>
      <p class="mt-3 text-white/50">
        📝 小结：p5.js 负责「画什么」（Canvas 原生图形 + 自身 setup/draw 生命周期），Anime.js v4 负责「怎么动」——
        它把一个**普通对象** <code>state</code> 当动画 target（<code>animate({ targets: state, hue:[200,320], loop, alternate, ease })</code>），
        p5 的 <code>draw()</code> 每帧读取 <code>state.hue</code> 渲染，二者通过共享 state 解耦，比纯手写 rAF 计时要省心。
        易错点：① 原页用 anime <strong>v3</strong> 的 <code>anime({direction:'alternate',easing:})</code>，本页升到 <strong>v4</strong> 的
        <code>animate({alternate:true, ease:'inOutSine'})</code>（v4 把 direction→alternate、easing→ease）；
        ② p5 / animejs 含浏览器 API，Nuxt 里必须**动态 import** 避免 SSR 阶段触碰 window/document；
        ③ 切页面要清理：<code>p5Instance.remove()</code> 停掉 draw 循环 + 移除 canvas，<code>anim?.pause()</code> 停参数动画，否则会泄漏并继续绘制。
      </p>
    </details>
  </main>
</template>
