<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（跨层传值篇）· provide / inject
// · Vue2：provide/inject（选项式，非响应式默认）或 event bus；
// · Vue3：import { provide, inject }，祖先 provide(key,val)，后代 inject(key,默认值)；
// · React 对照：createContext + Context.Provider / useContext。
// 📌 实战定位：跨层（爷→孙）传值【常规业务常用】；主题、当前用户、locale 常走 provide。
// 🧭 学习模式：🔧固定写法=provide(key,val) + inject(key,默认)；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, provide, inject } from 'vue'

// 🔧 固定写法：祖先 provide 一个响应式值
const theme = ref('dark')
provide('theme', theme)
// 👉 练习：在孙组件里 inject 后改 theme，看祖先是否同步
const childTheme = inject('theme', ref('light'))
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">跨层传值 provide / inject · pages/vue-provide-inject.vue</h1>
    <p>祖先提供的 theme：{{ theme }}（孙组件 inject 到：{{ childTheme }}）</p>
    <button class="rounded bg-blue-600 px-3 py-1 text-white" @click="theme = theme === 'dark' ? 'light' : 'dark'">
      切换主题
    </button>

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
          <tr class="border-b"><td class="px-2 py-1">祖先提供</td><td class="px-2 py-1">provide(){...}</td><td class="px-2 py-1">provide(key,val)</td><td class="px-2 py-1">&lt;Ctx.Provider value&gt;</td></tr>
          <tr class="border-b"><td class="px-2 py-1">后代取</td><td class="px-2 py-1">inject('key')</td><td class="px-2 py-1">inject('key',默认)</td><td class="px-2 py-1">useContext(Ctx)</td></tr>
          <tr class="border-b"><td class="px-2 py-1">响应式</td><td class="px-2 py-1">需传 reactive</td><td class="px-2 py-1">传 ref/reactive 即响应</td><td class="px-2 py-1">依赖 state</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：provide/inject 解决 props 层层透传的痛点；要响应式就 provide 一个 ref/reactive，后代 inject 到的是同一引用。</p>
    </details>
  </main>
</template>
