<script setup lang="ts">
// 🔧 深层「孙」组件：inject 祖先 provide 的同一个 ref。
// 因为拿到的是「同一引用」，直接改 .value 会同步回祖先（跨层响应式）。
import { inject, ref } from 'vue'

const theme = inject('theme', ref('light'))
const toggle = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div class="mt-2 rounded bg-gray-50 p-3">
    <p>👶 我是「孙」组件（深层）。inject 到 theme：<b>{{ theme }}</b>（没经过 props 透传）</p>
    <button class="mt-2 rounded bg-indigo-600 px-3 py-1 text-white" @click="toggle">
      孙组件切换主题
    </button>
    <p class="mt-2 text-xs text-gray-500">点我改 theme.value → 顶部祖先的显示会同步变化，证明 inject 到的是同一 ref 引用。</p>
  </div>
</template>
