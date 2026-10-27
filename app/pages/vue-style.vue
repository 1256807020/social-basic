<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（样式篇）· :class / :style 动态绑定
// · Vue2：:class / :style 写法与 Vue3 完全一致（数组、对象、字符串都支持）；
// · Vue3：完全一致，且 scoped 样式用 <style scoped>，深度选择用 :deep()；
//        还多了一个「SFC <style> 内 v-bind()」可在样式块里直接引用脚本状态。
// · React 对照：className={obj/arr/str} + style={{...}}（小驼峰），无 :class 语法糖。
// 📌 实战定位：动态样式【基础必学】；高亮、选中态、主题切换都靠它。
// 🧭 学习模式：🔧固定写法=:class="{}" / :class="[]" / :style="{}"（camelCase）；👉=练习点（高亮/字号/主题 已落地）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// 📌 本页是纯前端知识点（样式绑定），依 §0 铁律允许用本地状态演示，不请求接口。
// ───────────────────────────────────────────────────────────
import { ref, computed } from 'vue'

// 1) :class 对象语法 —— 点哪个哪个高亮（👉 练习点：条件类）
const active = ref(1)
const items = [1, 2, 3]

// 3) :style 对象语法（camelCase）+ 响应式变量（👉 练习点：字号随滑块变化）
const fontSize = ref(16)

// 4) 主题切换 —— 纯前端 UI 状态，根节点用 :class 切 Tailwind 暗/亮色令牌
const theme = ref<'light' | 'dark'>('light')
function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

// 🔧 Vue3 专属：<style scoped> 里用 v-bind() 直接引用响应式状态，无需 inline :style。
//    （生产环境建议颜色用 Tailwind 令牌 / CSS 变量，这里用 v-bind 演示语法本身）
const accent = computed(() => (theme.value === 'dark' ? '#f59e0b' : '#2563eb'))
</script>

<template>
  <main
    class="mx-auto max-w-2xl space-y-6 rounded p-6 transition-colors"
    :class="theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'"
  >
    <h1 class="text-2xl font-bold">动态样式 :class / :style · pages/vue-style.vue</h1>
    <p class="text-sm text-gray-500">
      样式绑定是纯前端知识点（§0 铁律允许用本地状态演示），本页不请求接口。
    </p>

    <!-- 🔧 1. :class 对象语法：键为类名，值为布尔 -->
    <section class="space-y-2">
      <h2 class="font-semibold">1. :class 对象语法（点哪个哪个高亮）</h2>
      <div class="flex gap-2">
        <button
          v-for="i in items"
          :key="i"
          class="rounded px-3 py-1"
          :class="{ 'bg-blue-600 text-white': active === i, 'border border-gray-300': active !== i }"
          @click="active = i"
        >
          按钮 {{ i }}
        </button>
      </div>
      <!-- 👉 练习点：用 :style 对象做条件样式（选中 2 号变红加粗） -->
      <p :style="{ color: active === 2 ? 'crimson' : 'inherit', fontWeight: active === 2 ? 700 : 400 }">
        当前选中：{{ active }}（选中 2 号会变红加粗）
      </p>
    </section>

    <!-- 🔧 2. :class 数组语法：基础类 + 条件类拼接 -->
    <section class="space-y-2">
      <h2 class="font-semibold">2. :class 数组语法（多个类拼接）</h2>
      <p :class="['rounded border px-2 py-1 text-sm', active === 1 ? 'bg-blue-50 font-bold' : 'italic text-gray-500']">
        数组里可放「固定字符串」+「三元表达式」，适合「基础类 + 条件类」组合。
      </p>
    </section>

    <!-- 🔧 3. :style 对象语法：属性用 camelCase，值可绑响应式 -->
    <section class="space-y-2">
      <h2 class="font-semibold">3. :style 对象语法（响应式字号）</h2>
      <p :style="{ fontSize: fontSize + 'px' }">这段字号随滑块变化：{{ fontSize }}px</p>
      <input type="range" min="12" max="32" v-model.number="fontSize" />
    </section>

    <!-- 🔧 4. Vue3 专属：<style scoped> 里 v-bind() 引用状态 -->
    <section class="space-y-2">
      <h2 class="font-semibold">4. Vue3 专属：&lt;style&gt; 内 v-bind() 引用状态</h2>
      <button class="rounded border px-3 py-1 text-sm" @click="toggleTheme">
        切换主题（当前 {{ theme }}）
      </button>
      <p class="accent-text">
        这行颜色由 &lt;style&gt; 中的 v-bind(accent) 驱动，随主题在蓝/琥珀间切换。
      </p>
    </section>

    <details class="mt-6 rounded border p-3 text-sm">
      <summary class="cursor-pointer font-semibold">📚 Vue2 / Vue3 / React 三向对照 & 本项目小结</summary>
      <table class="mt-2 w-full border-collapse text-left">
        <thead>
          <tr class="border-b">
            <th class="px-2 py-1">维度</th>
            <th class="px-2 py-1">Vue2</th>
            <th class="px-2 py-1">Vue3</th>
            <th class="px-2 py-1">React</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b"><td class="px-2 py-1">类绑定</td><td class="px-2 py-1">:class="{}"</td><td class="px-2 py-1">:class="{}"</td><td class="px-2 py-1">className={...}</td></tr>
          <tr class="border-b"><td class="px-2 py-1">样式绑定</td><td class="px-2 py-1">:style="{}"</td><td class="px-2 py-1">:style="{}"</td><td class="px-2 py-1" v-pre>style={{...}}</td></tr>
          <tr class="border-b"><td class="px-2 py-1">scoped</td><td class="px-2 py-1">&lt;style scoped&gt;</td><td class="px-2 py-1">&lt;style scoped&gt;</td><td class="px-2 py-1">CSS Modules</td></tr>
          <tr class="border-b"><td class="px-2 py-1">样式内取状态</td><td class="px-2 py-1">需 inline :style</td><td class="px-2 py-1">v-bind() in &lt;style&gt;</td><td class="px-2 py-1">内联 style</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">
        📝 小结：:class / :style 支持字符串/数组/对象三种写法；Vue2 与 Vue3 此处几乎无差异。
        React 需用 className + 小驼峰 style 对象。Vue3 额外可在 SFC &lt;style&gt; 里用 v-bind() 直接引用脚本状态，
        把动态样式收敛进样式块；生产环境颜色优先用 Tailwind 令牌 / CSS 变量以兼容暗色模式。
      </p>
    </details>
  </main>
</template>

<style scoped>
/* 🔧 Vue3 专属：SFC <style> 可用 v-bind() 直接绑定 <script setup> 里的响应式值，
   比 inline :style 更利于把样式收敛到样式块。生产环境颜色建议用 Tailwind 令牌 / CSS 变量，
   这里用 v-bind 演示语法本身。 */
.accent-text {
  color: v-bind(accent);
  font-weight: 600;
}
</style>
