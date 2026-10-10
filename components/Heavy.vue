<script setup lang="ts">
// 被 Suspense 懒加载的“重组件”：setup 里顶层 await 模拟异步初始化
const data = await new Promise<string[]>((resolve) =>
  setTimeout(() => resolve(['模块A', '模块B', '模块C']), 800),
)
</script>

<template>
  <div class="rounded border p-3 text-sm">重组件已加载（模拟 800ms）：{{ data.join('、') }}</div>
</template>
