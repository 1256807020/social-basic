<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（组合式函数篇）· useXxx 抽逻辑
// · Vue2：用 mixins（数据来源不清、易命名冲突）或 Vue.prototype 挂全局；
// · Vue3：组合式函数——普通函数返回响应式状态+方法，组件里 import 即用，类型友好；
// · React 对照：自定义 Hook（useXxx）几乎同思路，复用粒度更细。
// 📌 实战定位：逻辑复用【常规业务常用】；列表加载/表单/权限等可抽成 composable。
// 🧭 学习模式：🔧固定写法=function useXxx(){ const x=ref(); return {x} }；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref } from 'vue'

// 🔧 固定写法：composable 是普通函数，返回响应式数据（可在多个组件复用）
function useCounter(start = 0) {
  const n = ref(start)
  const inc = () => n.value++
  // 👉 练习：在这里加一个 dec()
  return { n, inc }
}
const a = useCounter(0)
const b = useCounter(10)
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">组合式函数 useXxx · pages/vue-composables.vue</h1>
    <div class="flex gap-6">
      <div>计数器A：{{ a.n }} <button class="rounded bg-blue-600 px-2 py-0.5 text-white" @click="a.inc">+1</button></div>
      <div>计数器B：{{ b.n }} <button class="rounded bg-green-600 px-2 py-0.5 text-white" @click="b.inc">+1</button></div>
    </div>

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
          <tr class="border-b"><td class="px-2 py-1">复用方式</td><td class="px-2 py-1">mixins</td><td class="px-2 py-1">组合式函数 useXxx</td><td class="px-2 py-1">自定义 Hook</td></tr>
          <tr class="border-b"><td class="px-2 py-1">来源清晰</td><td class="px-2 py-1">差（合并冲突）</td><td class="px-2 py-1">好（显式返回）</td><td class="px-2 py-1">好</td></tr>
          <tr class="border-b"><td class="px-2 py-1">类型</td><td class="px-2 py-1">弱</td><td class="px-2 py-1">强（TS 推断）</td><td class="px-2 py-1">强</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：composable 是「带状态的逻辑函数」，比 mixins 来源清晰、类型友好；和 React 自定义 Hook 思路一致。</p>
    </details>
  </main>
</template>
