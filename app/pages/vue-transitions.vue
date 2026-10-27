<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（过渡动画篇）· <Transition>
// · Vue2：<transition> 写法与 Vue3 几乎一致；
// · Vue3：<Transition> 包裹单元素/组件，进入/离开自动加 v-enter/v-leave 类；
// · React 对照：无内置，用 framer-motion / CSS 动画。
// 📌 实战定位：进出场动画【了解即可·进阶】；列表增删、弹窗、路由切换常用。
// 🧭 学习模式：🔧固定写法=<Transition name="x"> + .x-enter-active 等 CSS 类；👉=练习点（已落地：fade + slide 两种命名过渡）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref } from 'vue'

const show = ref(true)
const show2 = ref(true)
// 👉 练习：已落地 —— 第二个 <Transition name="slide"> 用独立 CSS 类演示「命名过渡」
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">过渡动画 &lt;Transition&gt; · pages/vue-transitions.vue</h1>

    <!-- ① fade 命名过渡 -->
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">① fade 命名过渡</h2>
      <button class="rounded bg-blue-600 px-3 py-1 text-white" @click="show = !show">切换显示</button>
      <Transition name="fade">
        <p v-if="show" class="rounded bg-gray-100 p-3 text-sm">我会淡入淡出 🎬</p>
      </Transition>
    </section>

    <!-- ② slide 命名过渡（练习点落地：独立 CSS 类） -->
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">② slide 命名过渡（练习点）</h2>
      <button class="rounded bg-green-600 px-3 py-1 text-white" @click="show2 = !show2">切换显示</button>
      <Transition name="slide">
        <p v-if="show2" class="rounded bg-blue-50 p-3 text-sm">我会滑入滑出 🛹</p>
      </Transition>
    </section>

    <details class="mt-6 rounded border p-3 text-sm">
      <summary class="cursor-pointer font-semibold">📚 Vue2 / Vue3 / React 三向对照 & 本项目小结</summary>
      <table class="mt-2 w-full border-collapse text-left">
        <thead>
          <tr class="border-b">
            <th class="px-2 py-1">维度</th>
            <th class="px-2 py-1">Vue2</th>
            <th class="px-2 py-1">Vue3</th>
            <th class="px-2 py-1">React</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b"><td class="px-2 py-1">包裹</td><td class="px-2 py-1">&lt;transition&gt;</td><td class="px-2 py-1">&lt;Transition&gt;</td><td class="px-2 py-1">无内置</td></tr>
          <tr class="border-b"><td class="px-2 py-1">类名</td><td class="px-2 py-1">v-enter-active…</td><td class="px-2 py-1">同左</td><td class="px-2 py-1">framer-motion</td></tr>
          <tr class="border-b"><td class="px-2 py-1">列表</td><td class="px-2 py-1">&lt;transition-group&gt;</td><td class="px-2 py-1">&lt;TransitionGroup&gt;</td><td class="px-2 py-1">库/手写</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：&lt;Transition&gt; 自动在元素进入/离开时挂 x-enter/x-leave 类（x = name），配 CSS transition 即可；想换动画就改 name + 加对应 CSS 类。多元素用 &lt;TransitionGroup&gt;（每项需 :key）。</p>
    </details>
  </main>
</template>

<style scoped>
/* 🔧 固定写法：name="fade" → .fade-enter-active 等类由 Vue 自动切换 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* 练习点：name="slide" → 独立的 slide-* 类，演示「命名过渡」换动画只需改 name + 加 CSS */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
