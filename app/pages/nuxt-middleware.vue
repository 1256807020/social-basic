<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（Nuxt 路由中间件篇）· middleware
// · Vue2/Nuxt2：middleware/ 导出函数；
// · Vue3/Nuxt：middleware/*.ts 用 defineNuxtRouteMiddleware，页面用 definePageMeta 绑定；
// · React 对照：Next middleware.ts（见 social-start 的 next-middleware-i18n）。
// 📌 实战定位：路由守卫【了解即可·进阶】；登录鉴权、语言重定向常用。
// 🧭 学习模式：🔧固定写法=defineNuxtRouteMiddleware + definePageMeta({middleware})；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3(Nuxt)/React 三向对照。
// ───────────────────────────────────────────────────────────
// 本页演示：访问本路由会经过 middleware/logger.ts（打印日志）。实战里可改造成“无 token 跳 /login”。
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">Nuxt 路由中间件 · pages/nuxt-middleware.vue</h1>
    <p class="text-sm">进入本页时已触发 <code>middleware/logger.ts</code>（控制台可见日志）。把其中逻辑换成“无 token 跳登录”即鉴权中间件。</p>

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
          <tr class="border-b"><td class="px-2 py-1">文件</td><td class="px-2 py-1">middleware/x.js</td><td class="px-2 py-1">middleware/x.ts</td><td class="px-2 py-1">middleware.ts</td></tr>
          <tr class="border-b"><td class="px-2 py-1">绑定</td><td class="px-2 py-1">页面 meta</td><td class="px-2 py-1">definePageMeta</td><td class="px-2 py-1">matcher 配置</td></tr>
          <tr class="border-b"><td class="px-2 py-1">鉴权</td><td class="px-2 py-1">可重定向</td><td class="px-2 py-1">可重定向</td><td class="px-2 py-1">可重定向</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：middleware 在路由进入前执行，可做日志/鉴权/重定向；实战把 logger 换成“无 token → navigate('/login')”即是登录守卫。</p>
    </details>
  </main>
</template>
