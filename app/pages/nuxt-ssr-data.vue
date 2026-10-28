<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（Nuxt 数据请求·SSR 篇）· useFetch / useAsyncData
// · Vue2：asyncData(){}（Nuxt2）在服务端取数，首屏直出 HTML；
// · Vue3/Nuxt：useFetch / useAsyncData —— 在「服务端组件」里顶层 await，首屏直出；
// · React 对照：服务端组件 fetch + cache:'no-store'（见 social-start 的 /todos）。
// 📌 实战定位：SSR 数据【常规业务常用】；首屏要 SEO / 要直出数据用 useFetch。
// 🔴 铁律：social-basic 与 social-start 共用「一个 JSON=一张表=通用 CRUD 接口」思想，
//    本分支一律走 /api/todo 真实接口，不碰 data/*.json。
// 🧭 学习模式：🔧固定写法=const { data, refresh } = await useFetch(url)；👉=练习点（已填刷新按钮）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { computed } from 'vue'
// 🔧 固定写法：类型集中放 app/types/（§0 类型铁律）—— 列表信封用 ApiListResult<Todo>，
//    自带 data/total/page/pageSize/totalPages；Todo 含 [key:string]:unknown 兜住引擎动态字段。
import type { Todo } from '~/types/todo'
import type { ApiListResult } from '~/types/api'

// 🔧 固定写法：服务端组件里顶层 await useFetch → 首屏直出 HTML（不会直读 data/*.json）。
//    useFetch 默认把 SSR 取数结果「水合」到客户端，不会重复请求；
//    若同一 URL 多处调用需传 key 去重（📌 Nuxt 双跑防重复请求）。
const { data, refresh } = await useFetch<ApiListResult<Todo>>('/api/todo?pageSize=20&sort=-id')

// 🔧 固定写法：用 computed 而非 ref 快照——refresh() 重拉后 data.value 变化，list 自动跟随刷新。
//    （若写成 const list = ref(data.value?.data||[]) 只会首屏快照一次，点刷新列表不更新。）
const list = computed<Todo[]>(() => data.value?.data ?? [])

// 👉 练习：给「刷新」按钮绑 refresh()，computed 会即时反映新数据。
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
          <tr class="border-b"><td class="px-2 py-1">刷新</td><td class="px-2 py-1">this.$fetchState</td><td class="px-2 py-1">refresh()（配合 computed）</td><td class="px-2 py-1">router.refresh()</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：useFetch 在「服务端组件」顶层 await 即首屏直出 HTML，客户端拿到水合结果不再重复请求；客户端 refresh() 重拉更新数据，用 <code>computed</code> 承接 data 才能即时刷新（直接 ref 快照会失效）。与 social-start React 版 SSR 思路一致。<br>
      📌 易错点：① 类型统一走 <code>~/types/todo</code> 的 <code>Todo</code> + <code>~/types/api</code> 的 <code>ApiListResult&lt;Todo&gt;</code>，别在页面内联接口类型；② 引擎 schema-less，后端加字段前端不动、前端多塞字段后端照收，类型只锁自己写错；③ 接口地址一律 <code>/api/*</code>，绝不直读 <code>data/*.json</code>；④ 同 URL 多处 useFetch 记得传 <code>key</code> 防重复请求。</p>
    </details>
  </main>
</template>
