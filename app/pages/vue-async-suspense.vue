<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（异步组件篇）· defineAsyncComponent + &lt;Suspense&gt;
// · Vue2：() => import() 动态组件 + 手写 loading 态；
// · Vue3：defineAsyncComponent(() => import()) 懒加载，包 &lt;Suspense&gt; 原生提供 #fallback；
// · React 对照：React.lazy(() => import()) + &lt;Suspense fallback&gt;。
// 📌 实战定位：代码分割/异步加载【了解即可·进阶】；重图表/编辑器按需加载，首屏更快。
// 🧭 学习模式：🔧固定写法=defineAsyncComponent + &lt;Suspense&gt;#fallback；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { defineAsyncComponent, ref } from 'vue'

// 🔧 固定写法：懒加载重组件
const Heavy = defineAsyncComponent(() => import('~/components/Heavy.vue'))
const show = ref(false)
// 👉 练习：加一个“卸载重组件”的开关
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">异步组件 + Suspense · pages/vue-async-suspense.vue</h1>
    <button class="rounded bg-blue-600 px-3 py-1 text-white" @click="show = !show">切换重组件</button>

    <Suspense v-if="show">
      <template #default><Heavy /></template>
      <template #fallback><p class="text-sm text-gray-400">加载中…（Suspense fallback）</p></template>
    </Suspense>

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
          <tr class="border-b"><td class="px-2 py-1">懒加载</td><td class="px-2 py-1">() => import()</td><td class="px-2 py-1">defineAsyncComponent</td><td class="px-2 py-1">React.lazy</td></tr>
          <tr class="border-b"><td class="px-2 py-1">加载态</td><td class="px-2 py-1">手写 loading</td><td class="px-2 py-1">&lt;Suspense&gt;#fallback</td><td class="px-2 py-1">&lt;Suspense fallback&gt;</td></tr>
          <tr class="border-b"><td class="px-2 py-1">顶层 await</td><td class="px-2 py-1">不支持</td><td class="px-2 py-1">setup 顶层 await（需 Suspense）</td><td class="px-2 py-1">同</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：异步组件的加载态用 &lt;Suspense&gt; 统一接管；setup 里写顶层 await 也必须包在 &lt;Suspense&gt; 内（见 ~/components/Heavy.vue）。</p>
    </details>
  </main>
</template>
