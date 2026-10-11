<script setup lang="ts">
// 【Vue3 能力 · VueUse 高频 composables 合集】
// 一个页面演示最常用的几个 VueUse 组合式函数，全部来自 @vueuse/core：
// useDark / useStorage / useMouse / useFetch / useClipboard / useDebounceFn
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
  </main>
</template>
