<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（传送篇）· &lt;Teleport&gt;
// · Vue2：无原生（用 portal-vue 第三方）；
// · Vue3：&lt;Teleport to="body"&gt; 把子树渲染到任意 DOM 节点（弹窗/Toast/抽屉）；
// · React 对照：createPortal(jsx, document.body)。
// 📌 实战定位：弹窗/Toast 挂载点【了解即可·进阶】；避免被父级 overflow/transform 裁剪。
// 🧭 学习模式：🔧固定写法=&lt;Teleport to="body"&gt;...；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref } from 'vue'

const open = ref(false)
// 👉 练习：给弹窗加“点击遮罩关闭”
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">DOM 传送 &lt;Teleport&gt; · pages/vue-teleport.vue</h1>
    <button class="rounded bg-blue-600 px-3 py-1 text-white" @click="open = true">打开弹窗</button>

    <Teleport to="body">
      <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div class="rounded-lg bg-white p-6 shadow-lg">
          <p>我被传送到 &lt;body&gt; 了，不受父级样式影响</p>
          <button class="mt-3 rounded bg-gray-200 px-3 py-1" @click="open = false">关闭</button>
        </div>
      </div>
    </Teleport>

    <details class="mt-6 rounded border p-3 text-sm">
      <summary class="cursor-pointer font-semibold">📚 Vue2 / Vue3 / React 三向对照 & 本项目小结</summary>
      <table class="mt-2 w-full border-collapse text-left">
        <thead>
          <tr class="border-b">
            <th class="px-2 py-1">维度</th>
            <th class="px-2 py-1">Vue2</th>
            <th class="px-2 py-1">Vue3</th>
            <th class="px-2 py-1">React</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b"><td class="px-2 py-1">传送</td><td class="px-2 py-1">portal-vue</td><td class="px-2 py-1">&lt;Teleport to="body"&gt;</td><td class="px-2 py-1">createPortal</td></tr>
          <tr class="border-b"><td class="px-2 py-1">目标</td><td class="px-2 py-1">选择器/#id</td><td class="px-2 py-1">选择器/#id</td><td class="px-2 py-1">DOM 节点</td></tr>
          <tr class="border-b"><td class="px-2 py-1">典型</td><td class="px-2 py-1">弹窗/Toast</td><td class="px-2 py-1">弹窗/Toast</td><td class="px-2 py-1">弹窗/Toast</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：&lt;Teleport&gt; 把弹窗挂到 body，绕过父级 overflow:hidden / transform 导致的裁剪与层级问题。</p>
    </details>
  </main>
</template>
