<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（生命周期篇）· onMounted / onUnmounted
// · Vue2：mounted(){} / beforeDestroy(){}（Options 钩子）；
// · Vue3：import { onMounted, onUnmounted } from 'vue'，在 setup 里直接注册；
// · React 对照：useEffect(() => {...; return () => cleanup}, []) ≈ onMounted+onUnmounted。
// 📌 实战定位：生命周期【基础必学】；发请求(onMounted)、开定时器/监听(onMounted)与清理(onUnmounted)必用。
// 🧭 学习模式：🔧固定写法=onMounted(()=>{...}); onUnmounted(cleanup)；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, onMounted, onUnmounted } from 'vue'

const sec = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

// 🔧 固定写法：onMounted 里启动副作用，onUnmounted 里清理（避免内存泄漏）
onMounted(() => {
  // 👉 练习：把间隔改成 500ms，或加一个“暂停”按钮清掉 timer
  timer = setInterval(() => sec.value++, 1000)
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">生命周期 onMounted / onUnmounted · pages/vue-lifecycle.vue</h1>
    <p>页面已运行：{{ sec }} 秒（切走本页会自动 clearInterval）</p>

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
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：Vue3 生命周期是 setup 里 import 的「钩子函数」；副作用务必在 onUnmounted 清理，否则切页会泄漏定时器/监听。</p>
    </details>
  </main>
</template>
