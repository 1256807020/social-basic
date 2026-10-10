<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（Nuxt 全栈篇）· 自定义 server 路由
// · Vue2/Nuxt2：serverMiddleware / server routes；
// · Vue3/Nuxt：server/api/*.ts 用 defineEventHandler 写后端，与前端同源；
// · React 对照：Next Route Handler（app/api/.../route.ts）。
// 📌 实战定位：自定义后端接口【了解即可·进阶】；通用 CRUD 已用 /api/[resource]，这里演示“非 CRUD 聚合接口”。
// 🧭 学习模式：🔧固定写法=defineEventHandler(async () => {...})；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3(Nuxt)/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, onMounted } from 'vue'

const stats = ref<{ total: number } | null>(null)
async function load() {
  // 调本分支自带的自定义接口 /api/todo-stats（聚合统计，非通用 CRUD）
  stats.value = await $fetch('/api/todo-stats')
}
// 👉 练习：把 todo-stats 改成返回按状态分组的统计
onMounted(load)
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">Nuxt 自定义 server 路由 · pages/nuxt-server-route.vue</h1>
    <button class="rounded bg-blue-600 px-3 py-1 text-white" @click="load">取统计</button>
    <p v-if="stats" class="text-sm">todo 总数：{{ stats.total }}</p>

    <details class="mt-6 rounded border p-3 text-sm">
      <summary class="cursor-pointer font-semibold">📚 Vue2/Nuxt2 / Vue3(Nuxt) / React 三向对照 & 本项目小结</summary>
      <table class="mt-2 w-full border-collapse text-left">
        <thead>
          <tr class="border-b">
            <th class="px-2 py-1">维度</th>
            <th class="px-2 py-1">Nuxt2</th>
            <th class="px-2 py-1">Nuxt (Vue3)</th>
            <th class="px-2 py-1">React (Next)</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b"><td class="px-2 py-1">位置</td><td class="px-2 py-1">server/index.ts</td><td class="px-2 py-1">server/api/*.ts</td><td class="px-2 py-1">app/api/*.ts</td></tr>
          <tr class="border-b"><td class="px-2 py-1">写法</td><td class="px-2 py-1">connect 风格</td><td class="px-2 py-1">defineEventHandler</td><td class="px-2 py-1">export async function</td></tr>
          <tr class="border-b"><td class="px-2 py-1">CRUD</td><td class="px-2 py-1">手写</td><td class="px-2 py-1">通用引擎已覆盖</td><td class="px-2 py-1">手写/通用</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：server/api 写自定义后端（本例 /api/todo-stats 做聚合）；通用 CRUD 仍走 /api/[resource] 通用引擎，不要重复造轮子。</p>
    </details>
  </main>
</template>
