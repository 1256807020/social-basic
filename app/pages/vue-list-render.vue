<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（渲染篇）· v-if / v-for / :key
// · Vue2：v-if / v-else / v-for 同 Vue3；注意 v-for 与 v-if 同元素时 Vue2 优先级不同；
// · Vue3：v-if 优先级高于 v-for（同元素不共存，需包一层 <template v-for>）；:key 必须稳定；
// · React 对照：{ list.map(x => <li key={x.id}>...) }，条件用 && / 三元。
// 📌 实战定位：列表/条件渲染【基础必学】；后台表格、菜单、Tab 切换天天用。
// 🧭 学习模式：🔧固定写法=v-for="x in list" :key="x.id" + computed 预过滤；👉=练习点（已落地：新增/删除/过滤）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, computed } from 'vue'

interface Fruit {
  id: number
  name: string
  hot?: boolean
}

const list = ref<Fruit[]>([
  { id: 1, name: '苹果', hot: true },
  { id: 2, name: '香蕉' },
  { id: 3, name: '西瓜', hot: true },
])
const onlyHot = ref(false)
const newName = ref('')

// 🔧 固定写法：过滤列表【不要】把 v-if 和 v-for 放同一元素（Vue3 下 v-if 优先，等于整列被条件砍掉）。
//    正确姿势是用 computed 先过滤出「要渲染的数组」，v-for 只管遍历。
const displayList = computed(() =>
  onlyHot.value ? list.value.filter((f) => f.hot) : list.value,
)

// 👉 练习点（已落地）：新增水果 —— push 进 ref 数组，响应式自动重渲染
function addFruit() {
  const name = newName.value.trim()
  if (!name) return
  const nextId = list.value.reduce((max, f) => Math.max(max, f.id), 0) + 1
  list.value.push({ id: nextId, name })
  newName.value = ''
}

// 👉 练习点（已落地）：删除水果 —— 用 filter 返回新数组替换（演示 ref 数组的响应式替换）
function removeFruit(id: number) {
  list.value = list.value.filter((f) => f.id !== id)
}
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">列表 / 条件渲染 · pages/vue-list-render.vue</h1>

    <!-- 👉 练习点：受控输入框 + 按钮，演示 ref 数组 push 的响应式更新 -->
    <div class="flex items-center gap-2">
      <input
        v-model="newName"
        placeholder="输入水果名"
        class="border rounded px-2 py-1 text-sm"
        @keyup.enter="addFruit"
      />
      <button class="rounded bg-blue-600 px-3 py-1 text-sm text-white" @click="addFruit">
        新增水果
      </button>
    </div>

    <label class="flex items-center gap-2 text-sm">
      <input type="checkbox" v-model="onlyHot" /> 只看热门（computed 预过滤）
    </label>

    <ul class="space-y-1 text-sm">
      <!-- 🔧 固定写法：v-for 必须 :key（用稳定 id，勿用 index）；v-if 已提前到 computed，这里只遍历 -->
      <li v-for="f in displayList" :key="f.id" class="flex items-center gap-2 border-b py-1">
        <span v-if="f.hot" class="text-red-500">🔥</span>
        <span v-else class="text-gray-300">·</span>
        <span class="flex-1">{{ f.name }}</span>
        <!-- 👉 练习点：每行删除按钮 -->
        <button class="text-xs text-red-500" @click="removeFruit(f.id)">删除</button>
      </li>
    </ul>

    <p v-if="displayList.length === 0" class="text-sm text-gray-400">
      列表为空，试试新增水果。
    </p>

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
          <tr class="border-b"><td class="px-2 py-1">列表</td><td class="px-2 py-1">v-for="x in list"</td><td class="px-2 py-1">同左（:key 必填）</td><td class="px-2 py-1">list.map(x=&gt;...)</td></tr>
          <tr class="border-b"><td class="px-2 py-1">条件</td><td class="px-2 py-1">v-if / v-else</td><td class="px-2 py-1">同左</td><td class="px-2 py-1">&amp;&amp; / 三元</td></tr>
          <tr class="border-b"><td class="px-2 py-1">key 规则</td><td class="px-2 py-1">建议稳定 id</td><td class="px-2 py-1">必须稳定（勿用 index）</td><td class="px-2 py-1">必须 key={id}</td></tr>
          <tr class="border-b"><td class="px-2 py-1">v-if+v-for</td><td class="px-2 py-1">v-for 优先</td><td class="px-2 py-1">v-if 优先（拆开）</td><td class="px-2 py-1">—</td></tr>
          <tr class="border-b"><td class="px-2 py-1">过滤列表</td><td class="px-2 py-1">同元素 v-if（反模式）</td><td class="px-2 py-1">computed 预过滤后 v-for</td><td class="px-2 py-1">过滤后 map / useMemo</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">
        📝 小结：v-for 必须配稳定 :key（用 id 别用 index）；v-if 与 v-for 不要放同一元素（Vue3 下 v-if 优先），
        用 computed 预过滤再 v-for，或用 &lt;template v-for&gt; 包一层再 v-if。数组增删用 push / filter 替换，
        ref 数组的变更都是响应式的。
      </p>
    </details>
  </main>
</template>
