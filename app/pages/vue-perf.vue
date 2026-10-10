<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（性能篇）· 三板斧
// · Vue2：Object.freeze 大数组 / 手写虚拟列表 / 防抖；
// · Vue3：shallowRef / shallowReactive（跳过深层响应，提大列表）、markRaw（不代理第三方实例）、虚拟列表（vue-virtual-scroller）；
// · React 对照：React.lazy + Suspense、虚拟列表、useDebounce（见 social-start）。
// 📌 实战定位：性能优化【常规业务常用】；万级列表必虚拟列表，搜索必防抖，重组件必懒加载。
// 🧭 学习模式：🔧固定写法=shallowRef / markRaw / 虚拟列表；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { shallowRef, markRaw, onMounted } from 'vue'

// 🔧 固定写法：shallowRef 只追踪 .value 替换，不深度代理内部
const bigList = shallowRef<number[]>([])
// markRaw：第三方实例（如 echarts/map）不进响应式代理，省开销
onMounted(() => {
  bigList.value = Array.from({ length: 5000 }, (_, i) => i)
})
// 👉 练习：把 5000 换 5 万，感受 shallowRef 的优势
void markRaw
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">性能优化 · pages/vue-perf.vue</h1>
    <p class="text-sm">浅响应列表长度：{{ bigList.value.length }}（shallowRef 避免深层代理）</p>

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
          <tr class="border-b"><td class="px-2 py-1">大列表</td><td class="px-2 py-1">Object.freeze</td><td class="px-2 py-1">shallowRef / 虚拟列表</td><td class="px-2 py-1">虚拟列表</td></tr>
          <tr class="border-b"><td class="px-2 py-1">第三方实例</td><td class="px-2 py-1">不响应</td><td class="px-2 py-1">markRaw</td><td class="px-2 py-1">useRef（不代理）</td></tr>
          <tr class="border-b"><td class="px-2 py-1">防抖</td><td class="px-2 py-1">lodash.debounce</td><td class="px-2 py-1">lodash / composable</td><td class="px-2 py-1">useDebounce</td></tr>
          <tr class="border-b"><td class="px-2 py-1">懒加载</td><td class="px-2 py-1">() => import()</td><td class="px-2 py-1">defineAsyncComponent</td><td class="px-2 py-1">React.lazy</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：三板斧——shallowRef/markRaw 提大列表、虚拟列表、防抖；万级数据必上虚拟列表，否则卡顿。</p>
    </details>
  </main>
</template>
