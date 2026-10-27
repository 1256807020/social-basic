<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 子组件：用 <script setup> 的 defineEmits 声明事件（Vue3 现代写法）
// 🔧 固定写法：defineEmits<{ (e:'事件名', 载荷类型): void }>() —— 类型即文档，
//    父组件监听时 TS 会提示事件名与载荷类型。
// 🔧 触发：emit('ping', 载荷)，第一个参数是事件名，其后都是 payload。
// 📌 事件名推荐 kebab-case 约定（模板里写 @ping），TS 类型里写 camelCase。
// ↔ Vue2：this.$emit('ping', n)；React：props.onPing(n)（父把回调当 props 传）。
// ───────────────────────────────────────────────────────────
import { ref } from 'vue'

// 🔧 固定写法：类型化事件声明
const emit = defineEmits<{
  (e: 'ping', payload: number): void
}>()

const count = ref(0)
function fire() {
  count.value++
  // 🔧 emit(事件名, 载荷) —— 把子组件内部状态抛给父
  emit('ping', count.value)
}
</script>

<template>
  <div class="rounded border p-3 text-sm">
    <p>子组件内部计数：{{ count }}</p>
    <button
      class="mt-2 rounded bg-indigo-600 px-3 py-1 text-white"
      @click="fire"
    >
      +1 并 emit ping
    </button>
  </div>
</template>
