<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（组件通信篇·子→父 内容分发）· 插槽 slot
// · Vue2：<slot> 默认插槽 + slot="x" 具名 + slot-scope="p" 作用域插槽；
// · Vue3：<slot> 默认插槽 + <slot name="x"> 具名 + v-slot / 简写 #x 作用域插槽；
// · React 对照：children 相当于默认插槽；render props / 函数作为 children 相当于作用域插槽。
// 📌 实战定位：插槽是「组件封装」的核心【基础必学】；布局组件、列表项自定义、UI 库都离不开它。
// 🧭 学习模式：🔧固定写法=<slot> / <slot name> / <Comp #x="p">；👉=练习点（已填）；文末 <details> 有三向对照。
// ───────────────────────────────────────────────────────────
import { defineComponent } from 'vue'

// 🔧 固定写法：用 template 字符串定义子组件（演示用；正式项目建议拆成独立 .vue 文件）
// 具名插槽：header / 默认 / footer
const Card = defineComponent({
  template: `
    <div class="rounded border p-4">
      <header class="mb-2 font-bold text-blue-700"><slot name="header">默认标题</slot></header>
      <main class="text-sm"><slot>默认内容</slot></main>
      <footer class="mt-2 text-xs text-gray-400"><slot name="footer">默认页脚</slot></footer>
    </div>`,
})

// 作用域插槽：把子组件内部的数据"反向"传给父组件的插槽
const UserCard = defineComponent({
  props: {
    user: { type: Object as () => { name: string; role: string }, required: true },
  },
  template: `
    <div class="rounded border p-3">
      <slot :user="user" />
    </div>`,
})

// 父组件自己用的数据
const me = { name: '张三', role: '管理员' }
const guest = { name: '访客', role: '只读' }
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-5 p-6">
    <h1 class="text-2xl font-bold">插槽 slot · pages/vue-slot.vue</h1>

    <!-- ① 默认插槽 + 具名插槽 -->
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">① 默认插槽 / 具名插槽（#header）</h2>
      <Card>
        <template #header>我的卡片标题</template>
        这是通过「默认插槽」分发进来的正文内容。
        <template #footer>底部版权信息</template>
      </Card>
      <p class="text-xs text-gray-500">不传时显示 slot 里的兜底内容（如「默认标题」）。</p>
    </section>

    <!-- ② 作用域插槽：父组件拿到子组件的数据 -->
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">② 作用域插槽（#default="{ user }"）</h2>
      <UserCard :user="me" v-slot="{ user }">
        <p class="text-sm">👤 {{ user.name }}（{{ user.role }}）</p>
      </UserCard>
      <UserCard :user="guest" v-slot="{ user }">
        <p class="text-sm">👤 {{ user.name }}（{{ user.role }}）</p>
      </UserCard>
      <p class="text-xs text-gray-500">
        子组件把 <code>user</code> 通过 <code>&lt;slot :user="user"&gt;</code> 抛出来，
        父组件用 <code>v-slot="{ user }"</code> 接收 —— 渲染逻辑由父决定。
      </p>
    </section>

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
          <tr class="border-b"><td class="px-2 py-1">默认插槽</td><td class="px-2 py-1">&lt;slot&gt;</td><td class="px-2 py-1">&lt;slot&gt;</td><td class="px-2 py-1">{children}</td></tr>
          <tr class="border-b"><td class="px-2 py-1">具名插槽</td><td class="px-2 py-1">slot="header"</td><td class="px-2 py-1">#header / v-slot:header</td><td class="px-2 py-1">&lt;Comp header={...}&gt;</td></tr>
          <tr class="border-b"><td class="px-2 py-1">作用域插槽</td><td class="px-2 py-1">slot-scope="p"</td><td class="px-2 py-1">#default="{ user }"</td><td class="px-2 py-1">render props / 函数子组件</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：插槽 = 父组件向子组件「分发内容」的通道；默认插槽兜底、具名插槽分区、作用域插槽反向传数据。父决定"放什么"和"怎么渲染"，子决定"放在哪"。</p>
    </details>
  </main>
</template>
