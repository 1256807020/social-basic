<script setup lang="ts">
// 真实项目阶段 · 企业官网(Nuxt) 搭建思路
// 本页是「架构拆解 / 蓝图」，不是可运行 demo：所有代码片段放在 <pre v-pre> 里当文本展示，
// 不引入 @nuxt/content 等模块依赖，纯讲解 + 与前面 nuxt-* 分支衔接。
</script>

<template>
  <main class="mx-auto max-w-4xl space-y-8 p-4 text-sm leading-relaxed">
    <!-- ① 页首三段式：切入点 / 实战定位 / 学习模式 -->
    <header class="space-y-3">
      <h1 class="text-2xl font-bold">企业官网 / 营销站 · Nuxt 搭建思路</h1>
      <div class="grid gap-3 sm:grid-cols-3">
        <div class="rounded border-l-4 border-blue-600 bg-blue-50 p-3">
          <p class="font-semibold">① 切入点</p>
          <p class="mt-1 text-gray-700">
            把已学的 <code>nuxt-content / nuxt-seo / nuxt-ssr-data / nuxt-middleware / nuxt-server-route</code>
            收口成一张「企业官网怎么搭」的蓝图——不再拆单点，而是看整体架构决策如何组合。
          </p>
        </div>
        <div class="rounded border-l-4 border-emerald-600 bg-emerald-50 p-3">
          <p class="font-semibold">② 实战定位</p>
          <p class="mt-1 text-gray-700">
            SaaS 官网 / 产品站 / 活动页是 Nuxt 最典型落地场景：要求
            <b>快 + SEO 好 + 内容能自助更新 + 能接轻表单</b>，技术栈高度标准化。
          </p>
        </div>
        <div class="rounded border-l-4 border-purple-600 bg-purple-50 p-3">
          <p class="font-semibold">③ 学习模式</p>
          <p class="mt-1 text-gray-700">
            🔧 固定写法：<code>routeRules</code> / <code>useSeoMeta</code> / <code>site.config</code> 一套记住即可；<br />
            👉 练习点：用 <code>@nuxt/content</code> 搭一个博客、用 <code>routeRules</code> 把首页改成 SSG。
          </p>
        </div>
      </div>
    </header>

    <!-- 渲染模式决策 -->
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">1 · 渲染模式决策（SSG / SSR / 混合）</h2>
      <p class="text-gray-700">
        企业官网 90% 是静态内容，<b>默认 SSG</b> 最香：构建时预渲染成 HTML，可丢到任意 CDN，SEO 与首屏都拉满、运行成本≈0。
        只有「询价 / 登录 / 用户态」这类动态部分才用 SSR 或纯客户端。
      </p>
      <table class="w-full border-collapse text-left">
        <thead>
          <tr class="border-b font-semibold">
            <th class="p-2">页面</th><th class="p-2">模式</th><th class="p-2">理由</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b"><td class="p-2">首页 / 产品 / 关于</td><td class="p-2 text-emerald-600">SSG</td><td class="p-2 text-gray-600">内容固定、SEO 关键、走 CDN</td></tr>
          <tr class="border-b"><td class="p-2">博客 / 帮助中心</td><td class="p-2 text-emerald-600">SSG + @nuxt/content</td><td class="p-2 text-gray-600">内容驱动、非工程师写 Markdown</td></tr>
          <tr class="border-b"><td class="p-2">询价 / 登录</td><td class="p-2 text-amber-600">SSR 或 client</td><td class="p-2 text-gray-600">带用户态 / 表单，按需动态</td></tr>
          <tr><td class="p-2">管理后台</td><td class="p-2 text-red-500">client (spa)</td><td class="p-2 text-gray-600">内部系统，无需 SEO</td></tr>
        </tbody>
      </table>
      <p class="text-gray-700">🔧 用 <code>routeRules</code> 在 <code>nuxt.config.ts</code> 里按路由声明模式，而不是全局二选一：</p>
      <pre v-pre class="overflow-x-auto rounded bg-gray-900 p-3 text-xs text-gray-100"><code>// nuxt.config.ts
export default defineNuxtConfig({
  // 整站默认 SSR；下面把纯静态页标成预渲染
  routeRules: {
    '/':              { prerender: true },          // 首页 SSG
    '/products':      { prerender: true },
    '/blog/**':       { prerender: true },          // 博客全 SSG
    '/contact':       { ssr: true },                // 询价表单 SSR
    '/admin/**':      { ssr: false },               // 后台纯客户端
  },
})</code></pre>
      <p class="text-gray-600">📌 <code>prerender: true</code> 会在 <code>nuxi generate</code> 时把路由爬出来生成静态 HTML；SSR 页同样能被爬虫抓到，但每次请求现算。</p>
    </section>

    <!-- 目录分层 -->
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">2 · 目录分层（约定优于配置）</h2>
      <p class="text-gray-700">Nuxt 的「文件即路由 / 约定目录」让架构天然分层，企业站照这套即可：</p>
      <ul class="list-disc space-y-1 pl-6 text-gray-700">
        <li><code>modules/</code> 或 <code>nuxt.config</code> 的 <code>modules</code>：装 @nuxt/content、@nuxtjs/seo、@nuxtjs/sitemap、@nuxtjs/i18n、Nuxt UI 等。</li>
        <li><code>layouts/</code>：<code>default.vue</code>（带 header/footer 的营销壳）、<code>blank.vue</code>（后台/落地页）。</li>
        <li><code>pages/</code>：按路由自动生成；营销页尽量扁平（<code>/</code>、<code>/products</code>、<code>/blog/[slug]</code>）。</li>
        <li><code>components/</code>：设计系统（Button / Hero / FeatureGrid / NavBar / Footer），全部用 Tailwind + design tokens。</li>
        <li><code>composables/</code>：<code>useSeo()</code>（封装 useSeoMeta）、<code>useApi()</code>（封装 $fetch，见 nuxt-client-crud）、<code>useSiteConfig()</code>。</li>
        <li><code>content/</code>：Markdown 博客 / 帮助文档（@nuxt/content 接管）。</li>
        <li><code>public/</code>：favicon、robots.txt（或用 @nuxtjs/robots 生成）、og 默认图。</li>
      </ul>
      <p class="text-gray-600">↔ React/Next：对应 <code>app/</code> 目录约定路由 + <code>components/</code> + <code>app/(marketing)/layout.tsx</code> 路由组，思路一致，只是目录名不同。</p>
    </section>

    <!-- SEO 体系 -->
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">3 · SEO 体系（与 nuxt-seo 衔接）</h2>
      <p class="text-gray-700">
        企业站 SEO = 每页元信息 + 站点级配置 + sitemap/robots + 结构化数据。连起来才是完整闭环。
      </p>
      <pre v-pre class="overflow-x-auto rounded bg-gray-900 p-3 text-xs text-gray-100"><code>// composables/useSeo.ts —— 封装一次，全站复用
export function usePageSeo(meta: { title: string; description: string; image?: string }) {
  const { titleTemplate } = useSiteConfig()   // 站点级：站名后缀
  useSeoMeta({
    title: meta.title,
    titleTemplate,                              // 例如 "%s · Acme"
    description: meta.description,
    ogTitle: meta.title,
    ogDescription: meta.description,
    ogImage: meta.image ?? '/og-default.png',
    twitterCard: 'summary_large_image',
  })
}

// 结构化数据（面包屑 / 组织），喂给搜索引擎
useHeadSafe({
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Acme' }) }],
})</code></pre>
      <p class="text-gray-600">🔧 站点级配置放 <code>app.config.ts</code>（Nuxt 4）或 <code>@nuxtjs/seo</code> 的 <code>useSiteConfig()</code>：站名、默认 OG 图、域名，避免每页重复。sitemap / robots 用对应模块自动产出。</p>
      <p class="text-gray-600">👉 练习点：给每个营销页都调 <code>usePageSeo()</code>，并配 <code>@nuxtjs/sitemap</code> 让收录自动更新。</p>
    </section>

    <!-- 内容驱动 -->
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">4 · 内容驱动（与 nuxt-content 衔接）</h2>
      <p class="text-gray-700">
        博客 / 帮助中心 / 活动页让市场同学写 Markdown 就能发，不碰代码——这就是 <code>@nuxt/content</code> 的价值。
      </p>
      <pre v-pre class="overflow-x-auto rounded bg-gray-900 p-3 text-xs text-gray-100"><code>// content/blog/launch-2026.md  （ frontmatter 当数据用）
---
title: 2026 产品发布
description: 我们做了什么
date: 2026-01-10
---
正文用 Markdown 写，支持组件嵌入。

// app/pages/blog/[slug].vue —— 按 slug 取内容
const { data: post } = await useAsyncData(() =&gt;
  queryContent('blog', route.params.slug).findOne())
// 渲染：&lt;ContentDoc /&gt; 或 post.value.body</code></pre>
      <p class="text-gray-600">📌 列表页用 <code>queryContent('blog').only(['_path','title','date']).find()</code> 取索引；详情页 <code>findOne()</code>。内容站几乎零后端。</p>
    </section>

    <!-- 组件架构 / 设计系统 -->
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">5 · 组件架构 / 设计系统 + 暗色</h2>
      <p class="text-gray-700">
        营销站视觉统一靠 design tokens（前面 <code>tailwind.css</code> 里的 <code>--color-*</code> 就是 tokens）。
        按钮 / Hero / 特性网格抽成组件，全站复用；暗色用前面已配好的
        <code>@custom-variant dark (&amp;:is(.dark *))</code> + <code>useDark()</code>。
      </p>
      <p class="text-gray-600">↔ Vue2/Nuxt2：手写 SCSS 变量 + BEM，换肤靠改全局变量；Vue3/Nuxt4：Tailwind tokens + <code>dark:</code> 变体，零运行时。</p>
    </section>

    <!-- i18n -->
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">6 · 多语言（@nuxtjs/i18n）</h2>
      <p class="text-gray-700">
        出海企业站必选项。路由前缀 <code>/zh</code> <code>/en</code>，SEO 侧用 <code>hreflang</code> 标注语言版本，<code>useSeoMeta</code> 里补 <code>ogLocale</code>。
        i18n 与 content 可叠加：<code>content/blog/launch-2026.en.md</code> 对应英文版。
      </p>
    </section>

    <!-- 性能 -->
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">7 · 性能（图片 / 字体）</h2>
      <ul class="list-disc space-y-1 pl-6 text-gray-700">
        <li><b>NuxtImg</b>：替换原生 <code>&lt;img&gt;</code>，自动 AVIF/WebP、按容器尺寸裁剪、懒加载——LCP 直接受益（对应 nuxt-ssr-data 之外的静态资源优化）。</li>
        <li><b>字体</b>：<code>@nuxtjs/google-fonts</code> 或 <code>nuxt-fontaine</code> 内联 fallback，消除 CLS 布局抖动。</li>
        <li><b>预取</b>：Nuxt 默认对可视区内 <code>&lt;NuxtLink&gt;</code> 预取，列表页秒开。</li>
      </ul>
    </section>

    <!-- 数据与表单 -->
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">8 · 数据与轻表单（与 nuxt-server-route 衔接）</h2>
      <p class="text-gray-700">
        营销站后端极轻：询价 / 订阅 / 预约走一个 <code>server/api/*</code> 即可（基座引擎直接接 <code>data/*.json</code>），
        或直接对接 Formspree / 邮件服务。产品列表、客户案例复用 <code>@nuxt/content</code> 或 <code>/api</code>，
        无需重型 CMS。中间件（nuxt-middleware）可做落地页 A/B 分流、地区重定向。
      </p>
      <pre v-pre class="overflow-x-auto rounded bg-gray-900 p-3 text-xs text-gray-100"><code>// server/api/lead.post.ts —— 一条询价落地
export default defineEventHandler(async (e) =&gt; {
  const body = await readBody(e)
  // 落库 / 发邮件 / 转 CRM ……（基座 data/leads.json 即可当库）
  return { ok: true }
})</code></pre>
    </section>

    <!-- 部署 -->
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">9 · 部署（静态优先）</h2>
      <p class="text-gray-700">
        纯官网首选 <code>nuxi generate</code> → 输出纯静态 HTML，丢 Netlify / Vercel / 对象存储 CDN，成本≈0、抗量。
        若有用 SSR 页或 server 路由，则 <code>nuxt build</code> + Nitro，选 <code>NITRO_PRESET</code>（node / vercel / cloudflare 等）。
      </p>
      <p class="text-gray-600">🔧 两条命令记死：静态站 <code>nuxi generate</code>；带服务端 <code>nuxi build</code>。CI 里跑完直接发。</p>
    </section>

    <!-- 衔接小结 -->
    <section class="space-y-2 rounded border bg-gray-50 p-4">
      <h2 class="text-lg font-semibold">本阶段与前面 nuxt-* 的衔接</h2>
      <ul class="list-disc space-y-1 pl-6 text-gray-700">
        <li><code>nuxt-content</code> → 第 4 节 内容驱动博客/帮助中心</li>
        <li><code>nuxt-seo</code> → 第 3 节 元信息 + 结构化数据</li>
        <li><code>nuxt-ssr-data</code> → 第 1/8 节 动态页与轻数据</li>
        <li><code>nuxt-middleware</code> → 第 8 节 A/B 分流 / 地区重定向</li>
        <li><code>nuxt-server-route</code> → 第 8 节 询价/订阅落地 API</li>
      </ul>
      <p class="text-gray-600">一句话：企业官网 = <b>SSG 为主 + @nuxt/content 内容 + 一套 SEO 封装 + 一个轻 server/api + NuxtImg/字体优化</b>，全部是你已学过的积木。</p>
    </section>

    <!-- 文末三向对照 -->
    <details class="rounded border p-4 text-sm">
      <summary class="cursor-pointer font-semibold">Vue2/Nuxt2 ↔ Vue3/Nuxt3-4 ↔ React/Next 三向对照 + 小结</summary>
      <table class="mt-3 w-full border-collapse text-left text-xs">
        <thead>
          <tr class="border-b font-semibold">
            <th class="p-2">维度</th><th class="p-2">Vue2 / Nuxt2</th><th class="p-2">Vue3 / Nuxt3-4（本库）</th><th class="p-2">React / Next.js</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b"><td class="p-2 font-medium">渲染模式</td><td class="p-2">universal SSR，整站二选一</td><td class="p-2">routeRules 按路由 SSG/SSR/ISR 混合</td><td class="p-2">App Router：static / SSR / ISR 按路由</td></tr>
          <tr class="border-b"><td class="p-2 font-medium">SEO</td><td class="p-2">vue-meta 手动注入</td><td class="p-2">useSeoMeta + @nuxtjs/seo/sitemap</td><td class="p-2">Metadata API / generateMetadata</td></tr>
          <tr class="border-b"><td class="p-2 font-medium">内容驱动</td><td class="p-2">接 headless CMS 或 nuxt/content v1</td><td class="p-2">@nuxt/content v2 Markdown 即数据</td><td class="p-2">MDX / Contentlayer / 文件系统</td></tr>
          <tr class="border-b"><td class="p-2 font-medium">组件/设计系统</td><td class="p-2">SCSS 变量 + BEM</td><td class="p-2">Tailwind tokens + dark: 变体（零运行时）</td><td class="p-2">Tailwind / CSS Modules + next-themes</td></tr>
          <tr class="border-b"><td class="p-2 font-medium">多语言</td><td class="p-2">vue-i18n 手动接</td><td class="p-2">@nuxtjs/i18n + hreflang</td><td class="p-2">next-intl / middleware 路由前缀</td></tr>
          <tr class="border-b"><td class="p-2 font-medium">图片优化</td><td class="p-2">手动裁剪/CDN</td><td class="p-2">NuxtImg 自动 AVIF/WebP</td><td class="p-2">next/image 自动优化</td></tr>
          <tr><td class="p-2 font-medium">部署</td><td class="p-2">Node 服务端渲染</td><td class="p-2">generate 纯静态 / Nitro 多预设</td><td class="p-2">next build → Vercel / 静态导出</td></tr>
        </tbody>
      </table>
      <p class="mt-3 text-gray-700">
        <b>小结</b>：三套框架的「企业官网」心智完全同构——<b>静态优先 + 内容驱动 + 集中 SEO + 图片优化 + 轻后端</b>。
        Nuxt3-4 用 <code>routeRules</code> 把渲染模式精细化到路由级，是比 Nuxt2「整站二选一」最大的进化点；
        React/Next 的 App Router 在 ISR/路由组上更细化，但落地姿势一致。学一套，另两套照表迁移即可。
      </p>
    </details>
  </main>
</template>
