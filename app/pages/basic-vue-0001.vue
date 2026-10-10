<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（起步篇）· &lt;script setup&gt; + 模板插值
// · Vue2：Options API —— data() / methods / computed 分散写，模板用 {{ }} 插值；
// · Vue3：&lt;script setup&gt; 组合式 —— 顶层 const 即响应式状态，函数即方法，模板直接可用；
// · React 对照：&lt;script setup&gt; ≈ 函数组件顶层作用域，ref ≈ useState，computed ≈ useMemo。
// 📌 实战定位：Vue3 起步骨架【基础必学】；所有 Vue3 页面都长这样，先吃透。
// 🧭 学习模式：🔧固定写法=&lt;script setup&gt; + ref + {{ }} 插值；👉=练习点（已填，跑通即懂）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref } from 'vue'

// 🔧 固定写法：ref 包裹基本类型，模板里自动解包（JS 里要 .value）
const count = ref(0)
const msg = ref('Hello Social Basic')

// 👉 练习：把按钮改成 +2，或加一个输入框用 v-model 双向绑 msg
function inc() {
  count.value++
}
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">Vue3 起步骨架 · pages/basic-vue-0001.vue</h1>
    <p>msg：{{ msg }}</p>
    <p>count：{{ count }}</p>
    <button class="rounded bg-blue-600 px-3 py-1 text-white" @click="inc">+1</button>

    <details class="mt-6 rounded border p-3 text-sm">
      <summary class="cursor-pointer font-semibold">📚 Vue2 / Vue3 / React 三向对照 & 本项目小结</summary>
      <table class="mt-2 w-full border-collapse text-left">
        <thead>
          <tr class="border-b">
            <th class="px-2 py-1">维度</th>
            <th class="px-2 py-1">Vue2 (Options)</th>
            <th class="px-2 py-1">Vue3 (&lt;script setup&gt;)</th>
            <th class="px-2 py-1">React</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b"><td class="px-2 py-1">状态</td><td class="px-2 py-1">data() 返回对象</td><td class="px-2 py-1">const x = ref(0)</td><td class="px-2 py-1">const [x,setX]=useState(0)</td></tr>
          <tr class="border-b"><td class="px-2 py-1">方法</td><td class="px-2 py-1">methods:{...}</td><td class="px-2 py-1">顶层 function</td><td class="px-2 py-1">顶层 function</td></tr>
          <tr class="border-b"><td class="px-2 py-1">插值</td><td class="px-2 py-1">{{ count }}</td><td class="px-2 py-1">{{ count }}</td><td class="px-2 py-1">{'{count}'}</td></tr>
          <tr class="border-b"><td class="px-2 py-1">改值</td><td class="px-2 py-1">this.count++</td><td class="px-2 py-1">count.value++</td><td class="px-2 py-1">setX(x+1)</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：Vue3 用 &lt;script setup&gt; 把状态/方法写在顶层，模板直接可用；ref 在 JS 里要 .value，模板里自动解包。</p>
    </details>
  </main>
</template>
