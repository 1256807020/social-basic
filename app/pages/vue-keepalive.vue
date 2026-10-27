<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（缓存篇）· &lt;KeepAlive&gt;
// · Vue2：&lt;keep-alive&gt; 同写法；
// · Vue3：&lt;KeepAlive&gt; 包动态组件，切换时不销毁实例（保留状态/滚动/输入框）；
// · React 对照：无原生，靠状态提升 / 路由缓存（如 react-router 的 cache）。
// 📌 实战定位：组件缓存【了解即可·进阶】；Tab 切换保表单、保滚动位置常用。
// 🧭 学习模式：🔧固定写法=&lt;KeepAlive&gt;&lt;component :is="..."&gt;；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref } from 'vue'
// 🔧 固定写法：面板抽成独立 .vue 文件（见 app/components/PanelA.vue / PanelB.vue）
import A from '~/components/PanelA.vue'
import B from '~/components/PanelB.vue'

const tab = ref<'A' | 'B'>('A')
// 👉 练习：在两个面板各放一个输入框，切走再切回，看哪个保住了内容
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">组件缓存 &lt;KeepAlive&gt; · pages/vue-keepalive.vue</h1>
    <div class="flex gap-2">
      <button class="rounded px-3 py-1" :class="tab === 'A' ? 'bg-blue-600 text-white' : 'border'" @click="tab = 'A'">面板A</button>
      <button class="rounded px-3 py-1" :class="tab === 'B' ? 'bg-blue-600 text-white' : 'border'" @click="tab = 'B'">面板B</button>
    </div>
    <KeepAlive>
      <component :is="tab === 'A' ? A : B" />
    </KeepAlive>

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
          <tr class="border-b"><td class="px-2 py-1">缓存</td><td class="px-2 py-1">&lt;keep-alive&gt;</td><td class="px-2 py-1">&lt;KeepAlive&gt;</td><td class="px-2 py-1">无原生</td></tr>
          <tr class="border-b"><td class="px-2 py-1">用途</td><td class="px-2 py-1">Tab/路由缓存</td><td class="px-2 py-1">同左</td><td class="px-2 py-1">状态提升</td></tr>
          <tr class="border-b"><td class="px-2 py-1">钩子</td><td class="px-2 py-1">activated/deactivated</td><td class="px-2 py-1">同左</td><td class="px-2 py-1">—</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：&lt;KeepAlive&gt; 让被切换的组件不销毁，保住内部状态；配 include/exclude 可按名精确控制。</p>
    </details>
  </main>
</template>
