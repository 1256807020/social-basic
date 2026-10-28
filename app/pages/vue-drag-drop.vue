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

// 🔧 固定写法：draggable 元素 + @dragstart 记源下标 + @dragover.prevent（关键：不 prevent 就不触发 drop）+ @drop 交换数组
const initial = ['A', 'B', 'C', 'D', 'E']
const items = ref<string[]>([...initial])
const dragIndex = ref<number | null>(null) // 正在拖的元素下标
const overIndex = ref<number | null>(null) // 当前悬停的放置目标下标（用于高亮）

function onDrop(to: number) {
  if (dragIndex.value === null) return
  const arr = [...items.value]
  const moved = arr.splice(dragIndex.value, 1)[0] // 先从原位置取出
  if (moved === undefined) return
  arr.splice(to, 0, moved) // 再插入目标位置（支持任意位置，不止相邻）
  items.value = arr
  dragIndex.value = null
  overIndex.value = null
}
function reset() {
  items.value = [...initial]
  dragIndex.value = null
  overIndex.value = null
}
// 👉 练习：拖动时给目标项加高亮（overIndex 已实现）；进阶可做「跨两个列表互相拖拽」——
// 思路：再建一个 listB，@drop 时判断来源容器，把元素从 A 移到 B（原生 DnD 经典场景）。
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">原生拖拽 · pages/vue-drag-drop.vue</h1>

    <section class="rounded-2xl bg-white p-5 shadow dark:bg-zinc-900">
      <h2 class="font-bold">① 列表拖拽排序（带视觉反馈）</h2>
      <p class="mt-1 text-xs opacity-70">拖动任意项到另一项位置即可重排；@dragover.prevent 是触发 drop 的关键坑。</p>
      <ul class="mt-3 space-y-2">
        <li
          v-for="(it, i) in items"
          :key="it"
          class="cursor-move rounded border p-2 text-sm transition"
          :class="{
            'opacity-40': dragIndex === i,
            'ring-2 ring-blue-400': overIndex === i && dragIndex !== i,
          }"
          draggable="true"
          @dragstart="dragIndex = i"
          @dragover.prevent="overIndex = i"
          @dragleave="overIndex === i && (overIndex = null)"
          @drop="onDrop(i)"
        >
          {{ i + 1 }}. {{ it }}
        </li>
      </ul>
      <div class="mt-3 flex items-center gap-3">
        <button class="rounded bg-zinc-500 px-3 py-1 text-sm text-white" @click="reset">重置</button>
        <p class="text-xs opacity-70">当前顺序：{{ items.join(' → ') }}</p>
      </div>
    </section>

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
      <p class="mt-2 text-gray-500">📝 小结：原生 DnD 三框架写法一致；@dragover.prevent（或 onDragOver 调 preventDefault）才能触发 drop 是关键坑。复杂排序/跨容器拖拽建议 vuedraggable(SortableJS)。</p>
    </details>
  </main>
</template>
