<script setup lang="ts">
// 路由过渡演示用的「视图卡片」：纯展示组件。
// 父页面通过 :key 切换不同 key 来触发外层 <Transition> 的进出场动画，
// 机制与真实路由切换（不同组件/不同 key）完全一致。
defineProps<{
  title: string
  body: string
  c: string // 背景色 Tailwind 类，如 'bg-indigo-600'
}>()
</script>

<template>
  <div :class="[c, 'rounded-2xl p-10 text-white']">
    <h2 class="text-3xl font-black">{{ title }}</h2>
    <p class="mt-3 text-white/85">{{ body }}</p>
  </div>
</template>
