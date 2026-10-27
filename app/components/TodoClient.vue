<script setup lang="ts">
import type { Todo } from '~/types/todo'

// 【B 版 · 客户端子组件】负责"增 / 改 / 删"等用户操作。
// 思路：本组件只管发请求调接口，改完调用 emit('refresh')，
// 让父级服务端组件（pages/todos.vue）通过 useAsyncData 的 refresh 重新取数。
// 📌 生产写法：props 用真实类型（Todo[]），不用 any —— 模板里写错字段名立刻报错。
const props = defineProps<{
  initial: Todo[]
  page: number
  totalPages: number
  total: number
}>()
const emit = defineEmits<{ refresh: [] }>()
const title = ref('')
const editing = ref<{ id: number; title: string } | null>(null)

// 增（POST /api/todo）
async function add(e: Event) {
  e.preventDefault()
  if (!title.value.trim()) return
  await $fetch('/api/todo', { method: 'POST', body: { title: title.value, done: false } })
  title.value = ''
  emit('refresh')
}
// 改状态（PUT /api/todo/:id，增量合并）
async function toggle(t: Todo) {
  await $fetch(`/api/todo/${t.id}`, { method: 'PATCH', body: { done: !t.done } })
  emit('refresh')
}
// 改标题（PUT /api/todo/:id）
async function saveEdit(e: Event) {
  e.preventDefault()
  if (!editing.value) return
  await $fetch(`/api/todo/${editing.value.id}`, { method: 'PATCH', body: { title: editing.value.title } })
  editing.value = null
  emit('refresh')
}
// 删（DELETE /api/todo/:id）
async function remove(id: number) {
  await $fetch(`/api/todo/${id}`, { method: 'DELETE' })
  emit('refresh')
}
</script>

<template>
  <div class="space-y-4">
    <!-- 新增 -->
    <form class="flex gap-2" @submit="add">
      <input v-model="title" placeholder="新待办标题" class="flex-1 rounded border px-2 py-1" />
      <button type="submit" class="rounded bg-blue-600 px-3 py-1 text-white">新增</button>
      <button type="button" class="rounded border px-3 py-1" @click="emit('refresh')">刷新</button>
    </form>

    <!-- 列表：查=SSR 已给 initial；改 / 删 在客户端 -->
    <ul class="space-y-2">
      <li v-for="t in initial" :key="t.id" class="flex items-center gap-2 border-b py-1">
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

    <!-- 服务端分页：点链接改 URL 的 page，父级 page 变化触发 useAsyncData 重新取数 -->
    <div class="flex items-center justify-between text-sm">
      <NuxtLink
        :to="{ query: { page: Math.max(page - 1, 1) } }"
        :class="['px-2 py-1 border rounded', page <= 1 ? 'pointer-events-none opacity-40' : '']"
      >
        上一页
      </NuxtLink>
      <span>{{ page }} / {{ totalPages }}（共 {{ total }}）</span>
      <NuxtLink
        :to="{ query: { page: Math.min(page + 1, totalPages) } }"
        :class="['px-2 py-1 border rounded', page >= totalPages ? 'pointer-events-none opacity-40' : '']"
      >
        下一页
      </NuxtLink>
    </div>
  </div>
</template>
