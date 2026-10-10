<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（Nuxt 数据请求·SSR 篇）· useFetch / useAsyncData
// · Vue2：asyncData(){}（Nuxt2）在服务端取数；
// · Vue3/Nuxt：useFetch / useAsyncData —— 在服务端组件里 await，首屏直出 HTML；
// · React 对照：服务端组件 fetch + cache:'no-store'（见 social-start 的 /todos）。
// 📌 实战定位：SSR 数据【常规业务常用】；首屏要 SEO / 要直出数据用 useFetch。
// 🔴 铁律：走 /api/todo 真实接口，不碰 data/*.json。
// 🧭 学习模式：🔧固定写法=const { data, refresh } = await useFetch(url)；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref } from 'vue'

interface Todo { id: number; title: string }
// 🔧 固定写法：服务端组件里 await，首屏直出；refresh() 客户端重拉
const { data, refresh } = await useFetch<{ code: number; data: Todo[] }>('/api/todo?pageSize=20&sort=-id')
const list = ref(data.value?.data || [])
// 👉 练习：加一个“刷新”按钮绑定 refresh()
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">Nuxt SSR 数据 · pages/nuxt-ssr-data.vue</h1>
    <button class="rounded bg-blue-600 px-3 py-1 text-white" @click="refresh()">刷新</button>
    <ul class="space-y-1 text-sm">
      <li v-for="t in list" :key="t.id" class="border-b py-1">{{ t.id }}. {{ t.title }}</li>
    </ul>

    <details class="mt-6 rounded border p-3 text-sm">
      <summary class="cursor-pointer font-semibold">📚 Vue2 / Vue3(Nuxt) / React 三向对照 & 本项目小结</summary>
      <table class="mt-2 w-full border-collapse text-left">
        <thead>
          <tr class="border-b">
            <th class="px-2 py-1">维度</th>
            <th class="px-2 py-1">Vue2 (Nuxt2)</th>
            <th class="px-2 py-1">Vue3 (Nuxt)</th>
            <th class="px-2 py-1">React</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b"><td class="px-2 py-1">取数</td><td class="px-2 py-1">asyncData()</td><td class="px-2 py-1">useFetch / useAsyncData</td><td class="px-2 py-1">服务端 fetch</td></tr>
          <tr class="border-b"><td class="px-2 py-1">首屏</td><td class="px-2 py-1">SSR 直出</td><td class="px-2 py-1">SSR 直出</td><td class="px-2 py-1">SSR 直出</td></tr>
          <tr class="border-b"><td class="px-2 py-1">刷新</td><td class="px-2 py-1">this.$fetchState</td><td class="px-2 py-1">refresh()</td><td class="px-2 py-1">router.refresh()</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：useFetch 在服务端组件 await 即首屏直出；客户端 refresh() 重拉。与 social-start React 版 SSR 思路一致。</p>
    </details>
  </main>
</template>
