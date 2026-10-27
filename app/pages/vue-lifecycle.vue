<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（生命周期篇）· onMounted / onUpdated / onUnmounted
// · Vue2：created()/mounted()/updated()/beforeDestroy()（Options 钩子）；
// · Vue3：import { onMounted, onUpdated, onUnmounted } from 'vue'，在 setup 里直接注册；
// · React 对照：useEffect(fn,[]) ≈ onMounted+onUnmounted；useEffect(fn,[deps]) ≈ onUpdated。
// 📌 实战定位：生命周期【基础必学】；发请求(onMounted)、开定时器(onMounted)与清理(onUnmounted)必用。
// 🧭 学习模式：🔧固定写法=onMounted(()=>{...}); onUnmounted(cleanup)；👉=练习点（已落地）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, onMounted, onUpdated, onUnmounted } from 'vue'
import type { Todo } from '~/types/todo'
import type { ApiListResult } from '~/types/api'

// ── ① 定时器副作用：onMounted 启动 / onUnmounted 清理（避免内存泄漏）──
const sec = ref(0)
const running = ref(true)
let timer: ReturnType<typeof setInterval> | null = null

// 🔧 固定写法：启动/清理抽成函数，onMounted 调一次，暂停后也能「继续」
function startTimer() {
  if (timer) return
  timer = setInterval(() => (sec.value++), 1000)
}
function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}
// 👉 练习：暂停/继续按钮真正生效（切走本页仍会在 onUnmounted 清掉 timer）
function toggleTimer() {
  if (running.value) {
    stopTimer()
    running.value = false
  } else {
    startTimer()
    running.value = true
  }
}

// ── ② onUpdated：响应式数据变化后触发（调试/埋点常用，别在这儿改数据防死循环）──
const updateCount = ref(0)
onUpdated(() => {
  updateCount.value++
})

// ── ③ 真实接口请求（演示 onMounted 发请求）──
const total = ref(0)
const loading = ref(false)
// 🔧 固定写法：给 $fetch 传泛型，响应自带类型，不用 any 断言
async function loadTodos() {
  loading.value = true
  const res = await $fetch<ApiListResult<Todo>>('/api/todo', { query: { pageSize: 3, sort: '-id' } })
  total.value = res.total ?? 0 // 后端真实总数
  loading.value = false
}

onMounted(() => {
  startTimer()   // 🔧 固定写法：副作用在 onMounted 启动
  loadTodos()    // 🔧 固定写法：发请求(onMounted) —— 组件一挂载就拿数据
})
onUnmounted(() => {
  stopTimer()    // 切走本页必清 timer，否则泄漏
})
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">生命周期 onMounted / onUpdated / onUnmounted · pages/vue-lifecycle.vue</h1>

    <!-- ① 定时器：onMounted 启动 / onUnmounted 清理 -->
    <section class="rounded border p-4">
      <h2 class="font-semibold">① 定时器副作用（onMounted + onUnmounted）</h2>
      <p>页面已运行：<b>{{ sec }}</b> 秒 ｜ onUpdated 触发：<b>{{ updateCount }}</b> 次</p>
      <button class="mt-2 rounded border px-3 py-1" @click="toggleTimer">{{ running ? '暂停' : '继续' }}</button>
      <p class="mt-1 text-sm text-gray-500">切走本页会自动 clearInterval（onUnmounted）。👉 试试把间隔改成 500ms。</p>
    </section>

    <!-- ② 真实接口：onMounted 发请求 -->
    <section class="rounded border p-4">
      <h2 class="font-semibold">② 挂载即发请求（onMounted + $fetch）</h2>
      <p v-if="loading">加载中…</p>
      <p v-else>后端 <code>/api/todo</code> 真实总数：<b>{{ total }}</b> 条（每挂载一次就拉一次）</p>
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
          <tr class="border-b"><td class="px-2 py-1">挂载后</td><td class="px-2 py-1">mounted(){}</td><td class="px-2 py-1">onMounted(()=>{})</td><td class="px-2 py-1">useEffect(fn,[])</td></tr>
          <tr class="border-b"><td class="px-2 py-1">卸载前</td><td class="px-2 py-1">beforeDestroy(){}</td><td class="px-2 py-1">onUnmounted(fn)</td><td class="px-2 py-1">useEffect return cleanup</td></tr>
          <tr class="border-b"><td class="px-2 py-1">更新后</td><td class="px-2 py-1">updated(){}</td><td class="px-2 py-1">onUpdated(fn)</td><td class="px-2 py-1">useEffect(fn,[deps])</td></tr>
          <tr class="border-b"><td class="px-2 py-1">发请求</td><td class="px-2 py-1">created(){ this.$http.get() }</td><td class="px-2 py-1">onMounted(()=>$fetch(...))</td><td class="px-2 py-1">useEffect(()=>{fetch()},[])</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：Vue3 生命周期是 setup 里 import 的「钩子函数」；副作用（定时器/监听/请求）务必在 onUnmounted 清理，否则切页会泄漏。发请求放 onMounted，更新依赖放 onUpdated（别在 onUpdated 里改数据，会死循环）。</p>
    </details>
  </main>
</template>
