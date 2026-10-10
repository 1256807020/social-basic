<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（响应式篇）· ref / reactive / computed
// · Vue2：靠 Object.defineProperty 劫持 data()，数组是黑魔法（重写方法）；
// · Vue3：Proxy 代理，ref(基本类型) / reactive(对象)，computed 派生只读；
// · React 对照：useState / useMemo 近似（但 Vue 响应式是自动追踪依赖）。
// 📌 实战定位：响应式【基础必学】；ref 管基本类型、reactive 管对象、computed 管派生。
// 🧭 学习模式：🔧固定写法=ref(0)/reactive({})/computed(()=>...)；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, reactive, computed } from 'vue'

const count = ref(1)
const user = reactive({ name: 'Tom', age: 18 })
const double = computed(() => count.value * 2) // 🔧 固定写法：computed 返回派生值

// 👉 练习：点按钮让 age+1，观察 double（不变，因只依赖 count）与 user.age（变）
function grow() {
  count.value++
  user.age++
}
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">响应式 ref / reactive / computed · pages/vue-reactivity.vue</h1>
    <p>count：{{ count }} → double：{{ double }}</p>
    <p>user：{{ user.name }} / {{ user.age }} 岁</p>
    <button class="rounded bg-blue-600 px-3 py-1 text-white" @click="grow">count+1 &amp; age+1</button>

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
          <tr class="border-b"><td class="px-2 py-1">基本类型</td><td class="px-2 py-1">data() 里写</td><td class="px-2 py-1">ref(0)</td><td class="px-2 py-1">useState(0)</td></tr>
          <tr class="border-b"><td class="px-2 py-1">对象</td><td class="px-2 py-1">data() 里写</td><td class="px-2 py-1">reactive({})</td><td class="px-2 py-1">useState({})</td></tr>
          <tr class="border-b"><td class="px-2 py-1">派生</td><td class="px-2 py-1">computed:{...}</td><td class="px-2 py-1">computed(()=>...)</td><td class="px-2 py-1">useMemo(()=>...)</td></tr>
          <tr class="border-b"><td class="px-2 py-1">依赖追踪</td><td class="px-2 py-1">自动</td><td class="px-2 py-1">自动(Proxy)</td><td class="px-2 py-1">手动列依赖</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：ref 管基本类型（模板自动解包），reactive 管对象（直接 .属性），computed 管派生只读值；改 ref 要 .value。</p>
    </details>
  </main>
</template>
