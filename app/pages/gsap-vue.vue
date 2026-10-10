<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（动画篇）· GSAP 接入 Vue3
// · Vue2/Vue3：GSAP 框架无关，onMounted 初始化、onUnmounted ctx.revert()；
// · React 对照：useRef + useEffect 里 gsap.context，卸载 revert（见 social-start）。
// 📌 实战定位：JS 动画【了解即可·进阶】；GSAP 是动画天花板，时间线/滚动驱动/跨浏览器一致。
// 🧭 学习模式：🔧固定写法=gsap.to/from/timeline + gsap.context 清理；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const box = ref<HTMLDivElement | null>(null)
let ctx: gsap.Context | null = null
onMounted(() => {
  // 🔧 固定写法：gsap.context 包住，便于统一 revert
  if (box.value) {
    ctx = gsap.context(() => {
      gsap.from(box.value, { x: -120, opacity: 0, duration: 1, ease: 'power2.out' })
    })
  }
})
onUnmounted(() => ctx?.revert())
// 👉 练习：加一个按钮触发 gsap.to(box, { rotation: 360 })
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">GSAP 动画 · pages/gsap-vue.vue</h1>
    <div ref="box" class="h-16 w-16 rounded bg-blue-600"></div>

    <details class="mt-6 rounded border p-3 text-sm">
      <summary class="cursor-pointer font-semibold">📚 Vue2 / Vue3 / React 三向对照 & 本项目小结</summary>
      <table class="mt-2 w-full border-collapse text-left">
        <thead>
          <tr class="border-b">
            <th class="px-2 py-1">维度</th>
            <th class="px-2 py-1">Vue2 / Vue3</th>
            <th class="px-2 py-1">React</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b"><td class="px-2 py-1">动画库</td><td class="px-2 py-1">GSAP（框架无关）</td><td class="px-2 py-1">GSAP（框架无关）</td></tr>
          <tr class="border-b"><td class="px-2 py-1">初始化</td><td class="px-2 py-1">onMounted</td><td class="px-2 py-1">useEffect + useRef</td></tr>
          <tr class="border-b"><td class="px-2 py-1">清理</td><td class="px-2 py-1">onUnmounted ctx.revert()</td><td class="px-2 py-1">useEffect cleanup revert</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：GSAP 框架无关，Vue/React 写法一致；用 gsap.context 包裹便于卸载时统一 revert，避免动画残留。</p>
    </details>
  </main>
</template>
