<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（跨层传值篇）· provide / inject
// · Vue2：provide/inject（选项式，非响应式默认）或 event bus；
// · Vue3：import { provide, inject }，祖先 provide(key,val)，后代 inject(key,默认值)；
// · React 对照：createContext + Context.Provider / useContext。
// 📌 实战定位：跨层（爷→孙）传值【常规业务常用】；主题、当前用户、locale 常走 provide。
// 🧭 学习模式：🔧固定写法=provide(key,val) + inject(key,默认)；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, provide } from 'vue'

// 🔧 固定写法：祖先 provide 一个响应式 ref
const theme = ref('dark')
provide('theme', theme)
const app = ref("vue")
provide('app', app)
// 👉 练习（见 ThemeGrandChild.vue）：在「孙」组件里 inject 后改 theme.value，看祖先是否同步
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">跨层传值 provide / inject · pages/vue-provide-inject.vue</h1>
    <p>祖先提供的 theme：<b>{{ theme }}</b></p>
    <button class="rounded bg-blue-600 px-3 py-1 text-white" @click="theme = theme === 'dark' ? 'light' : 'dark'">
      祖先切换主题
    </button>
    <p class="text-sm text-gray-500">下面子/孙组件都没用 props 拿值，直接 inject 跨层获取——这正是 provide/inject 解决 props 层层透传痛点的地方。</p>

    <!-- 子组件（中间层不 inject）→ 孙组件（深层 inject 并切换） -->
    <ThemeChild />

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
          <tr class="border-b"><td class="px-2 py-1">跨层</td><td class="px-2 py-1">可跳层</td><td class="px-2 py-1">可跳层（爷→孙）</td><td class="px-2 py-1">可跳层</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：provide/inject 解决 props 层层透传的痛点；要响应式就 provide 一个 ref/reactive，后代 inject 到的是同一引用。</p>
    </details>
  </main>
</template>
