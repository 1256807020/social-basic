<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（组件通信篇·父→子）· defineProps
// · Vue2：props: ['title']，模板用 this.title，子组件不能改（单向）；
// · Vue3：defineProps&lt;{ title: string }&gt;()，模板直接用，类型即文档；
// · React 对照：function Child({ title }) —— props 也是单向只读。
// 📌 实战定位：props 单向数据流【基础必学】；父子传值的唯一正规通道。
// 🧭 学习模式：🔧固定写法=defineProps&lt;Props&gt;()；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { defineComponent, h } from 'vue'

// 🔧 固定写法：子组件用 defineProps 声明入参（这里用 defineComponent 内联演示）
const Card = defineComponent({
  props: { title: { type: String, required: true }, count: { type: Number, default: 0 } },
  setup(p) {
    // 👉 练习：给 Card 加一个 color prop 控制文字颜色
    return () => h('div', { class: 'rounded border p-2 text-sm' }, `${p.title} · 计数 ${p.count}`)
  },
})
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">父→子 props · pages/vue-props.vue</h1>
    <Card title="来自父组件的标题" :count="3" />
    <Card title="另一张卡" :count="7" />

    <details class="mt-6 rounded border p-3 text-sm">
      <summary class="cursor-pointer font-semibold">📚 Vue2 / Vue3 / React 三向对照 & 本项目小结</summary>
      <table class="mt-2 w-full border-collapse text-left">
        <thead>
          <tr class="border-b">
            <th class="px-2 py-1">维度</th>
            <th class="px-2 py-1">Vue2 (Options)</th>
            <th class="px-2 py-1">Vue3</th>
            <th class="px-2 py-1">React</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b"><td class="px-2 py-1">声明</td><td class="px-2 py-1">props: ['title']</td><td class="px-2 py-1">defineProps&lt;{title:string}&gt;()</td><td class="px-2 py-1">function C({title})</td></tr>
          <tr class="border-b"><td class="px-2 py-1">使用</td><td class="px-2 py-1">this.title</td><td class="px-2 py-1">props.title</td><td class="px-2 py-1">title</td></tr>
          <tr class="border-b"><td class="px-2 py-1">默认值</td><td class="px-2 py-1">default</td><td class="px-2 py-1">default</td><td class="px-2 py-1">= props.title ?? x</td></tr>
          <tr class="border-b"><td class="px-2 py-1">方向</td><td class="px-2 py-1">父→子 单向</td><td class="px-2 py-1">父→子 单向</td><td class="px-2 py-1">父→子 单向</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：props 单向只读，父传子；子想改值要靠 emit 事件或 v-model（见 vue-events / vue-vmodel）。</p>
    </details>
  </main>
</template>
