<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// VueUse 高频 composables 合集（@vueuse/core）
// ① 视角：从 React 转 Vue3（或纯 Vue3 起步）；VueUse ≈ React 的 ahooks 角色。
// ② 实战定位：暗色/持久化/鼠标/请求/复制/防抖等高频副作用，用组合式函数一行接入。
// ③ 学习模式：🔧 固定写法 = 从 @vueuse/core 取 useXxx，直接得到响应式 ref；
//          👉 练习点 = 把 useFetch 换成你自己的接口，或加 useEventListener 监听 resize。
// 📌 注意：VueUse 与 React 的 ahooks 一一对应（useDark↔useDark、useDebounceFn↔useDebounceFn），
//    只是 Vue 端返回 ref、React 端返回 [value, fn] 元组。
// ───────────────────────────────────────────────────────────
import { useDark, useStorage, useMouse, useFetch, useClipboard, useDebounceFn } from '@vueuse/core'
import { ref, computed } from 'vue'

// 暗色模式（自动持久化到 localStorage，并切换 <html class="dark">）
const isDark = useDark()

// 计数器（持久化，刷新不丢）
const count = useStorage('vu-demo-count', 0)

// 鼠标坐标
const { x, y } = useMouse()

// 网络请求（SSR 安全，自动 fetch）
const { data, error } = useFetch('https://jsonplaceholder.typicode.com/todos/1').json()

// 剪贴板
const source = ref('https://vueuse.org')
const { copy, copied } = useClipboard({ source })

// 防抖输入
const raw = ref('')
const debounced = ref('')
const onInput = useDebounceFn((v: string) => (debounced.value = v), 400)

const todoTitle = computed(() => (error.value ? '请求失败' : (data.value as any)?.title ?? '加载中…'))
</script>

<template>
  <main class="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-white">
    <div class="mx-auto max-w-3xl space-y-4">
      <h1 class="text-3xl font-black">VueUse 常用 composables</h1>

      <div class="grid gap-4 sm:grid-cols-2">
        <section class="rounded-2xl bg-white p-5 shadow dark:bg-zinc-900">
          <h2 class="font-bold">useDark</h2>
          <p class="mt-1 text-sm opacity-70">当前：{{ isDark ? '🌙 暗色' : '☀️ 亮色' }}（已写入 html.dark）</p>
          <button class="mt-3 rounded bg-zinc-900 px-3 py-1.5 text-sm text-white dark:bg-white dark:text-zinc-900" @click="isDark = !isDark">切换</button>
        </section>

        <section class="rounded-2xl bg-white p-5 shadow dark:bg-zinc-900">
          <h2 class="font-bold">useStorage</h2>
          <p class="mt-1 text-sm opacity-70">计数：{{ count }}（刷新页面仍在）</p>
          <button class="mt-3 rounded bg-indigo-500 px-3 py-1.5 text-sm text-white" @click="count++">+1</button>
        </section>

        <section class="rounded-2xl bg-white p-5 shadow dark:bg-zinc-900">
          <h2 class="font-bold">useMouse</h2>
          <p class="mt-1 font-mono text-sm opacity-70">x: {{ Math.round(x) }}, y: {{ Math.round(y) }}</p>
        </section>

        <section class="rounded-2xl bg-white p-5 shadow dark:bg-zinc-900">
          <h2 class="font-bold">useFetch</h2>
          <p class="mt-1 text-sm opacity-70">todo: {{ todoTitle }}</p>
        </section>

        <section class="rounded-2xl bg-white p-5 shadow dark:bg-zinc-900">
          <h2 class="font-bold">useClipboard</h2>
          <p class="mt-1 break-all font-mono text-xs opacity-70">{{ source }}</p>
          <button class="mt-3 rounded bg-emerald-500 px-3 py-1.5 text-sm text-white" @click="copy(source)">
            {{ copied ? '已复制 ✓' : '复制' }}
          </button>
        </section>

        <section class="rounded-2xl bg-white p-5 shadow dark:bg-zinc-900">
          <h2 class="font-bold">useDebounceFn</h2>
          <input
            class="mt-1 w-full rounded border px-2 py-1 text-sm dark:bg-zinc-800"
            placeholder="输入…400ms 后生效"
            :value="raw"
            @input="(e: any) => { raw = e.target.value; onInput(e.target.value) }"
          />
          <p class="mt-2 text-sm opacity-70">防抖结果：{{ debounced || '—' }}</p>
        </section>
      </div>
    </div>
  <details class="mt-8 rounded border p-4 text-sm">
    <summary class="cursor-pointer font-semibold">Vue2 / Vue3 / React 三向对照 + 小结</summary>
    <table class="mt-2 w-full border-collapse text-left">
      <thead><tr class="border-b">
        <th class="px-2 py-1">能力</th><th class="px-2 py-1">Vue2</th><th class="px-2 py-1">Vue3 (本页 VueUse)</th><th class="px-2 py-1">React (ahooks)</th>
      </tr></thead>
      <tbody>
        <tr class="border-b"><td class="px-2 py-1">暗色</td><td class="px-2 py-1">手写 toggleClass</td><td class="px-2 py-1">useDark</td><td class="px-2 py-1">useDark（ahooks 无，用 state）</td></tr>
        <tr class="border-b"><td class="px-2 py-1">持久化</td><td class="px-2 py-1">localStorage + watch</td><td class="px-2 py-1">useStorage</td><td class="px-2 py-1">useLocalStorageState</td></tr>
        <tr class="border-b"><td class="px-2 py-1">请求</td><td class="px-2 py-1">axios + watch</td><td class="px-2 py-1">useFetch</td><td class="px-2 py-1">useRequest / useFetch（ahooks）</td></tr>
        <tr class="border-b"><td class="px-2 py-1">防抖</td><td class="px-2 py-1">lodash.debounce</td><td class="px-2 py-1">useDebounceFn</td><td class="px-2 py-1">useDebounceFn</td></tr>
      </tbody>
    </table>
    <p class="mt-2 text-gray-400">📝 小结：VueUse 是 Vue 版的 ahooks——高频副作用一行接入，返回 ref。React 端多为 [value, fn] 元组，Vue 端直接 ref，心智略不同但能力对等。</p>
  </details>
</main>
</template>
