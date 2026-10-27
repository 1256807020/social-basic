<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 状态管理 · Pinia（组合式 store）—— 用真实 /api/todo 做生产级范例
// 【是什么】Pinia = Vue3 官方状态库；defineStore 写起来像 composable，无 mutations，TS 友好。
// 【为什么】跨组件全局状态（用户态/购物车/主题）放 store 比层层 props/emits 干净；
//          本例用 store 包裹真实接口调用，演示「客户端 store = 服务端数据的缓存层」生产模式。
// 【怎么用】defineStore('名',()=>({ state ref, actions })) + useStore()；
//          actions 里用 $fetch 调 /api/todo（增删查改），不手写 mock 假数据（符 §0 铁律）。
// 🔧 固定写法：组合式 store 返回 { state, actions }；📌 实战：store 调接口、组件只调 store。
// ↔ React：Zustand / Redux Toolkit（create()(set)）；Vue2：Vuex（state/mutations/getters）。
// ───────────────────────────────────────────────────────────
import { defineStore, createPinia, setActivePinia } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import type { Todo } from '~/types/todo'
import type { ApiListResult } from '~/types/api'
// 显式导入 $fetch（ofetch），避免依赖 Nuxt auto-import 全局类型——IDE ts-plugin 更易解析，SSR 安全（本页调用全在 onMounted/事件内，纯客户端）
import { $fetch } from 'ofetch'

// 本页未装 @pinia/nuxt，手动建 pinia 供 demo；真实 Nuxt 项目装 @pinia/nuxt 后删这行即可。
setActivePinia(createPinia())

// 🔧 固定写法：组合式 store（无 mutations，action 直接改 ref）
const useTodos = defineStore('todos', () => {
  const list = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 查：GET /api/todo（引擎返回 ApiListResult<Todo>；data 即数组）—— $fetch 直接返回响应体
  async function load() {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<ApiListResult<Todo>>('/api/todo')
      list.value = res.data
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
    } finally {
      loading.value = false
    }
  }

  // 增：POST /api/todo（引擎 schema-less，done 等字段前端多塞后端照收）
  async function add(title: string) {
    const t = title.trim()
    if (!t) return
    await $fetch('/api/todo', { method: 'POST', body: { title: t, done: false } })
    await load()
  }

  // 改状态：PATCH /api/todo/:id（增量合并，只发变更字段）→ 乐观更新本地
  async function toggle(t: Todo) {
    if (t.id == null) return
    const next = !t.done
    await $fetch(`/api/todo/${t.id}`, { method: 'PATCH', body: { done: next } })
    list.value = list.value.map((x) => (x.id === t.id ? { ...x, done: next } : x))
  }

  // 删：DELETE /api/todo/:id → 本地过滤（新数组才触发响应式）
  async function remove(t: Todo) {
    if (t.id == null) return
    await $fetch(`/api/todo/${t.id}`, { method: 'DELETE' })
    list.value = list.value.filter((x) => x.id !== t.id)
  }

  // 派生状态：未完成任务数（computed 自动追踪 list）
  const remaining = computed(() => list.value.filter((x) => !x.done).length)

  return { list, loading, error, remaining, load, add, toggle, remove }
})

const store = useTodos()
const title = ref('')

// 页面加载即拉取（store 包接口，组件只负责触发）
onMounted(() => store.load())
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">Pinia 状态管理 · pages/pinia-todo.vue</h1>

    <form class="flex gap-2" @submit.prevent="store.add(title); title = ''">
      <input v-model="title" class="flex-1 rounded border px-2 py-1" placeholder="新待办" />
      <button class="rounded bg-blue-600 px-3 py-1 text-white" type="submit">新增</button>
    </form>

    <p v-if="store.loading" class="text-sm text-gray-500">加载中…</p>
    <p v-else-if="store.error" class="text-sm text-red-600">出错：{{ store.error }}</p>

    <ul class="space-y-1 text-sm">
      <li v-for="t in store.list" :key="t.id" class="flex items-center gap-2 border-b py-1">
        <input type="checkbox" :checked="!!t.done" @change="store.toggle(t)" />
        <span :class="['flex-1', t.done ? 'line-through text-gray-400' : '']">{{ t.id }}. {{ t.title }}</span>
        <button class="text-sm text-red-600" @click="store.remove(t)">删</button>
      </li>
      <li v-if="!store.list.length" class="text-gray-400">暂无待办，先加一条 →</li>
    </ul>

    <p class="text-sm text-gray-600">未完成：{{ store.remaining }} / {{ store.list.length }}</p>

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
          <tr class="border-b"><td class="px-2 py-1">库</td><td class="px-2 py-1">Vuex</td><td class="px-2 py-1">Pinia</td><td class="px-2 py-1">Zustand/RTK</td></tr>
          <tr class="border-b"><td class="px-2 py-1">写法</td><td class="px-2 py-1">state/mutations</td><td class="px-2 py-1">defineStore(()=&gt;{...})</td><td class="px-2 py-1">create()(set)</td></tr>
          <tr class="border-b"><td class="px-2 py-1">mutations</td><td class="px-2 py-1">有</td><td class="px-2 py-1">无（action 直接改）</td><td class="px-2 py-1">无</td></tr>
          <tr class="border-b"><td class="px-2 py-1">TS</td><td class="px-2 py-1">一般</td><td class="px-2 py-1">强</td><td class="px-2 py-1">强</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：Pinia 是 Vue3 官方状态库，写法接近 composable、无 mutations；本例用 store 包裹真实 /api/todo 调用（查/增/改/删），演示「store = 服务端数据缓存层」的生产模式，组件只调 store 不碰接口。真实 Nuxt 项目装 @pinia/nuxt 即可全局 useStore（并删掉本页手动 createPinia 那行）。</p>
    </details>
  </main>
</template>
