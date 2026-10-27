<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 子组件：用 <script setup> 的 defineProps 声明入参（Vue3 现代写法）
// 🔧 固定写法：defineProps<接口>() 写在 <script setup> 顶层即可，类型即文档，
//    父组件传值时 TS 会提示字段并做编译期校验。
// 📌 默认值：TS 接口写法下不能用 default 关键字，必须用 withDefaults 包裹。
// 📌 对象 / 数组类型的默认值必须是「工厂函数」(() => ({...}))，否则所有实例共享同一引用。
// ↔ Vue2：props: { title: { type: String, required: true } }（无类型推导）。
// ↔ React：function Card({ title, count = 0 }) —— 默认值靠参数解构给。
// ───────────────────────────────────────────────────────────

interface Props {
  title: string                              // 必填：父组件必须传，否则编译报错
  count?: number                             // 可选
  color?: string                             // 可选：控制文字颜色（传 Tailwind 类）
  user?: { name: string; age: number }       // 对象型 prop：演示嵌套结构
}

// 🔧 固定写法：withDefaults 包裹 defineProps，第二参给默认值
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  color: 'text-gray-800',
  // 📌 对象默认值用工厂函数，避免多实例共享同一对象
  user: () => ({ name: '匿名', age: 0 }),
})
</script>

<template>
  <!-- 🔧 :class="color" 把父传来的颜色类动态绑到根节点 -->
  <div class="rounded border p-3 text-sm shadow-sm" :class="color">
    <p class="font-semibold">{{ props.title }}</p>
    <p>计数：{{ props.count }}</p>
    <p class="text-gray-500">用户：{{ props.user.name }}（{{ props.user.age }} 岁）</p>
  </div>
</template>
