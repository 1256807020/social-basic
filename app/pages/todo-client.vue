<script setup lang="ts">
// 【A 版 · 客户端组件】背诵范本 · 路由 /todo-client
// 特点：一个 .vue 文件内用 onMounted + $fetch 把"查 / 增 / 改 / 删"全包了，
// 最直观，最适合初学 CRUD。所有数据交互都走接口 /api/todo，不直接读 data/*.json。
import type { Todo } from '~/types/todo'
import type { ApiListResult } from '~/types/api'

const todos = ref<Todo[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 8
const title = ref('')
const editing = ref<{ id: number; title: string } | null>(null)

// 查（GET /api/todo）
// 📌 生产写法：给 $fetch 传泛型参数，响应自带类型 —— 不用 `const x: any` 去断言。
async function load(p: number) {
  const res = await $fetch<ApiListResult<Todo>>('/api/todo', {
    query: { page: p, pageSize, sort: '-id' },
  })
  todos.value = res.data || []
  total.value = res.total || 0
  page.value = p
}
onMounted(() => load(1))

// 增（POST /api/todo）
async function add(e: Event) {
  e.preventDefault()
  if (!title.value.trim()) return
  await $fetch('/api/todo', { method: 'POST', body: { title: title.value, done: false } })
  title.value = ''
  load(page.value)
}
// 改状态（PUT /api/todo/:id，增量合并）
async function toggle(t: Todo) {
  await $fetch(`/api/todo/${t.id}`, { method: 'PATCH', body: { done: !t.done } })
  load(page.value)
}
// 改标题（PUT /api/todo/:id）
async function saveEdit(e: Event) {
  e.preventDefault()
  if (!editing.value) return
  await $fetch(`/api/todo/${editing.value.id}`, { method: 'PATCH', body: { title: editing.value.title } })
  editing.value = null
  load(page.value)
}
// 删（DELETE /api/todo/:id）
async function remove(id: number) {
  await $fetch(`/api/todo/${id}`, { method: 'DELETE' })
  load(page.value)
}
const totalPages = computed(() => Math.max(Math.ceil(total.value / pageSize), 1))
</script>

<template>
  <main class="mx-auto max-w-3xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">Todo 客户端组件范本 · pages/todo-client</h1>
    <p class="text-sm text-gray-500">
      路由 <code>/todo-client</code> ｜ 查/增/改/删 全在一个客户端组件内（onMounted + $fetch）
    </p>

    <!-- 新增 -->
    <form class="flex gap-2" @submit="add">
      <input v-model="title" placeholder="新待办标题" class="flex-1 rounded border px-2 py-1" />
      <button type="submit" class="rounded bg-blue-600 px-3 py-1 text-white">新增</button>
      <button type="button" class="rounded border px-3 py-1" @click="load(page)">刷新</button>
    </form>

    <!-- 列表 + 改 + 删 -->
    <ul class="space-y-2">
      <li v-for="t in todos" :key="t.id" class="flex items-center gap-2 border-b py-1">
        <input type="checkbox" :checked="!!t.done" @change="toggle(t)" />
        <template v-if="editing?.id === t.id">
          <form class="flex flex-1 gap-2" @submit="saveEdit">
            <input v-model="editing!.title" class="flex-1 rounded border px-2 py-1" />
            <button type="submit" class="rounded bg-green-600 px-2 py-1 text-white">保存</button>
          </form>
        </template>
        <template v-else>
          <span
            :class="['flex-1', t.done ? 'line-through text-gray-400' : '']"
            @dblclick="editing = { id: t.id, title: t.title }"
          >
            #{{ t.id }} {{ t.title }}
          </span>
        </template>
        <button class="text-sm text-blue-600" @click="editing = { id: t.id, title: t.title }">改</button>
        <button class="text-sm text-red-600" @click="remove(t.id)">删</button>
      </li>
    </ul>

    <!-- 分页 -->
    <div class="flex items-center justify-between text-sm">
      <button class="rounded border px-2 py-1 disabled:opacity-40" :disabled="page <= 1" @click="load(page - 1)">
        上一页
      </button>
      <span>{{ page }} / {{ totalPages }}（共 {{ total }}）</span>
      <button class="rounded border px-2 py-1 disabled:opacity-40" :disabled="page >= totalPages" @click="load(page + 1)">
        下一页
      </button>
    </div>
  </main>
</template>
