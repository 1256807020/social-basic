<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（Nuxt 内容站篇）· @nuxt/content
// · 思路：把 Markdown/JSON 当“数据源”，<ContentDoc> 自动渲染，轻量 CMS 替代；
// · Vue2/Nuxt2：@nuxt/content v1 同名；
// · React 对照：无直接等价（MDX / 内容集合思路接近）。
// 📌 实战定位：文档/博客/帮助中心【了解即可·进阶】；本分支已加 @nuxt/content 模块 + content/intro.md。
// 🧭 学习模式：🔧固定写法=<ContentDoc path="/intro" />；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3(Nuxt)/React 三向对照。
// ───────────────────────────────────────────────────────────
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">Nuxt 内容站 @nuxt/content · pages/nuxt-content.vue</h1>
    <article class="prose-sm rounded border p-4 text-sm">
      <ContentDoc path="/intro" />
    </article>

    <details class="mt-6 rounded border p-3 text-sm">
      <summary class="cursor-pointer font-semibold">📚 Vue2/Nuxt2 / Vue3(Nuxt) / React 三向对照 & 本项目小结</summary>
      <table class="mt-2 w-full border-collapse text-left">
        <thead>
          <tr class="border-b">
            <th class="px-2 py-1">维度</th>
            <th class="px-2 py-1">Nuxt2</th>
            <th class="px-2 py-1">Nuxt (Vue3)</th>
            <th class="px-2 py-1">React</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b"><td class="px-2 py-1">数据源</td><td class="px-2 py-1">content/*.md</td><td class="px-2 py-1">content/*.md</td><td class="px-2 py-1">MDX</td></tr>
          <tr class="border-b"><td class="px-2 py-1">渲染</td><td class="px-2 py-1">&lt;nuxt-content&gt;</td><td class="px-2 py-1">&lt;ContentDoc&gt;</td><td class="px-2 py-1">&lt;MDX&gt;</td></tr>
          <tr class="border-b"><td class="px-2 py-1">用途</td><td class="px-2 py-1">文档站</td><td class="px-2 py-1">文档/博客</td><td class="px-2 py-1">文档站</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：@nuxt/content 把 Markdown 当数据源渲染；本例 data 来自 content/intro.md，<code>&lt;ContentDoc path="/intro" /&gt;</code> 自动取。</p>
    </details>
  </main>
</template>
