<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（双向绑定篇）· v-model / defineModel
// · Vue2：v-model 是 :value + @input 的语法糖；.sync 修饰符做子改父；
// · Vue3：子组件用 defineModel() 拿到一个可读写 ref，父直接 v-model 绑定；
// · React 对照：受控组件 value + onChange（无内置 v-model 语法糖）。
// 📌 实战定位：表单/组件双向绑定【基础必学】；输入框、抽屉、自定义表单控件都靠它。
// 🧭 学习模式：🔧固定写法=const m = defineModel() + 父 v-model；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref } from 'vue'
// 🔧 现代写法：子组件用 <script setup> 的 defineModel（见 app/components/TextField.vue）
//    📌 defineModel 是编译期宏，只能写在 <script setup> 里；写进 defineComponent({ setup(){} })
//       不会被编译转换，运行时报 "defineModel is not defined"。
//    📌 手写等价版（v-model = props + emit）：见 app/components/ModelManual.vue
import TextField from '~/components/TextField.vue'
import ModelManual from '~/components/ModelManual.vue'

const text = ref('')            // 父里持有 v-model 绑定的值（默认模型）
const heading = ref('初始标题')  // 父里持有具名模型 v-model:title 绑定的值
const manual = ref('')          // 手写 props+emit 等价版
// 👉 练习：再加一个 v-model:count 的子组件，父显示 count
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">v-model 双向绑定 · pages/vue-vmodel.vue</h1>
    <p class="text-sm text-gray-500">父里的 text：{{ text }}</p>
    <p class="text-sm text-gray-500">父里的 heading：{{ heading }}</p>
    <p class="text-sm text-gray-500">父里的 manual：{{ manual }}</p>

    <!-- 🔧 写法一：<script setup> + defineModel（现代写法，支持默认模型 + 具名模型） -->
    <TextField v-model="text" v-model:title="heading" />

    <!-- 📌 写法二：手写 props + emit —— v-model 的本质（展开后完全等价） -->
    <ModelManual v-model="manual" />

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
          <tr class="border-b"><td class="px-2 py-1">本质</td><td class="px-2 py-1">:value + @input</td><td class="px-2 py-1">defineModel() ref</td><td class="px-2 py-1">value + onChange</td></tr>
          <tr class="border-b"><td class="px-2 py-1">子组件</td><td class="px-2 py-1">this.$emit('input', v)</td><td class="px-2 py-1">model.value = v</td><td class="px-2 py-1">props.onChange(v)</td></tr>
          <tr class="border-b"><td class="px-2 py-1">父使用</td><td class="px-2 py-1">v-model="x"</td><td class="px-2 py-1">v-model="x"</td><td class="px-2 py-1">value={x} onChange</td></tr>
          <tr class="border-b"><td class="px-2 py-1">多绑定</td><td class="px-2 py-1">.sync</td><td class="px-2 py-1">v-model:xxx</td><td class="px-2 py-1">多个 props</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：Vue3 的 defineModel() 让自定义组件的 v-model 极简——子组件拿到的就是可读写 ref，父直接 v-model 接。</p>
    </details>
  </main>
</template>
