<script setup lang="ts">
// 中间层「子」组件：自己完全不 inject theme，
// 只负责把孙组件渲染出来——证明 provide/inject 能「跳过我」直达深层。
import ThemeGrandChild from './ThemeGrandChild.vue'
</script>

<template>
  <div class="mt-3 rounded border border-dashed p-3">
    <p class="text-sm text-gray-500">🧩 我是「子」组件（中间层）。我没 inject theme，也没用 props 接，只是把孙组件渲染出来。</p>
    <ThemeGrandChild />
  </div>
</template>
