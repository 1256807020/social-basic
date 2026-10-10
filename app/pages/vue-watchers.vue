<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（侦听篇）· watch / watchEffect
// · Vue2：watch: { name(n,o){...} }，或 this.$watch；
// · Vue3：watch(源, cb) 精确侦听；watchEffect(fn) 自动追踪依赖立即跑一次；
// · React 对照：useEffect(fn, [dep]) 近似 watch（但 React 是「依赖变化重跑」）。
// 📌 实战定位：侦听变化【基础必学】；搜索框防抖、监听路由/表单变化、联动计算都靠它。
// 🧭 学习模式：🔧固定写法=watch(src, cb) / watchEffect(fn)；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, watch, watchEffect } from 'vue'

const name = ref('Tom')
const log = ref<string[]>([])

// 🔧 固定写法：watch 侦听 name，cb 拿 (新值, 旧值)
watch(name, (n, o) => {
  // 👉 练习：在这里加“防抖”再 push 日志
  log.value.push(`watch: ${o} → ${n}`)
})
// watchEffect：自动收集依赖（这里依赖 name），立即执行一次 + 变化重跑
watchEffect(() => {
  log.value.push(`watchEffect 看到 name=${name.value}`)
})
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">侦听 watch / watchEffect · pages/vue-watchers.vue</h1>
    <input v-model="name" class="w-full rounded border px-2 py-1" placeholder="改名字看日志" />
    <ul class="space-y-1 text-sm">
      <li v-for="(l, i) in log.slice(-6)" :key="i" class="border-b py-0.5">{{ l }}</li>
    </ul>

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
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：watch 给你新旧值、可控；watchEffect 自动收集依赖、写法更短；两者都在 setup 里调用，返回 stop 函数可手动停止。</p>
    </details>
  </main>
</template>
