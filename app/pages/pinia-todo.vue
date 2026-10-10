<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（状态管理篇）· Pinia（组合式 store）
// · Vue2：Vuex（state/mutations/actions/getters，较繁琐）；
// · Vue3：Pinia —— defineStore 写起来像 composable，无 mutations，TS 友好；
// · React 对照：Zustand / Redux Toolkit（本项目 social-start 已用过）。
// 📌 实战定位：跨组件全局状态【常规业务常用】；用户态、购物车、主题等放 store。
// 🧭 学习模式：🔧固定写法=defineStore('名',()=>({state,actions})) + useStore()；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { createPinia, setActivePinia, defineStore, ref } from 'pinia'

setActivePinia(createPinia()) // 本页独立演示用；Nuxt 项目由 @pinia/nuxt 自动装

// 🔧 固定写法：组合式 store
const useTodo = defineStore('todo', () => {
  const list = ref<string[]>([])
  function add(t: string) {
    if (t.trim()) list.value.push(t)
  }
  // 👉 练习：加一个 remove(i) 删除方法
  return { list, add }
})
const store = useTodo()
const title = ref('')
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">Pinia 状态管理 · pages/pinia-todo.vue</h1>
    <form class="flex gap-2" @submit.prevent="store.add(title); title = ''">
      <input v-model="title" class="flex-1 rounded border px-2 py-1" placeholder="新待办" />
      <button class="rounded bg-blue-600 px-3 py-1 text-white" type="submit">新增</button>
    </form>
    <ul class="space-y-1 text-sm">
      <li v-for="(t, i) in store.list" :key="i" class="border-b py-1">{{ i + 1 }}. {{ t }}</li>
    </ul>

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
      <p class="mt-2 text-gray-500">📝 小结：Pinia 是 Vue3 官方状态库，写法接近 composable、无 mutations；本例为单页演示，真实 Nuxt 项目装 @pinia/nuxt 即可全局 useStore。</p>
    </details>
  </main>
</template>
