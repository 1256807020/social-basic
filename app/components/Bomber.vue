<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 故意抛错的子组件：点按钮时在事件处理里 throw
// 🔧 固定写法：普通 <script setup> 组件即可，无需 defineComponent + h。
// 📌 父级用 onErrorCaptured 捕获本组件抛出的错误。
// ───────────────────────────────────────────────────────────

function boom() {
  // 📌 抛错后，Vue 会交给最近的 onErrorCaptured 边界处理
  throw new Error('子组件爆炸了 💥')
}
</script>

<template>
  <button class="rounded bg-red-600 px-3 py-1 text-white" @click="boom">
    点我抛错
  </button>
</template>
