<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（响应式篇）· ref / reactive / computed
// · Vue2：靠 Object.defineProperty 劫持 data()，数组是黑魔法（重写方法）；
// · Vue3：Proxy 代理，ref(基本类型) / reactive(对象)，computed 派生只读；
// · React 对照：useState / useMemo 近似（但 Vue 响应式是自动追踪依赖）。
// 📌 实战定位：响应式【基础必学】；ref 管基本类型、reactive 管对象、computed 管派生。
// 🧭 学习模式：🔧固定写法=ref(0)/reactive({})/computed(()=>...)；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, reactive, computed, toRefs } from 'vue'

const count = ref(1)
const user = reactive({ name: 'Tom', age: 18 })
const double = computed(() => count.value * 2) // 🔧 固定写法：computed 返回派生值

// 👉 练习：点按钮让 age+1，观察 double（不变，因只依赖 count）与 user.age（变）
function grow() {
  count.value++
  user.age++
}

// 🔧 生产坑演示：reactive 直接解构会丢响应性，toRefs 能保留
const person = reactive({ name: 'Tom', age: 18 })
const { age } = person                  // ❌ 解构拿到的是「值的快照」，后续不再跟源对象联动
const { age: ageRef } = toRefs(person)  // ✅ toRefs 把每个属性包成独立 Ref，保留响应性
function bumpPersonAge() {
  person.age++ // 只改源对象；用来观察三条显示的差异
}
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">响应式 ref / reactive / computed · pages/vue-reactivity.vue</h1>
    <p>count：{{ count }} → double：{{ double }}</p>
    <p>user：{{ user.name }} / {{ user.age }} 岁</p>
    <button class="rounded bg-blue-600 px-3 py-1 text-white" @click="grow">count+1 &amp; age+1</button>

    <!-- 👉 演示：reactive 解构丢失响应性 vs toRefs 保留（点上面的按钮看差异） -->
    <section class="rounded border p-4">
      <h2 class="font-semibold">reactive 解构 vs toRefs（点「person.age + 1」看差异）</h2>
      <button class="mt-2 rounded bg-purple-600 px-3 py-1 text-white" @click="bumpPersonAge">person.age + 1</button>
      <ul class="mt-2 space-y-1 text-sm">
        <li>源对象 person.age（响应式）：<b class="text-green-700">{{ person.age }}</b></li>
        <li>解构出的 age（❌ 丢响应性，停在快照）：<b class="text-red-600">{{ age }}</b></li>
        <li>toRefs 的 ageRef（✅ 响应式）：<b class="text-green-700">{{ ageRef }}</b></li>
      </ul>
      <p class="mt-2 text-xs text-gray-500">点 +1 后：person.age 与 ageRef 一起变，解构的 age 永远是初次快照 → 生产里直接解构 reactive 会静默失效；改用 toRefs，或干脆用 ref 包对象。</p>
    </section>

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
