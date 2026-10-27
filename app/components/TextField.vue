<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 子组件：<script setup> 里的 defineModel —— v-model 的现代写法
// 🔧 固定写法：const model = defineModel<string>() 返回一个【可读写】ref，
//    父组件直接 v-model="x" 绑定；子里 model.value = v 即回传给父。
// 📌 【头号坑】defineModel 是【编译期宏】，只能在 SFC 的 <script setup> 块里用；
//    写在 defineComponent({ setup(){} }) / 普通 .ts 函数里 → 编译器不转换，
//    运行时报 "defineModel is not defined"（ReferenceError）。
// 📌 具名模型：defineModel<string>('title') ↔ 父组件写 v-model:title="x"。
// 📌 想要默认值：defineModel<string>({ default: '' })。
// ↔ Vue2：v-model 是 :value + @input 的语法糖；React：value + onChange（无内置糖）。
// ───────────────────────────────────────────────────────────

// 🔧 具名模型：父组件用 v-model:title="..." 绑定
const title = defineModel<string>('title', { default: '' })

// 🔧 默认模型：父组件用 v-model="..." 绑定
const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="space-y-2">
    <input
      v-model="model"
      class="w-full rounded border px-2 py-1"
      placeholder="我在子组件里，值同步给父（默认模型）"
    >
    <input
      v-model="title"
      class="w-full rounded border px-2 py-1"
      placeholder="具名模型 v-model:title"
    >
  </div>
</template>
