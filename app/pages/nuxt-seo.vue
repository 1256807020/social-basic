<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（Nuxt SEO 篇）· useSeoMeta
// · Vue2/Nuxt2：this.$seoMeta / 手动改 head()；
// · Vue3/Nuxt：useSeoMeta({ title, description, ogTitle... }) 自动注入 <head>；
// · React 对照：next/head 或 metadata 导出（见 social-start）。
// 📌 实战定位：SEO/社交分享【了解即可·进阶】；官网/营销页必备。
// 🧭 学习模式：🔧固定写法=useSeoMeta({ title, description })；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3(Nuxt)/React 三向对照。
// ───────────────────────────────────────────────────────────
// 🔧 固定写法：自动生成 <title> / <meta description> / og 标签
useSeoMeta({
  title: 'Social Basic · Vue3 学习基地',
  description: '从 Vue2 升级到 Vue3 的实战示例集',
  ogTitle: 'Social Basic',
})
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">Nuxt SEO · pages/nuxt-seo.vue</h1>
    <p class="text-sm">查看页面源代码，<code>&lt;head&gt;</code> 里已自动生成 title / description / og 标签。</p>

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
          <tr class="border-b"><td class="px-2 py-1">注入</td><td class="px-2 py-1">head() 手写</td><td class="px-2 py-1">useSeoMeta</td><td class="px-2 py-1">metadata 导出</td></tr>
          <tr class="border-b"><td class="px-2 py-1">SSR</td><td class="px-2 py-1">是</td><td class="px-2 py-1">是</td><td class="px-2 py-1">是</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：useSeoMeta 在服务端组件调用即注入 head，SEO/社交分享卡片必备；比手动改 head 更安全（防重、自动合并）。</p>
    </details>
  </main>
</template>
