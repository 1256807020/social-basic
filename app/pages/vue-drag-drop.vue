<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（拖拽篇）· 原生 HTML5 Drag & Drop
// · Vue2：draggable + @dragstart/@dragover/@drop（onDragOver 要 preventDefault 才允许 drop）；
// · Vue3：完全一致，@dragover.prevent 即可；
// · React 对照：draggable + onDragStart/onDragOver(preventDefault)/onDrop（见 social-start）。
// 📌 实战定位：拖拽排序【了解即可·进阶】；简单排序用原生，复杂用 vuedraggable(SortableJS)。
// 🧭 学习模式：🔧固定写法=@dragover.prevent + @drop 交换；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref } from 'vue'

const items = ref(['A', 'B', 'C', 'D'])
const dragIndex = ref<number | null>(null)
function onDrop(to: number) {
  if (dragIndex.value === null) return
  const arr = [...items.value]
  const [moved] = arr.splice(dragIndex.value, 1)
  arr.splice(to, 0, moved)
  items.value = arr
  dragIndex.value = null
}
// 👉 练习：让列表可在任意两项间拖拽排序（本例已实现相邻交换，扩展为任意位置）
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">原生拖拽 · pages/vue-drag-drop.vue</h1>
    <ul class="space-y-2">
      <li
        v-for="(it, i) in items"
        :key="it"
        class="cursor-move rounded border bg-white p-2 text-sm"
        draggable="true"
        @dragstart="dragIndex = i"
        @dragover.prevent
        @drop="onDrop(i)"
      >
        {{ i + 1 }}. {{ it }}
      </li>
    </ul>

    <details class="mt-6 rounded border p-3 text-sm">
      <summary class="cursor-pointer font-semibold">📚 Vue2 / Vue3 / React 三向对照 & 本项目小结</summary>
      <table class="mt-2 w-full border-collapse text-left">
        <thead>
          <tr class="border-b">
            <th class="px-2 py-1">维度</th>
            <th class="px-2 py-1">Vue2 / Vue3</th>
            <th class="px-2 py-1">React</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b"><td class="px-2 py-1">触发</td><td class="px-2 py-1">draggable + @dragstart</td><td class="px-2 py-1">draggable + onDragStart</td></tr>
          <tr class="border-b"><td class="px-2 py-1">允许放置</td><td class="px-2 py-1">@dragover.prevent</td><td class="px-2 py-1">onDragOver preventDefault</td></tr>
          <tr class="border-b"><td class="px-2 py-1">放置</td><td class="px-2 py-1">@drop 交换数组</td><td class="px-2 py-1">onDrop 交换数组</td></tr>
          <tr class="border-b"><td class="px-2 py-1">库</td><td class="px-2 py-1">vuedraggable</td><td class="px-2 py-1">dnd-kit</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：原生 DnD 三框架写法一致；@dragover.prevent（或 onDragOver 调 preventDefault）才能触发 drop 是关键坑。</p>
    </details>
  </main>
</template>
