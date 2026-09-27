<script setup lang="ts">
// 递归树节点：渲染 todo 经 ?tree=1 派生的嵌套结构（parentId → children）
defineOptions({ name: 'TreeNode' })
defineProps<{ node: any; depth?: number }>()
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
