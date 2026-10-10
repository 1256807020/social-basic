<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（Nuxt 数据请求·客户端篇）· $fetch 调通用 CRUD 接口
// · Vue2：this.$http.get / axios 手写 CRUD；
// · Vue3/Nuxt：内置 $fetch（全局可用），客户端触发、手动刷新；
// · React 对照：fetch / axios（见 social-start 的 /todo-client）。
// 📌 实战定位：客户端 CRUD【常规业务常用】；按钮增删改后手动 load() 刷新列表。
// 🔴 铁律：social-basic 与 social-start 共用「一个 JSON=一张表=通用 CRUD 接口」思想，本分支一律走 /api/todo 真实接口，不碰 data/*.json。
// 🧭 学习模式：🔧固定写法=$fetch('/api/todo') + 解包 j.data；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, onMounted } from 'vue'

interface Todo { id: number; title: string; content?: string }

const list = ref<Todo[]>([])
async function load() {
  const j = await $fetch<{ code: number; data: Todo[] }>('/api/todo?pageSize=20&sort=-id')
  list.value = j.data || []
}
async function add() {
  const title = prompt('标题')
  if (!title) return
  await $fetch('/api/todo', { method: 'POST', body: { title, content: '' } })
  await load()
}
async function del(id: number) {
  await $fetch(`/api/todo/${id}`, { method: 'DELETE' })
  await load()
}
// 👉 练习：加一个编辑（PATCH /api/todo/:id）
onMounted(load)
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">Nuxt 客户端 CRUD · pages/nuxt-client-crud.vue</h1>
    <button class="rounded bg-blue-600 px-3 py-1 text-white" @click="add">+ 新增</button>
    <ul class="space-y-1 text-sm">
      <li v-for="t in list" :key="t.id" class="flex justify-between border-b py-1">
        <span>{{ t.id }}. {{ t.title }}</span>
        <button class="text-red-500" @click="del(t.id)">删除</button>
      </li>
    </ul>

    <details class="mt-6 rounded border p-3 text-sm">
      <summary class="cursor-pointer font-semibold">📚 Vue2 / Vue3(Nuxt) / React 三向对照 & 本项目小结</summary>
      <table class="mt-2 w-full border-collapse text-left">
        <thead>
          <tr class="border-b">
            <th class="px-2 py-1">维度</th>
            <th class="px-2 py-1">Vue2</th>
            <th class="px-2 py-1">Vue3 (Nuxt)</th>
            <th class="px-2 py-1">React</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b"><td class="px-2 py-1">请求</td><td class="px-2 py-1">axios</td><td class="px-2 py-1">$fetch（内置）</td><td class="px-2 py-1">fetch</td></tr>
          <tr class="border-b"><td class="px-2 py-1">刷新</td><td class="px-2 py-1">重新调接口</td><td class="px-2 py-1">重新调 load()</td><td class="px-2 py-1">重新 setState</td></tr>
          <tr class="border-b"><td class="px-2 py-1">接口</td><td class="px-2 py-1">手写后端</td><td class="px-2 py-1">/api/todo 通用引擎</td><td class="px-2 py-1">/api/todo 通用引擎</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：Nuxt 客户端用 $fetch 调 /api/todo 通用 CRUD；增删后手动 load() 刷新。与 social-start 的 React 版一一对应。</p>
    </details>
  </main>
</template>
