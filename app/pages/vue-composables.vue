<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（组合式函数篇）· useXxx 抽逻辑
// · Vue2：用 mixins（数据来源不清、易命名冲突）或 Vue.prototype 挂全局；
// · Vue3：组合式函数——普通函数返回响应式状态+方法，组件里 import 即用，类型友好；
// · React 对照：自定义 Hook（useXxx）几乎同思路，复用粒度更细。
// 📌 实战定位：逻辑复用【常规业务常用】；列表加载/表单/权限等可抽成 composable。
// 🧭 学习模式：🔧固定写法=function useXxx(){ const x=ref(); return {x} }；👉=练习点（已落地：dec + 真实 useTodos）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, onMounted } from 'vue'
import type { Todo } from '~/types/todo'
import type { ApiListResult } from '~/types/api'

// ── ① 基础演示：composable 抽本地状态逻辑（纯前端概念）──
// 🔧 固定写法：composable 是普通函数，返回响应式数据（可在多个组件复用）
function useCounter(start = 0) {
  const n = ref(start)
  const inc = () => n.value++
  // 👉 练习：dec() 已落地
  const dec = () => n.value--
  return { n, inc, dec }
}
const a = useCounter(0)
const b = useCounter(10)

// ── ② 真实接口 composable（演示「带状态的逻辑函数」复用 + 接 /api）──
// 🔧 固定写法：把「加载列表 + 状态」抽成 useTodos，任何组件 import 即用
function useTodos() {
  const items = ref<Todo[]>([])
  const total = ref(0)
  const loading = ref(false)
  // 👉 练习：给 useTodos 加 add()/remove()，复用同一套接口逻辑
  async function load(p = 1) {
    loading.value = true
    const res = await $fetch<ApiListResult<Todo>>('/api/todo', { query: { page: p, pageSize: 5, sort: '-id' } })
    items.value = res.data ?? []
    total.value = res.total ?? 0
    loading.value = false
  }
  return { items, total, loading, load }
}
const todos = useTodos()
onMounted(() => todos.load(1)) // 挂载即拉真实数据（composable 内封装加载逻辑）
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">组合式函数 useXxx · pages/vue-composables.vue</h1>

    <!-- ① 本地状态 composable -->
    <section class="rounded border p-4">
      <h2 class="font-semibold">① 抽本地状态逻辑（useCounter）</h2>
      <div class="flex gap-6">
        <div>计数器A：{{ a.n }}
          <button class="rounded bg-blue-600 px-2 py-0.5 text-white" @click="a.inc">+1</button>
          <button class="rounded border px-2 py-0.5" @click="a.dec">-1</button>
        </div>
        <div>计数器B：{{ b.n }}
          <button class="rounded bg-green-600 px-2 py-0.5 text-white" @click="b.inc">+1</button>
          <button class="rounded border px-2 py-0.5" @click="b.dec">-1</button>
        </div>
      </div>
      <p class="mt-1 text-sm text-gray-500">两个计数器各自独立状态——composable 每次调用都是一份新状态。</p>
    </section>

    <!-- ② 真实接口 composable -->
    <section class="rounded border p-4">
      <h2 class="font-semibold">② 真实接口 composable（useTodos 接 /api/todo）</h2>
      <p v-if="todos.loading.value" class="text-sm text-gray-500">加载中…</p>
      <template v-else>
        <p class="text-sm">后端真实总数：<b>{{ todos.total.value }}</b> 条（取最新 5 条）</p>
        <ul class="mt-2 space-y-1 text-sm">
          <li v-for="t in todos.items.value" :key="t.id" class="border-b py-0.5">#{{ t.id }} {{ t.title }}</li>
        </ul>
      </template>
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
          <tr class="border-b"><td class="px-2 py-1">复用方式</td><td class="px-2 py-1">mixins</td><td class="px-2 py-1">组合式函数 useXxx</td><td class="px-2 py-1">自定义 Hook</td></tr>
          <tr class="border-b"><td class="px-2 py-1">来源清晰</td><td class="px-2 py-1">差（合并冲突）</td><td class="px-2 py-1">好（显式返回）</td><td class="px-2 py-1">好</td></tr>
          <tr class="border-b"><td class="px-2 py-1">类型</td><td class="px-2 py-1">弱</td><td class="px-2 py-1">强（TS 推断）</td><td class="px-2 py-1">强</td></tr>
          <tr class="border-b"><td class="px-2 py-1">接口+状态复用</td><td class="px-2 py-1">mixin + this.$http</td><td class="px-2 py-1">useXxx 返回 $fetch 逻辑</td><td class="px-2 py-1">useXxx hook + fetch</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：composable 是「带状态的逻辑函数」，比 mixins 来源清晰、类型友好；和 React 自定义 Hook 思路一致。把列表加载/表单/权限等抽成 useXxx，组件里 import 即用、可多组件复用。</p>
    </details>
  </main>
</template>
