<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（组件通信篇·子→父）· defineEmits
// · Vue2：this.$emit('change', val)，父 @change="fn"；
// · Vue3：defineEmits(['change']) + emit('change', val)，父 @change="fn"；
// · React 对照：父传 onChagne(props)，子调用 props.onChange(val)。
// 📌 实战定位：子→父通信【基础必学】；配合 props 完成双向数据流。
// 🧭 学习模式：🔧固定写法=defineEmits + emit()；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, defineComponent, h } from 'vue'
// 🔧 现代写法：独立子组件 EmitCounter 用 <script setup> 的 defineEmits（见 app/components/EmitCounter.vue）
//    Nuxt 自动从 app/components 注册，这里显式 import 便于理解。
import EmitCounter from '~/components/EmitCounter.vue'

const msg = ref('（未收到子事件）')

// 🔧 固定写法：子组件 defineEmits 声明事件，setup 里拿到 emit
const EmitBtn = defineComponent({
  emits: ['ping'],
  setup(_, { emit }) {
    // 👉 练习：让子组件再 emit 一个带 payload 的 'pong' 事件
    return () => h('button', { class: 'rounded bg-green-600 px-3 py-1 text-white', onClick: () => emit('ping', Date.now()) }, '点我 emit ping')
  },
})
function onPing(t: number) {
  msg.value = '收到子事件 @ ' + new Date(t).toLocaleTimeString()
}

// 👉 独立组件写法：父监听 EmitCounter 抛出的 ping，收到子组件内部计数
const cntMsg = ref('（未收到计数）')
function onCount(n: number) {
  cntMsg.value = '子组件计数到 ' + n
}
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">子→父 emit 事件 · pages/vue-events.vue</h1>
    <!-- 写法一：内联 defineComponent（Options 风格 emits 声明） -->
    <EmitBtn @ping="onPing" />
    <p class="text-sm">{{ msg }}</p>

    <!-- 写法二：独立组件 <script setup> + 类型化 defineEmits（现代写法） -->
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
          <tr class="border-b"><td class="px-2 py-1">声明</td><td class="px-2 py-1">（无，约定俗成）</td><td class="px-2 py-1">defineEmits(['x'])</td><td class="px-2 py-1">props 类型标注</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：子组件用 emit 把动作/数据抛给父，父用 @事件 监听；这是 Vue 父子通信的另一半（props 是父→子）。</p>
    </details>
  </main>
</template>
