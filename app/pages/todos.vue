<script setup lang="ts">
// 【B 版 · 服务端 SSR + 服务端分页】背诵范本 · 路由 /todos
// 特点：① 列表在服务端 useAsyncData 渲染（首屏快、SEO 好）；
//      ② 分页由 URL 的 ?page= 驱动（route.query），点 NuxtLink 服务端重新按页取数；
//      ③ 增/改/删交给 <TodoClient/> 客户端子组件，改完 emit('refresh') 让服务端重拉。
// 注：Nuxt 的 $fetch 在 SSR 下对内部 /api 路由是"同进程直调"，不存在 Next 那种写死
// localhost:3000 误打到别的项目端口的风险。
import type { Todo } from '~/types/todo'
import type { ApiListResult } from '~/types/api'

const route = useRoute()
const pageSize = 8
const page = computed(() => Math.max(Number(route.query.page) || 1, 1))

const { data, refresh } = await useAsyncData(
  () => `todos-${page.value}`,
  async () => {
    // 📌 生产写法：$fetch 传泛型 → 响应自带类型，不用 any
    const res = await $fetch<ApiListResult<Todo>>('/api/todo', {
      query: { page: page.value, pageSize, sort: '-id' },
    })
    const total = res.total || 0
    return {
      data: res.data || [],
      total,
      totalPages: Math.max(Math.ceil(total / pageSize), 1),
    }
  },
  { watch: [page] },
)
</script>

<template>
  <main class="mx-auto max-w-3xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">Todo 服务端组件 SSR 范本 · pages/todos</h1>
    <p class="text-sm text-gray-500">
      路由 <code>/todos</code> ｜ SSR 列表 + 服务端分页（query.page）+ 客户端子组件写
    </p>
    <TodoClient
      :initial="data?.data || []"
      :page="page"
      :total-pages="data?.totalPages || 1"
      :total="data?.total || 0"
      @refresh="refresh"
    />
  </main>
</template>
