<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（自定义指令篇）· v-focus 等
// · Vue2：Vue.directive('x',{ inserted(el){} }) 全局 / 组件内 directives:{ x }；
// · Vue3：setup 里 const vFocus = { mounted(el){} }，模板直接用 v-focus（vXxx 自动注册）；
// · React 对照：无内置，用 ref 回调模拟底层 DOM 行为。
// 📌 实战定位：DOM 底层封装【了解即可·进阶】；自动聚焦、点击外部关闭、权限指令常用。
// 🧭 学习模式：🔧固定写法=const vXxx={mounted(el){}}；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, type Directive } from 'vue'

// 🔧 固定写法：setup 内 vXxx 即指令名 v-xxx
const vFocus: Directive<HTMLElement> = { mounted: (el) => el.focus() }
const txt = ref('')
// 👉 练习：vColor 指令——mounted 时用 binding.value 给 el 设 color（演示 Directive 泛型 + binding）
const vColor: Directive<HTMLElement, string> = {
  mounted: (el, binding) => { el.style.color = binding.value || 'crimson' }
}
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">自定义指令 · pages/vue-custom-directive.vue</h1>
    <p class="text-sm text-gray-500">下面的输入框挂载后自动聚焦（v-focus）：</p>
    <input v-focus v-model="txt" class="w-full rounded border px-2 py-1" placeholder="自动聚焦" />

    <p class="text-sm text-gray-500 mt-4">下面的文字由 v-color 指令在 mounted 时染色（binding.value 传给指令）：</p>
    <p v-color="'crimson'" class="text-lg font-semibold">我被 v-color="'crimson'" 染红了（指令封装 DOM 行为）</p>
    <p v-color="'#0a7'" class="text-lg font-semibold">我传了另一个颜色 v-color="'#0a7'"，同样生效</p>

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
          <tr class="border-b"><td class="px-2 py-1">全局注册</td><td class="px-2 py-1">Vue.directive</td><td class="px-2 py-1">app.directive</td><td class="px-2 py-1">无（ref 回调）</td></tr>
          <tr class="border-b"><td class="px-2 py-1">局部(setup)</td><td class="px-2 py-1">directives:{x}</td><td class="px-2 py-1">const vXxx={...}</td><td class="px-2 py-1">useRef+useEffect</td></tr>
          <tr class="border-b"><td class="px-2 py-1">钩子</td><td class="px-2 py-1">inserted/bind</td><td class="px-2 py-1">mounted/updated</td><td class="px-2 py-1">useEffect</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：自定义指令封装「复用 DOM 行为」（聚焦/点击外关闭/权限）；React 没有一等公民指令，用 ref + 副作用实现同等效果。</p>
    </details>
  </main>
</template>
