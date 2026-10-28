<script setup lang="ts">
// ── 页首三段式（项目分析）────────────────────────────
// ① 视角/切入点：从 Nuxt2(@nuxt/content v1) 升级到 Nuxt3(v2)，并对照 React 的 MDX 内容集合思路。
// ② 实战定位：文档站 / 博客 / 帮助中心 —— 把 Markdown 当数据源，零后端轻量 CMS 替代。
// ③ 学习模式：🔧 固定写法 = <ContentDoc path="/intro" />；👉 练习点 = 用 queryContent() 自定义列表与检索。
// ─────────────────────────────────────────────────────

// 🔧 固定写法：queryContent 是 @nuxt/content 自动导入的 composable，
// 用来「查询」content/ 目录下的 .md/.json，返回可链式调用的查询构造器。
// 📌 值得记录：查询务必包在 useAsyncData 里 —— SSR 下既能复用结果，又避免每次请求重复查询。
// ↔ 跨框架差异：Nuxt2 同名 queryContent 用法一致；React 没有等价 API，需 MDX + 自建索引。
interface DocItem {
  _path: string
  title?: string
}

// 🔧 固定写法：useAsyncData 的 key 必须唯一；.only() 只取需要的字段，.find() 取全部文档。
const { data: docs } = await useAsyncData<DocItem[]>('all-docs', async () => {
  const list = await queryContent().only(['_path', 'title']).find()
  return list as DocItem[]
})
</script>

<template>
  <main class="mx-auto max-w-3xl space-y-6 p-6">
    <!-- 页首三段式项目分析卡片（① 视角/切入点 ② 实战定位 ③ 学习模式标记） -->
    <section class="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed">
      <h1 class="mb-3 text-2xl font-bold text-slate-800">Nuxt 内容站 · @nuxt/content（pages/nuxt-content.vue）</h1>
      <p><span class="font-semibold text-emerald-600">① 视角/切入点：</span>从 Nuxt2(@nuxt/content v1) 升级到 Nuxt3(v2)，并对照 React 的 MDX 内容集合思路。</p>
      <p><span class="font-semibold text-sky-600">② 实战定位：</span>文档站 / 博客 / 帮助中心 —— 把 Markdown 当数据源，零后端轻量 CMS 替代。</p>
      <p><span class="font-semibold text-amber-600">③ 学习模式：</span>🔧 固定写法 = <code>&lt;ContentDoc path="/intro" /&gt;</code>；👉 练习点 = 用 <code>queryContent()</code> 自定义列表与检索。</p>
    </section>

    <!-- 🔧 固定写法：单篇文档最省事的渲染方式，path 对应 content/intro.md -->
    <section class="rounded-lg border border-slate-200 p-4">
      <h2 class="mb-2 text-lg font-semibold">🔧 固定写法：<code>&lt;ContentDoc&gt;</code> 自动渲染单篇</h2>
      <article class="text-sm leading-relaxed">
        <ContentDoc path="/intro" />
      </article>
    </section>

    <!-- 👉 练习点：用 queryContent 自定义查询，拿到列表后自己渲染（而非交给 <ContentDoc>） -->
    <section class="rounded-lg border border-slate-200 p-4">
      <h2 class="mb-2 text-lg font-semibold">👉 练习点：<code>queryContent().find()</code> 自定义列表</h2>
      <ul class="list-disc space-y-1 pl-5 text-sm">
        <li v-for="doc in (docs || [])" :key="doc._path">
          <NuxtLink :to="doc._path" class="text-sky-600 hover:underline">{{ doc.title || doc._path }}</NuxtLink>
        </li>
        <li v-if="!(docs || []).length" class="text-slate-400">（暂无内容）</li>
      </ul>
    </section>

    <!-- 文末 <details>：Vue2 / Vue3(Nuxt) / React 三向对照 + 小结（§16 必填） -->
    <details class="rounded-lg border border-slate-200 p-4 text-sm">
      <summary class="cursor-pointer font-semibold text-slate-700">📚 Vue2 / Vue3(Nuxt) / React 三向对照 &amp; 本项目小结</summary>
      <table class="mt-3 w-full border-collapse text-left">
        <thead>
          <tr class="border-b border-slate-300">
            <th class="px-2 py-1">维度</th>
            <th class="px-2 py-1">Vue2 (Nuxt2)</th>
            <th class="px-2 py-1">Vue3 (Nuxt3)</th>
            <th class="px-2 py-1">React</th>
          </tr>
        </thead>
        <tbody class="text-slate-600">
          <tr class="border-b border-slate-100"><td class="px-2 py-1 font-medium">内容源</td><td class="px-2 py-1">content/*.md</td><td class="px-2 py-1">content/*.md</td><td class="px-2 py-1">MDX / 内容集合</td></tr>
          <tr class="border-b border-slate-100"><td class="px-2 py-1 font-medium">渲染组件</td><td class="px-2 py-1">&lt;nuxt-content&gt;</td><td class="px-2 py-1">&lt;ContentDoc&gt;</td><td class="px-2 py-1">&lt;MDXProvider&gt;</td></tr>
          <tr class="border-b border-slate-100"><td class="px-2 py-1 font-medium">查询 API</td><td class="px-2 py-1">queryContent()</td><td class="px-2 py-1">queryContent()</td><td class="px-2 py-1">无（需自建）</td></tr>
          <tr class="border-b border-slate-100"><td class="px-2 py-1 font-medium">典型用途</td><td class="px-2 py-1">文档站</td><td class="px-2 py-1">文档/博客</td><td class="px-2 py-1">文档站</td></tr>
        </tbody>
      </table>
      <p class="mt-3 text-slate-500">📝 小结：@nuxt/content 把 <code>content/</code> 下的 Markdown 当数据源；本例数据来自 <code>content/intro.md</code>，<code>&lt;ContentDoc path="/intro" /&gt;</code> 自动取并渲染。<code>queryContent()</code> 则用于需要自定义列表 / 检索的场景（如博客归档）。</p>
    </details>
  </main>
</template>
