<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（错误边界篇）· onErrorCaptured
// · Vue2：errorCaptured 钩子（选项式）捕获子组件错误；
// · Vue3：onErrorCaptured((err) => {...}) 在组合式里捕获子孙错误，返回 false 阻止向上抛；
// · React 对照：class 组件 ErrorBoundary / 社区 useErrorBoundary（见 social-start）。
// 📌 实战定位：错误隔离【了解即可·进阶】；单个组件崩了不影响整页。
// 🧭 学习模式：🔧固定写法=onErrorCaptured((err) => { 记录; return false })；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, onErrorCaptured, defineComponent, h } from 'vue'

const errMsg = ref('')
// 🔧 固定写法：捕获子孙组件抛出的错误
onErrorCaptured((err) => {
  errMsg.value = (err as Error).message
  return false // 阻止继续向上冒泡
})

// 故意抛错的子组件（点按钮触发）
const Bomber = defineComponent({
  setup() {
    return () => h('button', {
      class: 'rounded bg-red-600 px-3 py-1 text-white',
      onClick: () => { throw new Error('子组件爆炸了 💥') },
    }, '点我抛错')
  },
})
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">错误边界 onErrorCaptured · pages/vue-error-boundary.vue</h1>
    <Bomber />
    <p v-if="errMsg" class="rounded border border-red-300 bg-red-50 p-2 text-sm text-red-600">捕获到：{{ errMsg }}</p>

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
          <tr class="border-b"><td class="px-2 py-1">捕获</td><td class="px-2 py-1">errorCaptured</td><td class="px-2 py-1">onErrorCaptured</td><td class="px-2 py-1">ErrorBoundary 类</td></tr>
          <tr class="border-b"><td class="px-2 py-1">范围</td><td class="px-2 py-1">子孙</td><td class="px-2 py-1">子孙</td><td class="px-2 py-1">子树</td></tr>
          <tr class="border-b"><td class="px-2 py-1">阻止冒泡</td><td class="px-2 py-1">return false</td><td class="px-2 py-1">return false</td><td class="px-2 py-1">不向上</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：onErrorCaptured 捕获子孙组件运行时错误并隔离，return false 阻止继续冒泡；React 需 class 组件或社区 Hook。</p>
    </details>
  </main>
</template>
