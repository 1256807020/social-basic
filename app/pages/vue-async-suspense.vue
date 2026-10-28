<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（异步组件篇）· defineAsyncComponent + <Suspense>
// · Vue2：() => import() 动态组件 + 手写 loading 态；
// · Vue3：defineAsyncComponent(() => import()) 懒加载，包 <Suspense> 原生提供 #fallback；
// · React 对照：React.lazy(() => import()) + <Suspense fallback>。
// 📌 实战定位：代码分割/异步加载【了解即可·进阶】；重图表/编辑器按需加载，首屏更快。
// 🧭 学习模式：🔧固定写法=defineAsyncComponent + <Suspense>#fallback；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { defineAsyncComponent, ref } from 'vue'

// 🔧 固定写法：懒加载重组件
// loader 指向 ~/components/Heavy.vue（Nuxt srcDir='app'，~ 即 app/）；
// delay 200ms 避免极快加载时的闪烁，timeout 3000ms 防止接口卡死一直转圈
const Heavy = defineAsyncComponent({
  loader: () => import('~/components/Heavy.vue'),
  delay: 200,
  timeout: 3000,
})
const show = ref(false) // 控制是否挂载 <Suspense> 边界
// 👉 练习：加一个“卸载重组件”的开关 —— mounted 控制 Heavy 是否被渲染
const mounted = ref(true)
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">异步组件 + Suspense · pages/vue-async-suspense.vue</h1>

    <section class="rounded-2xl bg-white p-5 shadow dark:bg-zinc-900">
      <h2 class="font-bold">① defineAsyncComponent + &lt;Suspense&gt;</h2>
      <p class="mt-1 text-sm opacity-70">
        重组件（setup 顶层 await 模拟 800ms）懒加载，加载态由 &lt;Suspense&gt;#fallback 接管；
        delay 200ms 防闪烁，timeout 3000ms 防卡死。
      </p>
      <div class="mt-3 flex flex-wrap gap-2">
        <button class="rounded bg-blue-600 px-3 py-1 text-white" @click="show = !show">
          {{ show ? '卸载 Suspense' : '挂载重组件' }}
        </button>
        <button
          v-if="show"
          class="rounded bg-amber-500 px-3 py-1 text-white"
          @click="mounted = !mounted"
        >
          {{ mounted ? '卸载重组件' : '重新挂载重组件' }}
        </button>
      </div>

      <Suspense v-if="show">
        <template #default>
          <Heavy v-if="mounted" />
        </template>
        <template #fallback>
          <p class="mt-3 text-sm text-gray-400">加载中…（Suspense fallback，模拟 800ms）</p>
        </template>
      </Suspense>
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
          <tr class="border-b"><td class="px-2 py-1">懒加载</td><td class="px-2 py-1">() => import()</td><td class="px-2 py-1">defineAsyncComponent</td><td class="px-2 py-1">React.lazy</td></tr>
          <tr class="border-b"><td class="px-2 py-1">加载态</td><td class="px-2 py-1">手写 loading</td><td class="px-2 py-1">&lt;Suspense&gt;#fallback</td><td class="px-2 py-1">&lt;Suspense fallback&gt;</td></tr>
          <tr class="border-b"><td class="px-2 py-1">顶层 await</td><td class="px-2 py-1">不支持</td><td class="px-2 py-1">setup 顶层 await（需 Suspense）</td><td class="px-2 py-1">同</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：异步组件的加载态用 &lt;Suspense&gt; 统一接管；setup 里写顶层 await 也必须包在 &lt;Suspense&gt; 内（见 ~/components/Heavy.vue）。切换“卸载重组件”可观察每次重新挂载都会重新走 800ms 异步初始化。</p>
    </details>
  </main>
</template>
