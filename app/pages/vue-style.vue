<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（样式篇）· :class / :style 动态绑定
// · Vue2：:class / :style 写法与 Vue3 完全一致（数组、对象、字符串都支持）；
// · Vue3：完全一致，且 scoped 样式用 &lt;style scoped&gt;，深度选择用 :deep()；
// · React 对照：className={obj/arr/str} + style={{...}}（小驼峰），无 :class 语法糖。
// 📌 实战定位：动态样式【基础必学】；高亮、选中态、主题切换都靠它。
// 🧭 学习模式：🔧固定写法=:class="{}" / :style="{}"；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref } from 'vue'

const active = ref(1)
// 👉 练习：把下面列表点哪个哪个高亮（active = id）
const items = [1, 2, 3]
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">动态样式 :class / :style · pages/vue-style.vue</h1>
    <div class="flex gap-2">
      <button
        v-for="i in items"
        :key="i"
        class="rounded px-3 py-1"
        :class="active === i ? 'bg-blue-600 text-white' : 'border'"
        @click="active = i"
      >
        按钮 {{ i }}
      </button>
    </div>
    <p :style="{ color: active === 2 ? 'crimson' : '#333', fontWeight: active === 2 ? 700 : 400 }">
      当前选中：{{ active }}
    </p>

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
          <tr class="border-b"><td class="px-2 py-1">样式绑定</td><td class="px-2 py-1">:style="{}"</td><td class="px-2 py-1">:style="{}"</td><td class="px-2 py-1">style={{...}}</td></tr>
          <tr class="border-b"><td class="px-2 py-1">scoped</td><td class="px-2 py-1">&lt;style scoped&gt;</td><td class="px-2 py-1">&lt;style scoped&gt;</td><td class="px-2 py-1">CSS Modules</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：Vue 的 :class / :style 支持字符串/数组/对象三种写法；Vue2 与 Vue3 此处几乎无差异，React 需用 className + 小驼峰 style 对象。</p>
    </details>
  </main>
</template>
