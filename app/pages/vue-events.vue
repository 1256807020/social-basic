<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（组件通信篇·子→父）· defineEmits
// · Vue2：this.$emit('change', val)，父 @change="fn"；
// · Vue3：<script setup> 里 defineEmits<{ (e:'change', v:any):void }>() 声明，emit('change', val)，父 @change="fn"；
// · React 对照：父传 onChange(props)，子调用 props.onChange(val)。
// 📌 实战定位：子→父通信【基础必学】；配合 props 完成双向数据流。
// 📌 生产规范：Vue3 组件一律用 <script setup> 写，不用 defineComponent + h 手写渲染函数。
// 🧭 学习模式：🔧固定写法=defineEmits + emit()；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref } from 'vue'
// 🔧 现代写法：独立子组件 EmitCounter 用 <script setup> 的 defineEmits（见 app/components/EmitCounter.vue）
//    Nuxt 自动从 app/components 注册，这里显式 import 便于理解。
import EmitCounter from '~/components/EmitCounter.vue'

// 👉 父组件监听子组件抛出的 ping，拿到子组件内部计数
const cntMsg = ref('（未收到计数）')
function onCount(n: number) {
  cntMsg.value = '子组件计数到 ' + n
}
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">子→父 emit 事件 · pages/vue-events.vue</h1>
    <!-- 🔧 固定写法：父用 @事件 监听子组件 emit 出来的事件 -->
    <EmitCounter @ping="onCount" />
    <p class="text-sm">{{ cntMsg }}</p>

    <details class="mt-6 rounded border p-3 text-sm">
      <summary class="cursor-pointer font-semibold">📚 Vue2 / Vue3 / React 三向对照 & 本项目小结</summary>
      <table class="mt-2 w-full border-collapse text-left">
        <thead>
          <tr class="border-b">
            <th class="px-2 py-1">维度</th>
            <th class="px-2 py-1">Vue2 (Options)</th>
            <th class="px-2 py-1">Vue3</th>
            <th class="px-2 py-1">React</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b"><td class="px-2 py-1">子发事件</td><td class="px-2 py-1">this.$emit('x', v)</td><td class="px-2 py-1">emit('x', v)</td><td class="px-2 py-1">props.onX(v)</td></tr>
          <tr class="border-b"><td class="px-2 py-1">父监听</td><td class="px-2 py-1">@x="fn"</td><td class="px-2 py-1">@x="fn"</td><td class="px-2 py-1">onX={fn}</td></tr>
          <tr class="border-b"><td class="px-2 py-1">声明</td><td class="px-2 py-1">（无，约定俗成）</td><td class="px-2 py-1">defineEmits&lt;{ (e:'x', v:any):void }&gt;()</td><td class="px-2 py-1">props 类型标注</td></tr>
          <tr class="border-b"><td class="px-2 py-1">组件写法</td><td class="px-2 py-1">export default { props, methods }</td><td class="px-2 py-1">&lt;script setup&gt;（生产唯一推荐）</td><td class="px-2 py-1">function C(props)</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：子组件用 emit 把动作/数据抛给父，父用 @事件 监听；这是 Vue 父子通信的另一半（props 是父→子）。</p>
    </details>
  </main>
</template>
