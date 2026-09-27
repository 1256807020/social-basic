<script setup lang="ts">
defineProps<{ nodes: any[] }>()
</script>

<template>
  <ul class="ml-4 border-l border-gray-200 pl-3">
    <li v-for="n in nodes" :key="n.id" class="py-1">
      <span class="font-medium text-gray-800">{{ n.title ?? n.name }}</span>
      <span v-if="n.parentId !== undefined" class="ml-2 text-xs text-gray-400"
        >#{{ n.id }} / parent {{ n.parentId }}</span
      >
      <TreeNode v-if="n.children && n.children.length" :nodes="n.children" />
    </li>
  </ul>
</template>
