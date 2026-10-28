<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（性能篇）· 三板斧
// · Vue2：Object.freeze 大数组 / 手写虚拟列表 / 防抖；
// · Vue3：shallowRef / shallowReactive（跳过深层响应，提大列表）、markRaw（不代理第三方实例）、虚拟列表（vue-virtual-scroller）；
// · React 对照：React.lazy + Suspense、虚拟列表、useDebounce（见 social-start）。
// 📌 实战定位：性能优化【常规业务常用】；万级列表必虚拟列表，搜索必防抖，重组件必懒加载。
// 🧭 学习模式：🔧固定写法=shallowRef / markRaw / 虚拟列表；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { shallowRef, ref, markRaw, onMounted, computed } from 'vue'
import { useDebounceFn } from '@vueuse/core'

// 🔧 固定写法：shallowRef 只追踪 .value 替换，不深度代理内部元素
// 5000 个元素的数组整体替换 .value 才触发更新；期间读/改单个元素不触发响应式，省开销
const bigList = shallowRef<number[]>([])
// 👉 练习：把 5000 换 5 万，感受 shallowRef 的优势
onMounted(() => {
  bigList.value = Array.from({ length: 5000 }, (_, i) => i)
})

// 🔧 固定写法：markRaw 让第三方实例不进响应式代理（省开销）
// 典型场景：echarts / map / 富文本等自带状态机的实例，包成响应式反而拖慢且易出 bug
class ThirdPartyMap {
  zoom = 10
  setZoom(z: number) { this.zoom = z }
}
const rawInstance = markRaw(new ThirdPartyMap())
const zoomLog = ref('rawInstance.zoom = ' + rawInstance.zoom + '（非响应式，改了也不触发重渲染）')
function bumpZoom() {
  rawInstance.setZoom(rawInstance.zoom + 1)
  // 注意：rawInstance 不是响应式的，模板不会自动刷新；这里用 zoomLog 手动同步观测值
  zoomLog.value = 'zoom 已改为 ' + rawInstance.zoom + '（模板不自动更新，正是 markRaw 的目的）'
}

// 🔧 固定写法：防抖搜索 —— 输入停手 300ms 才过滤，避免每次按键重算大列表
const keyword = ref('')
const filtered = computed<number[]>(() => {
  if (!keyword.value) return bigList.value
  const k = keyword.value
  return bigList.value.filter(n => String(n).includes(k))
})
const onSearch = useDebounceFn((v: string) => (keyword.value = v), 300)
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">性能优化 · pages/vue-perf.vue</h1>

    <section class="rounded-2xl bg-white p-5 shadow dark:bg-zinc-900">
      <h2 class="font-bold">① shallowRef 大列表</h2>
      <p class="mt-1 text-sm opacity-70">
        浅响应列表长度：{{ bigList.length }}（shallowRef 避免深层代理，替换 .value 才触发更新）
      </p>
      <input
        class="mt-3 w-full rounded border px-2 py-1 text-sm dark:bg-zinc-800"
        placeholder="防抖搜索（停手 300ms 才过滤）"
        @input="onSearch(($event.target as HTMLInputElement).value)"
      />
      <p class="mt-2 text-sm opacity-70">
        命中 {{ filtered.length }} 条，仅渲染前 200 条示范（万级需虚拟列表）
      </p>
      <ul class="mt-2 grid max-h-60 grid-cols-6 gap-1 overflow-auto text-xs">
        <li
          v-for="n in filtered.slice(0, 200)"
          :key="n"
          class="rounded bg-zinc-100 px-1 py-0.5 text-center dark:bg-zinc-800"
        >{{ n }}</li>
      </ul>
    </section>

    <section class="rounded-2xl bg-white p-5 shadow dark:bg-zinc-900">
      <h2 class="font-bold">② markRaw 第三方实例</h2>
      <p class="mt-1 text-sm opacity-70">实例不进响应式代理，省开销；手动 mutation 不触发重渲染（正是目的）</p>
      <button class="mt-3 rounded bg-sky-500 px-3 py-1.5 text-sm text-white" @click="bumpZoom">
        +1 zoom（markRaw 实例）
      </button>
      <p class="mt-2 font-mono text-xs opacity-70">{{ zoomLog }}</p>
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
