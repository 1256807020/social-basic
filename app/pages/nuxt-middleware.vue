<script setup lang="ts">
// ── 页首三段式（项目分析）────────────────────────────
// ① 视角/切入点：从 Nuxt2（middleware/ 直接导出函数）升级到 Nuxt3（defineNuxtRouteMiddleware）；对照 React/Next 的 middleware.ts + matcher。
// ② 实战定位：路由守卫 —— 登录鉴权、语言/地区重定向、访问日志与埋点。
// ③ 学习模式：🔧 固定写法 = defineNuxtRouteMiddleware + definePageMeta({ middleware })；👉 练习点 = 把 logger 改造成「无 token 跳登录」鉴权守卫。
// ─────────────────────────────────────────────────────

// 🔧 固定写法：definePageMeta 的 middleware 字段绑定「命名中间件」（文件名即中间件名）。
// ↔ 跨框架差异：Nuxt2 同样是 page meta 绑定 middleware/ 导出函数；React/Next 没有「页面级绑定」概念，靠 middleware.ts 的 matcher 配置决定哪些路由经过。
definePageMeta({
  middleware: ['logger'],
})
</script>

<template>
  <main class="mx-auto max-w-3xl space-y-6 p-6">
    <!-- 页首三段式项目分析卡片（① 视角/切入点 ② 实战定位 ③ 学习模式标记） -->
    <section class="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed">
      <h1 class="mb-3 text-2xl font-bold text-slate-800">Nuxt 路由中间件 · pages/nuxt-middleware.vue</h1>
      <p><span class="font-semibold text-emerald-600">① 视角/切入点：</span>从 Nuxt2（middleware/ 直接导出函数）升级到 Nuxt3（<code>defineNuxtRouteMiddleware</code>）；对照 React/Next 的 <code>middleware.ts</code> + matcher。</p>
      <p><span class="font-semibold text-sky-600">② 实战定位：</span>路由守卫 —— 登录鉴权、语言/地区重定向、访问日志与埋点。</p>
      <p><span class="font-semibold text-amber-600">③ 学习模式：</span>🔧 固定写法 = <code>defineNuxtRouteMiddleware</code> + <code>definePageMeta({ middleware })</code>；👉 练习点 = 把 logger 改造成「无 token 跳登录」鉴权守卫。</p>
    </section>

    <!-- 🔧 固定写法：本页已绑定 logger 中间件，进入即触发 -->
    <section class="rounded-lg border border-slate-200 p-4 text-sm">
      <h2 class="mb-2 text-lg font-semibold">🔧 本页已绑定中间件 <code>logger</code></h2>
      <p>打开浏览器控制台（F12），进入本路由时可见 <code>[middleware:logger] /旧路径 → /nuxt-middleware</code> 日志。</p>
      <p class="mt-1 text-slate-500">📌 中间件文件：<code>app/middleware/logger.ts</code>（命名中间件，文件名即名字）。<code>app/middleware/auth.ts</code> 是 👉 练习点的鉴权守卫示例（本页未绑定，仅供对照）。</p>
    </section>

    <!-- 👉 练习点：鉴权守卫核心代码（来自 middleware/auth.ts） -->
    <section class="rounded-lg border border-slate-200 p-4 text-sm">
      <h2 class="mb-2 text-lg font-semibold">👉 练习点：鉴权守卫长这样（middleware/auth.ts）</h2>
      <pre class="overflow-x-auto rounded bg-slate-900 p-3 text-xs leading-relaxed text-slate-100"><code>export default defineNuxtRouteMiddleware((to) =&gt; {
  // 🔧 读登录态（useState 跨组件/页面共享，SSR 安全）
  const token = useState&lt;string&gt;('token')
  // 📌 未登录且不是去登录页 → 重定向
  if (!token.value &amp;&amp; to.path !== '/login') {
    return navigateTo('/login')   // ↔ React/Next: NextResponse.redirect()
  }
})</code></pre>
      <p class="mt-2 text-slate-500">↔ 跨框架差异：Vue2/Nuxt2 写法几乎一致；React/Next 在 <code>middleware.ts</code> 里用 <code>NextResponse.redirect()</code>，且靠 <code>config.matcher</code> 圈定作用路由，没有「页面级 definePageMeta 绑定」。</p>
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
          <tr class="border-b border-slate-100"><td class="px-2 py-1 font-medium">文件</td><td class="px-2 py-1">middleware/x.js</td><td class="px-2 py-1">middleware/x.ts</td><td class="px-2 py-1">middleware.ts</td></tr>
          <tr class="border-b border-slate-100"><td class="px-2 py-1 font-medium">定义 API</td><td class="px-2 py-1">导出函数</td><td class="px-2 py-1">defineNuxtRouteMiddleware</td><td class="px-2 py-1">默认导出函数</td></tr>
          <tr class="border-b border-slate-100"><td class="px-2 py-1 font-medium">页面绑定</td><td class="px-2 py-1">page.meta</td><td class="px-2 py-1">definePageMeta</td><td class="px-2 py-1">matcher 配置</td></tr>
          <tr class="border-b border-slate-100"><td class="px-2 py-1 font-medium">重定向</td><td class="px-2 py-1">redirect()</td><td class="px-2 py-1">navigateTo()</td><td class="px-2 py-1">NextResponse.redirect()</td></tr>
        </tbody>
      </table>
      <p class="mt-3 text-slate-500">📝 小结：middleware 在路由进入前执行，可做日志 / 鉴权 / 重定向；本例 <code>logger</code> 已用 <code>definePageMeta({ middleware:['logger'] })</code> 绑定到本页（控制台可验证）。实战把 logger 换成「无 token → navigateTo('/login')」即是登录守卫。三层框架思路一致，差异主要在「页面级绑定 vs 全局 matcher」与重定向 API 名字。</p>
    </details>
  </main>
</template>
