<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（工程篇）· 单元测试（Vitest + @vue/test-utils）
// · Vue2：@vue/test-utils + jest；
// · Vue3：Vitest（Vite 原生，快）+ @vue/test-utils 的 mount / wrapper；
// · React 对照：Vitest + RTL（见 social-start 的 advanced-engineering）。
// 📌 实战定位：单测【了解即可·进阶】；业务组件建议补用例，框架层已把工具链搭好。
// 🧭 学习模式：🔧固定写法=mount + wrapper.find / trigger；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
// 本分支已加 vitest + @vue/test-utils 依赖；示例 composable 见 app/composables/useCounter.ts，用例见 useCounter.spec.ts。
// 运行：pnpm vitest
import { useCounter } from '~/composables/useCounter'

const { count, inc } = useCounter(0)
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">单元测试 Vitest · pages/vue-test.vue</h1>
    <p class="text-sm">count：{{ count }} <button class="rounded bg-blue-600 px-2 py-0.5 text-white" @click="inc">+1</button></p>
    <p class="text-sm text-gray-500">用例：app/composables/useCounter.spec.ts（pnpm vitest 运行）</p>

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
          <tr class="border-b"><td class="px-2 py-1">测试栈</td><td class="px-2 py-1">jest + test-utils</td><td class="px-2 py-1">Vitest + test-utils</td><td class="px-2 py-1">Vitest + RTL</td></tr>
          <tr class="border-b"><td class="px-2 py-1">渲染</td><td class="px-2 py-1">mount</td><td class="px-2 py-1">mount</td><td class="px-2 py-1">render</td></tr>
          <tr class="border-b"><td class="px-2 py-1">触发</td><td class="px-2 py-1">trigger</td><td class="px-2 py-1">trigger</td><td class="px-2 py-1">fireEvent</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：单测栈 React/Vue 都用 Vitest；Vue 用 @vue/test-utils 的 mount/trigger，React 用 RTL 的 render/fireEvent，思路一致。</p>
    </details>
  </main>
</template>
