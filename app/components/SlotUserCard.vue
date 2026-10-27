<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 作用域插槽容器：把子组件内部数据「反向」抛给父组件的插槽
// 🔧 固定写法：defineProps 声明入参，模板里 <slot :user="..." /> 把数据抛出去。
// 📌 父组件用 v-slot="{ user }" 接收 → 渲染逻辑由父决定，子只负责「放在哪」。
// ↔ React：render props / 把函数作为 children 传入。
// ───────────────────────────────────────────────────────────

const props = defineProps<{ user: { name: string; role: string } }>()
</script>

<template>
  <div class="rounded border p-3">
    <slot :user="props.user" />
  </div>
</template>
