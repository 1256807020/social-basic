<script setup lang="ts">
// 递归树节点：渲染 todo 经 ?tree=1 派生的嵌套结构（parentId → children）
// 📌 生产写法：node 用递归类型 TodoNode（children 里还是 TodoNode），
//    不用 any —— 递归类型是 TS 里很值得掌握的一个点。
import type { TodoNode } from '~/types/todo'

defineOptions({ name: 'TreeNode' })
defineProps<{ node: TodoNode; depth?: number }>()
</script>

<template>
  <li>
    <span :style="{ paddingLeft: (depth ?? 0) * 16 + 'px' }" class="inline-block">
      <span class="text-gray-400">└</span> #{{ node.id }} {{ node.title }}
      <span v-if="node.done"> ✅</span>
    </span>
    <ul v-if="node.children && node.children.length">
      <TreeNode
        v-for="c in node.children"
        :key="c.id"
        :node="c"
        :depth="(depth ?? 0) + 1"
      />
    </ul>
  </li>
</template>
