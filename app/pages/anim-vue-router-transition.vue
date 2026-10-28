<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（动画篇）· 路由级过渡（Vue Router + <Transition>）
// ① 视角/切入点：路由切换的「整页进出场」本质是给 <RouterView> 外面包一层 <Transition>，
//    对照 Vue2（<transition name> + 全局 CSS 类）/ Vue3（<Transition> + <RouterView v-slot> + JS 钩子）/ React（framer-motion AnimatePresence + motion 配 key）。
// ② 实战定位：SPA 路由切换、Tab/步骤切换的丝滑过渡；Nuxt 里直接 definePageMeta({ pageTransition }) 即可，无需手写 RouterView。
// ③ 学习模式：🔧固定写法 = <Transition mode="out-in"> 包 <component :is> / <RouterView v-slot> 的 <component :is="Component">；
//    👉练习点 = 改 enter-from-class / leave-to-class 的方向（translateX 正负）与缓动（ease-out/inOut），体会进出差异。
// 本页用 <component :is> + :key 模拟「视图切换」，机制与真实路由一致；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref } from 'vue'
import RouteSlidePanel from '../components/RouteSlidePanel.vue'

// 类型化视图元信息（禁 any）；键名即「路由名」
type ViewKey = 'home' | 'about' | 'contact'
interface ViewMeta {
  title: string
  body: string
  c: string
}
const order: ViewKey[] = ['home', 'about', 'contact']
const views: Record<ViewKey, ViewMeta> = {
  home: { title: '首页', body: '欢迎来到首页，这里是概览内容。', c: 'bg-indigo-600' },
  about: { title: '关于', body: '这一段在「关于」视图，切换时滑入。', c: 'bg-emerald-600' },
  contact: { title: '联系', body: '这是「联系」视图，带不同的进入方向。', c: 'bg-rose-600' },
}
// 当前「路由」（本地状态模拟，纯前端知识点，不接 /api）
const current = ref<ViewKey>('home')
function go(k: ViewKey) {
  current.value = k
}
</script>

<template>
  <main class="min-h-screen bg-zinc-950 px-6 py-12 text-white">
    <div class="mx-auto max-w-3xl">
      <h1 class="mb-6 text-3xl font-black">路由级过渡（Route Transition）</h1>
      <p class="mb-6 text-white/60">
        点下方导航切换「视图」：外层 <code>&lt;Transition mode="out-in"&gt;</code> 让旧视图离场、新视图入场。
      </p>

      <nav class="mb-6 flex gap-2">
        <button
          v-for="k in order"
          :key="k"
          class="rounded-lg px-4 py-2 text-sm font-medium transition"
          :class="current === k ? 'bg-white text-zinc-900' : 'bg-white/10 hover:bg-white/20'"
          @click="go(k)"
        >
          {{ views[k].title }}
        </button>
      </nav>

      <!-- 🔧 固定写法：用 Tailwind 类 prop 替代 <style> 全局 CSS；mode=out-in 让旧视图先离场新视图再入场 -->
      <Transition
        mode="out-in"
        enter-active-class="transition-all duration-[400ms] ease-out"
        enter-from-class="opacity-0 translate-x-12"
        leave-active-class="transition-all duration-[400ms] ease-in"
        leave-to-class="opacity-0 -translate-x-12"
      >
        <RouteSlidePanel
          :key="current"
          :title="views[current].title"
          :body="views[current].body"
          :c="views[current].c"
        />
      </Transition>

      <pre class="mt-8 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-white/70">// 真实 Vue Router 项目（非 Nuxt）在根组件这样写，即为「整站路由切换」加过渡：
&lt;RouterView v-slot="{ Component }"&gt;
  &lt;Transition mode="out-in" name="slide"&gt;
    &lt;component :is="Component" /&gt;
  &lt;/Transition&gt;
&lt;/RouterView&gt;

// Nuxt 项目更简单：在页面里声明即可，由 &lt;NuxtPage&gt; 自动套过渡
// definePageMeta({ pageTransition: { name: 'slide', mode: 'out-in' } })</pre>
    </div>

    <details class="mx-auto mt-10 max-w-3xl rounded border border-white/10 p-3 text-sm text-white/80">
      <summary class="cursor-pointer font-semibold">📚 Vue2 / Vue3 / React 三向对照 & 本项目小结</summary>
      <table class="mt-3 w-full border-collapse text-left">
        <thead>
          <tr class="border-b border-white/20">
            <th class="px-2 py-1">维度</th>
            <th class="px-2 py-1">Vue2 / Vue3</th>
            <th class="px-2 py-1">React</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-white/10"><td class="px-2 py-1">过渡包裹</td><td class="px-2 py-1">&lt;Transition&gt; 包 &lt;component :is&gt;</td><td class="px-2 py-1">AnimatePresence 包 motion</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">路由接入</td><td class="px-2 py-1">&lt;RouterView v-slot&gt; / Nuxt pageTransition</td><td class="px-2 py-1">React Router 无内置，靠 framer-motion</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">样式来源</td><td class="px-2 py-1">CSS 类(name) 或 class prop</td><td class="px-2 py-1">motion 的 initial/animate/exit</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">离场再入场</td><td class="px-2 py-1">mode="out-in"</td><td class="px-2 py-1">AnimatePresence mode="wait"</td></tr>
        </tbody>
      </table>
      <p class="mt-3 text-white/50">
        📝 小结：路由过渡的核心是「外层 <code>&lt;Transition&gt;</code> + 内层带 <code>:key</code> 的视图」，key 一变就触发旧离场、新入场。
        本页用本地状态模拟路由，真实项目里把内层换成 <code>&lt;RouterView v-slot&gt;</code> 的 <code>&lt;component :is="Component"&gt;</code>（Nuxt 用 <code>pageTransition</code>）即可。
        易错点：① 必须给被切换元素加 <code>:key</code>，否则 Vue 复用 DOM、<b>不会</b>播进出场；② <code>mode="out-in"</code> 避免新旧视图重叠抖动；
        ③ 过渡 CSS 用 <code>enter-from-class</code>/<code>leave-to-class</code> 等 Tailwind 类 prop，比写 <code>&lt;style&gt;</code> 全局类更可控、暗色主题不失效。
      </p>
    </details>
  </main>
</template>
