<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（Nuxt 数据请求·客户端篇）· $fetch 调通用 CRUD 接口
// · Vue2：this.$http.get / axios 手写 CRUD；
// · Vue3/Nuxt：内置 $fetch（全局可用），客户端触发、手动刷新；
// · React 对照：fetch / axios（见 social-start 的 /todo-client）。
// 📌 实战定位：客户端 CRUD【常规业务常用】；按钮增删改后手动 load() 刷新列表。
// 🔴 铁律：social-basic 与 social-start 共用「一个 JSON=一张表=通用 CRUD 接口」思想，本分支一律走 /api/todo 真实接口，不碰 data/*.json。
// 🧭 学习模式：🔧固定写法=$fetch('/api/todo') + 解包 j.data（ApiListResult<Todo>）；👉=练习点（新增/编辑/删除 全套 CRUD 已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, onMounted } from 'vue'
import type { Todo } from '~/types/todo'
import type { ApiListResult } from '~/types/api'

const list = ref<Todo[]>([])
const error = ref('')

async function load() {
  error.value = ''
  try {
    // 列表走通用引擎：ApiListResult<Todo> 自带 data/total/page/pageSize/totalPages
    const j = await $fetch<ApiListResult<Todo>>('/api/todo?pageSize=20&sort=-id')
    list.value = j.data || []
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}
async function add() {
  const title = window.prompt('标题')
  if (!title) return
  error.value = ''
  try {
    await $fetch('/api/todo', { method: 'POST', body: { title, content: '' } })
    await load()
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}
// 👉 编辑：PATCH /api/todo/:id（只发变更字段，引擎 schema-less 照收）
async function edit(t: Todo) {
  const title = window.prompt('修改标题', t.title)
  if (title === null || title === t.title) return
  error.value = ''
  try {
    await $fetch(`/api/todo/${t.id}`, { method: 'PATCH', body: { title } })
    await load()
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}
async function del(id: number) {
  error.value = ''
  try {
    await $fetch(`/api/todo/${id}`, { method: 'DELETE' })
    await load()
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  }
}
onMounted(load)
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">Nuxt 客户端 CRUD · pages/nuxt-client-crud.vue</h1>
    <button class="rounded bg-blue-600 px-3 py-1 text-white" @click="add">+ 新增</button>
    <p v-if="error" class="rounded bg-red-50 px-3 py-1 text-sm text-red-600">{{ error }}</p>
    <ul class="space-y-1 text-sm">
      <li v-for="t in list" :key="t.id" class="flex items-center justify-between border-b py-1">
        <span>{{ t.id }}. {{ t.title }}</span>
        <span class="space-x-3">
          <button class="text-blue-500" @click="edit(t)">编辑</button>
          <button class="text-red-500" @click="del(t.id)">删除</button>
        </span>
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
      <p class="mt-2 text-gray-500">📝 小结：Nuxt 客户端用 $fetch 调 /api/todo 通用 CRUD；增/改/删后手动 load() 刷新列表。与 social-start 的 React 版一一对应。易错点：① 类型统一走 <code>~/types/todo</code> 的 <code>Todo</code> + <code>~/types/api</code> 的 <code>ApiListResult&lt;Todo&gt;</code>（列表信封自带 data/total/page/pageSize/totalPages），不要再在页面里手写内联接口类型；② <code>PATCH /api/todo/:id</code> 只发变更字段（如 <code>{ title }</code>），引擎 schema-less 照收，不必全量回传；③ $fetch 失败会抛异常，生产写法要 <code>try/catch</code> 把错误显给用户（本页用 <code>error</code> ref）；④ 接口地址一律 <code>/api/*</code>，绝不直读 <code>data/*.json</code>。</p>
    </details>
  </main>
</template>
