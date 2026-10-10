<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（渲染篇）· v-if / v-for / :key
// · Vue2：v-if / v-else / v-for 同 Vue3；注意 v-for 与 v-if 同元素时 Vue2 优先级不同；
// · Vue3：v-if 优先级高于 v-for（同元素不共存，需包一层 &lt;template v-for&gt;）；:key 必须稳定；
// · React 对照：{ list.map(x => &lt;li key={x.id}&gt;...) }，条件用 &amp;&amp; / 三元。
// 📌 实战定位：列表/条件渲染【基础必学】；后台表格、菜单、Tab 切换天天用。
// 🧭 学习模式：🔧固定写法=v-for="x in list" :key="x.id" + v-if；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref } from 'vue'

const list = ref([
  { id: 1, name: '苹果', hot: true },
  { id: 2, name: '香蕉' },
  { id: 3, name: '西瓜', hot: true },
])
const onlyHot = ref(false)
// 👉 练习：加一个“新增水果”按钮，push 到 list
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">列表 / 条件渲染 · pages/vue-list-render.vue</h1>
    <label class="flex items-center gap-2 text-sm">
      <input type="checkbox" v-model="onlyHot" /> 只看热门
    </label>
    <ul class="space-y-1 text-sm">
      <!-- 🔧 固定写法：v-for 必须 :key，且 v-if 不要和 v-for 放同一元素 -->
      <li v-for="f in list" :key="f.id" class="flex items-center gap-2 border-b py-1">
        <span v-if="f.hot" class="text-red-500">🔥</span>
        <span v-else class="text-gray-300">·</span>
        {{ f.name }}
        <span v-if="onlyHot &amp;&amp; !f.hot" class="text-gray-400">（已过滤）</span>
      </li>
    </ul>

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
          <tr class="border-b"><td class="px-2 py-1">列表</td><td class="px-2 py-1">v-for="x in list"</td><td class="px-2 py-1">同左（:key 必填）</td><td class="px-2 py-1">list.map(x=&gt;...)</td></tr>
          <tr class="border-b"><td class="px-2 py-1">条件</td><td class="px-2 py-1">v-if / v-else</td><td class="px-2 py-1">同左</td><td class="px-2 py-1">&amp;&amp; / 三元</td></tr>
          <tr class="border-b"><td class="px-2 py-1">key 规则</td><td class="px-2 py-1">建议稳定 id</td><td class="px-2 py-1">必须稳定（勿用 index）</td><td class="px-2 py-1">必须 key={id}</td></tr>
          <tr class="border-b"><td class="px-2 py-1">v-if+v-for</td><td class="px-2 py-1">v-for 优先</td><td class="px-2 py-1">v-if 优先（拆开）</td><td class="px-2 py-1">—</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：v-for 必须配稳定 :key（用 id 别用 index）；v-if 与 v-for 不要放同一元素（Vue3 下 v-if 优先），用 &lt;template v-for&gt; 包一层再 v-if。</p>
    </details>
  </main>
</template>
