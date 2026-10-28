<script setup lang="ts">
// ── 页首三段式（项目分析）────────────────────────────
// ① 视角/切入点：从 Nuxt2（serverMiddleware / connect 风格）升级到 Nuxt3（server/api/*.ts + defineEventHandler）；对照 React/Next 的 Route Handler（app/api/*.ts）。
// ② 实战定位：自定义后端接口 —— 通用 CRUD 由 /api/[resource] 引擎覆盖，这里演示「引擎之外的聚合 / 计算接口」。
// ③ 学习模式：🔧 固定写法 = defineEventHandler(async () => {...})；👉 练习点 = 把 todo-stats 改成「按状态分组统计」。
// ─────────────────────────────────────────────────────
import { ref, onMounted } from 'vue'

// 🔧 固定写法：$fetch 是 Nuxt 自动导入的客户端请求封装，调同源自定义接口无需手写 baseURL。
// 📌 值得记录：把 URL 用 string 类型变量传入 + 显式泛型，可绕过 Nitro「逐路由字面量类型」的递归溢出（动态路由 /api/:resource 会触发 TS2321）。
const statsUrl: string = '/api/todo-stats'
const stats = ref<{ total: number } | null>(null)
async function load() {
  // 调本分支自带的自定义接口 /api/todo-stats（聚合统计，非通用 CRUD）
  stats.value = await $fetch<{ total: number }>(statsUrl)
}
// 👉 练习：把 todo-stats 改成返回「按状态分组」的统计（见文末代码）
onMounted(load)
</script>

<template>
  <main class="mx-auto max-w-3xl space-y-6 p-6">
    <!-- 页首三段式项目分析卡片（① 视角/切入点 ② 实战定位 ③ 学习模式标记） -->
    <section class="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed">
      <h1 class="mb-3 text-2xl font-bold text-slate-800">Nuxt 自定义 server 路由 · pages/nuxt-server-route.vue</h1>
      <p><span class="font-semibold text-emerald-600">① 视角/切入点：</span>从 Nuxt2（serverMiddleware / connect 风格）升级到 Nuxt3（<code>server/api/*.ts</code> + <code>defineEventHandler</code>）；对照 React/Next 的 Route Handler（<code>app/api/*.ts</code>）。</p>
      <p><span class="font-semibold text-sky-600">② 实战定位：</span>自定义后端接口 —— 通用 CRUD 由 <code>/api/[resource]</code> 引擎覆盖，这里演示「引擎之外的聚合 / 计算接口」。</p>
      <p><span class="font-semibold text-amber-600">③ 学习模式：</span>🔧 固定写法 = <code>defineEventHandler(async () =&gt; {...})</code>；👉 练习点 = 把 <code>todo-stats</code> 改成「按状态分组统计」。</p>
    </section>

    <!-- 🔧 固定写法：调同源自定义接口 -->
    <section class="rounded-lg border border-slate-200 p-4 text-sm">
      <h2 class="mb-2 text-lg font-semibold">🔧 调自定义接口 <code>/api/todo-stats</code></h2>
      <button class="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700" @click="load">取统计</button>
      <p v-if="stats" class="mt-2">todo 总数：<span class="font-semibold">{{ stats.total }}</span></p>
      <p v-else class="mt-2 text-slate-400">加载中…</p>
    </section>

    <!-- 👉 练习点：server 路由源码（核心就 defineEventHandler + 内部聚合） -->
    <section class="rounded-lg border border-slate-200 p-4 text-sm">
      <h2 class="mb-2 text-lg font-semibold">👉 练习点：<code>server/api/todo-stats.ts</code> 长这样</h2>
      <pre class="overflow-x-auto rounded bg-slate-900 p-3 text-xs leading-relaxed text-slate-100"><code>// 🔧 固定写法：defineEventHandler 定义 server 路由，文件名即路径 /api/todo-stats
export default defineEventHandler(async () =&gt; {
  // 📌 内部再调通用引擎聚合（也可直接读库，避免走 HTTP 回环）
  const res = await $fetch('http://localhost:3000/api/todo?pageSize=9999')
  const items: unknown[] = (res as { data?: unknown[] }).data || []
  return { total: items.length }
})</code></pre>
      <p class="mt-2 text-slate-500">↔ 跨框架差异：Vue2/Nuxt2 用 connect 风格 <code>serverMiddleware</code>；React/Next 在 <code>app/api/.../route.ts</code> 里 <code>export async function GET()</code> 写 Route Handler，没有「文件名即路由」的 server/api 约定。</p>
    </section>

    <!-- 文末 <details>：Vue2 / Vue3(Nuxt) / React 三向对照 + 小结（§16 必填） -->
    <details class="rounded-lg border border-slate-200 p-4 text-sm">
      <summary class="cursor-pointer font-semibold text-slate-700">📚 Vue2 / Vue3(Nuxt) / React(Next) 三向对照 &amp; 本项目小结</summary>
      <table class="mt-3 w-full border-collapse text-left">
        <thead>
          <tr class="border-b border-slate-300">
            <th class="px-2 py-1">维度</th>
            <th class="px-2 py-1">Vue2 (Nuxt2)</th>
            <th class="px-2 py-1">Vue3 (Nuxt3)</th>
            <th class="px-2 py-1">React (Next)</th>
          </tr>
        </thead>
        <tbody class="text-slate-600">
          <tr class="border-b border-slate-100"><td class="px-2 py-1 font-medium">位置</td><td class="px-2 py-1">server/index.ts</td><td class="px-2 py-1">server/api/*.ts</td><td class="px-2 py-1">app/api/*.ts</td></tr>
          <tr class="border-b border-slate-100"><td class="px-2 py-1 font-medium">写法</td><td class="px-2 py-1">connect 风格</td><td class="px-2 py-1">defineEventHandler</td><td class="px-2 py-1">export async function GET</td></tr>
          <tr class="border-b border-slate-100"><td class="px-2 py-1 font-medium">路由规则</td><td class="px-2 py-1">手写挂载</td><td class="px-2 py-1">文件名即路径</td><td class="px-2 py-1">目录即路径</td></tr>
          <tr class="border-b border-slate-100"><td class="px-2 py-1 font-medium">CRUD</td><td class="px-2 py-1">手写</td><td class="px-2 py-1">通用引擎已覆盖</td><td class="px-2 py-1">手写/通用</td></tr>
        </tbody>
      </table>
      <p class="mt-3 text-slate-500">📝 小结：<code>server/api</code> 写自定义后端（本例 <code>/api/todo-stats</code> 做聚合）；通用 CRUD 仍走 <code>/api/[resource]</code> 通用引擎，不要重复造轮子。三层框架思路一致（在前端目录里写后端），差异在「文件名即路由 vs 目录即路由」与事件处理函数签名。</p>
    </details>
  </main>
</template>
