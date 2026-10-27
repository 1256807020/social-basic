<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 具名插槽 + 默认插槽的容器组件
// 🔧 固定写法：真实 .vue 文件 + <slot>（生产项目不用 defineComponent({ template: '...' })，
//    那种写法依赖运行时编译器，构建产物更大、类型丢失）。
// 📌 三个插槽：具名 header / 默认 / 具名 footer；每个都能写兜底内容。
// ↔ React：children 相当于默认插槽；具名插槽相当于 <Comp header={...}>。
// ───────────────────────────────────────────────────────────
</script>

<template>
  <div class="rounded border p-4">
    <header class="mb-2 font-bold text-blue-700">
      <slot name="header">默认标题</slot>
    </header>
    <main class="text-sm">
      <slot>默认内容</slot>
    </main>
    <footer class="mt-2 text-xs text-gray-400">
      <slot name="footer">默认页脚</slot>
    </footer>
  </div>
</template>
