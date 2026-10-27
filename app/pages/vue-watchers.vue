<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（侦听篇）· watch / watchEffect
// · Vue2：watch: { name(n,o){...} }，或 this.$watch；
// · Vue3：watch(源, cb) 精确侦听；watchEffect(fn) 自动追踪依赖立即跑一次；
// · React 对照：useEffect(fn, [dep]) 近似 watch（但 React 是「依赖变化重跑」）。
// 📌 实战定位：侦听变化【基础必学】；搜索框防抖、监听路由/表单变化、联动计算都靠它。
// 🧭 学习模式：🔧固定写法=watch(src, cb) / watchEffect(fn)；👉=练习点（已落地：真实搜索防抖）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, watch, watchEffect } from 'vue'
import type { Todo } from '~/types/todo'
import type { ApiListResult } from '~/types/api'

// ── ① 基础演示：精确侦听 vs 自动追踪（本地状态，纯前端概念）──
const name = ref('Tom')
const log = ref<string[]>([])

// 🔧 固定写法：watch 侦听 name，cb 拿 (新值, 旧值)
// watch(src, cb)：默认懒跑、给 (newVal, oldVal)、可控；immediate 决定要不要挂载也跑一次。
watch(name, (n, o) => {
  log.value.push(`watch: 新值${n} → 旧值${o}`)
})
// watchEffect：自动收集依赖（这里依赖 name），立即执行一次 + 变化重跑
// watchEffect(fn)：挂载即跑 + 依赖变重跑，无 oldVal，写法最短；
watchEffect(() => {
  log.value.push(`watchEffect 看到 name=${name.value}`)
})

// ── ② 真实接口 + 防抖（演示 watch + 搜索框防抖，实战定位）──
const keyword = ref('')
const results = ref<Todo[]>([])
const searching = ref(false)
let debounce: ReturnType<typeof setTimeout> | null = null

// 🔧 固定写法：watch(keyword) + 防抖 + $fetch 真实搜索
// 👉 练习：把 300ms 改成 500ms，或加一个「清空」按钮 reset keyword
watch(
  keyword,
  (kw) => {
    if (debounce) clearTimeout(debounce)
    debounce = setTimeout(async () => {
      searching.value = true
      // 引擎 keyword 参数：空则不筛选；默认搜全部字段（含 title）
      const res = await $fetch<ApiListResult<Todo>>('/api/todo', { query: { keyword: kw, pageSize: 5 } })
      results.value = res.data ?? []
      searching.value = false
    }, 300)
  },
  { immediate: true }, // 挂载即拉一次真实数据（kw='' 返回全部）
)
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">侦听 watch / watchEffect · pages/vue-watchers.vue</h1>

    <!-- ① 基础演示：本地状态 -->
    <section class="rounded border p-4">
      <h2 class="font-semibold">① 精确侦听 vs 自动追踪（本地状态）</h2>
      <input v-model="name" class="w-full rounded border px-2 py-1" placeholder="改名字看日志" />
      <ul class="mt-2 space-y-1 text-sm">
        <li v-for="(l, i) in log.slice(-6)" :key="i" class="border-b py-0.5">{{ l }}</li>
      </ul>
    </section>

    <!-- ② 真实接口 + 防抖 -->
    <section class="rounded border p-4">
      <h2 class="font-semibold">② 真实搜索框防抖（watch + $fetch）</h2>
      <input v-model="keyword" class="w-full rounded border px-2 py-1" placeholder="输入关键字，300ms 后真实搜索 /api/todo" />
      <p v-if="searching" class="mt-1 text-sm text-gray-500">搜索中…</p>
      <ul v-else class="mt-2 space-y-1 text-sm">
        <li v-for="t in results" :key="t.id" class="border-b py-0.5">#{{ t.id }} {{ t.title }}</li>
        <li v-if="!results.length" class="text-gray-400">无结果（或还没输入）</li>
      </ul>
    </section>

    <details class="mt-6 rounded border p-3 text-sm">
      <summary class="cursor-pointer font-semibold">📚 Vue2 / Vue3 / React 三向对照 & 本项目小结</summary>
      <table class="mt-2 w-full border-collapse text-left">
        <thead>
          <tr class="border-b">
            <th class="px-2 py-1">维度</th>
            <th class="px-2 py-1">Vue2 (Options)</th>
            <th class="px-2 py-1">Vue3</th>
            <th class="px-2 py-1">React</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b"><td class="px-2 py-1">精确侦听</td><td class="px-2 py-1">watch:{x(){}}</td><td class="px-2 py-1">watch(x, cb)</td><td class="px-2 py-1">useEffect(fn,[x])</td></tr>
          <tr class="border-b"><td class="px-2 py-1">自动追踪</td><td class="px-2 py-1">（无）</td><td class="px-2 py-1">watchEffect(fn)</td><td class="px-2 py-1">useEffect(fn,[])</td></tr>
          <tr class="border-b"><td class="px-2 py-1">旧值</td><td class="px-2 py-1">cb(n,o)</td><td class="px-2 py-1">cb(n,o)</td><td class="px-2 py-1">需手动存</td></tr>
          <tr class="border-b"><td class="px-2 py-1">搜索防抖</td><td class="px-2 py-1">watch:{kw(){debounce}}</td><td class="px-2 py-1">watch(kw, debounce+$fetch)</td><td class="px-2 py-1">useEffect(()=>timer,[kw])</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：watch 给你新旧值、可控（{ immediate } 可让它挂载就跑一次）；watchEffect 自动收集依赖、写法更短；两者都在 setup 里调用，返回 stop 函数可手动停止。搜索框防抖 = watch(源, cb) 里 setTimeout + 每次先 clearTimeout。</p>
    </details>
  </main>
</template>
