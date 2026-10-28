<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（Nuxt SEO 篇）· useSeoMeta
// · Vue2/Nuxt2：this.$seoMeta / 手动改 head()；
// · Vue3/Nuxt：useSeoMeta({ title, description, ogTitle... }) 自动注入 <head>；
// · React 对照：next/head 或 metadata 导出（见 social-start）。
// 📌 实战定位：SEO/社交分享【了解即可·进阶】；官网/营销页必备。
// 🔴 铁律：本分支只演示「注入元信息」，不碰 /api（纯前端知识点）；样式走 Tailwind。
// 🧭 学习模式：🔧固定写法=useSeoMeta({ title, description, og*... })；👉=练习点（响应式改标题按钮）；文末 <details> 有 Vue2/Vue3(Nuxt)/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref } from 'vue'

// 🔧 固定写法：useSeoMeta 在服务端组件调用即注入 <head>；它接收 ref/computed，
//    值变化时自动回写 <meta>，无需手动 $head 操作（防重、自动合并）。
// 👉 练习点：把 title 用 ref 包起来，点按钮改 ref.value → 切到别的 tab 看 <title> 实时变。
const title = ref('Social Basic · Vue3 学习基地')
const alt = ref(false)
function toggleTitle() {
  alt.value = !alt.value
  title.value = alt.value
    ? 'Social Basic · 进阶 SEO 响应式演示'
    : 'Social Basic · Vue3 学习基地'
}

useSeoMeta({
  title,
  description: '从 Vue2 升级到 Vue3 的实战示例集',
  ogTitle: title,
  ogDescription: 'Nuxt useSeoMeta 注入 OG 社交分享卡片元信息',
  ogType: 'website',
  ogImage: 'https://social-basic.example.com/cover.png',
  twitterCard: 'summary_large_image',
  twitterTitle: title,
})
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">Nuxt SEO · pages/nuxt-seo.vue</h1>
    <p class="text-sm">查看页面源代码或切到别的标签页，<code>&lt;head&gt;</code> 里已自动生成 title / description / og / twitter 标签。</p>
    <button class="rounded bg-blue-600 px-3 py-1 text-white" @click="toggleTitle">
      切换标题（演示 useSeoMeta 响应式）
    </button>
    <p class="text-xs text-gray-500">当前注入标题：{{ title }}</p>

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
          <tr class="border-b"><td class="px-2 py-1">响应式</td><td class="px-2 py-1">需手动重设</td><td class="px-2 py-1">传 ref/computed 自动回写</td><td class="px-2 py-1">metadata 重渲染</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：useSeoMeta 在服务端组件调用即注入 head，SEO/社交分享卡片必备；比手动改 head 更安全（防重、自动合并）。<br>
      📌 易错点：① 值用 ref/computed 包起来，改 ref.value 才会响应式更新（直接传字面量只是首屏一次性）；② og/twitter 字段名是 `ogTitle`/`twitterCard` 这种驼峰，不是 `og:title` 字符串键；③ useSeoMeta 自动合并去重，不再需要手动管 `<Head>`；④ 纯前端元信息演示，本分支不引 /api。</p>
    </details>
  </main>
</template>
