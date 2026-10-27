<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 面板A：带内部状态（输入框），用来演示 <KeepAlive> 缓存实例
// 🔧 固定写法：独立 .vue 组件 + <script setup>，不用 defineComponent + h。
// 📌 关键：组件被切走时不销毁 → 内部 ref 的值被保留，切回还在。
// ───────────────────────────────────────────────────────────
import { ref } from 'vue'

const v = ref('')
</script>

<template>
  <div class="rounded border p-3 text-sm">
    <p>面板A（输入框内容会被缓存）：{{ v }}</p>
    <input
      v-model="v"
      class="mt-2 w-full rounded border px-2 py-1"
      placeholder="切走再切回，内容还在吗？"
    >
  </div>
</template>
