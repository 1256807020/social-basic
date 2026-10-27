<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（渲染篇）· v-if / v-for / :key + 真实接口 CRUD
// · Vue2：v-if / v-else / v-for 同 Vue3；注意 v-for 与 v-if 同元素时 Vue2 优先级不同；
// · Vue3：v-if 优先级高于 v-for（同元素不共存，需包一层 <template v-for>）；:key 必须稳定；
// · React 对照：{ list.map(x => <li key={x.id}>...) }，条件用 && / 三元。
// 📌 实战定位：列表/条件渲染【基础必学】；后台表格、菜单、Tab 切换天天用。
// 🧭 学习模式：🔧固定写法=v-for="x in list" :key="x.id" + computed 预过滤；👉=练习点（新增/改热门/删除 已落地，全部走 /api/fruit）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, computed, onMounted } from 'vue'
import type { Fruit } from '~/types/fruit'
import type { ApiListResult } from '~/types/api'

// 🔧 真实接口：本页数据全部来自 /api/fruit（一个 fruit.json = 一张表 = 一套 CRUD）。
//    首次 POST /api/fruit 会自动建库（引擎 schema-less，无需后端配合）。
const fruits = ref<Fruit[]>([])
const onlyHot = ref(false)
const newName = ref('')

// 查（GET /api/fruit）—— 📌 生产写法：给 $fetch 传泛型，响应自带类型，不写 any
async function load() {
  const res = await $fetch<ApiListResult<Fruit>>('/api/fruit', { query: { sort: '-id' } })
  fruits.value = res.data || []
}

// 🔧 固定写法：过滤列表【不要】把 v-if 和 v-for 放同一元素（Vue3 下 v-if 优先）。
//    先 computed 过滤出要渲染的数组，v-for 只管遍历（这里是对已拉取数据的纯前端渲染过滤）。
const displayList = computed(() =>
  onlyHot.value ? fruits.value.filter((f) => f.hot) : fruits.value,
)

// 增（POST /api/fruit）—— 👉 练习点：往接口塞字段，后端照收（schema-less，不校验）
async function addFruit() {
  const name = newName.value.trim()
  if (!name) return
  await $fetch('/api/fruit', { method: 'POST', body: { name, hot: false } })
  newName.value = ''
  load()
}

// 改（PATCH /api/fruit/:id）—— 👉 练习点：增量合并，只传要改的字段
async function toggleHot(f: Fruit) {
  await $fetch(`/api/fruit/${f.id}`, { method: 'PATCH', body: { hot: !f.hot } })
  load()
}

// 删（DELETE /api/fruit/:id）—— 👉 练习点
async function removeFruit(id: number) {
  await $fetch(`/api/fruit/${id}`, { method: 'DELETE' })
  load()
}

onMounted(() => load())
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">列表 / 条件渲染 · pages/vue-list-render.vue</h1>
    <p class="text-sm text-gray-500">
      数据全部走真实接口 <code>/api/fruit</code>（一个 JSON 文件 = 一张表 = 全套 CRUD）。首次新增会自动建库。
    </p>

    <!-- 👉 练习点：新增水果 —— POST /api/fruit -->
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
      <button class="rounded border px-3 py-1 text-sm" @click="load">刷新</button>
    </div>

    <label class="flex items-center gap-2 text-sm">
      <input type="checkbox" v-model="onlyHot" /> 只看热门（computed 预过滤，纯前端渲染）
    </label>

    <ul class="space-y-1 text-sm">
      <!-- 🔧 固定写法：v-for 必须 :key（用稳定 id，勿用 index）；v-if 已提前到 computed，这里只遍历 -->
      <li v-for="f in displayList" :key="f.id" class="flex items-center gap-2 border-b py-1">
        <button class="text-base" :title="f.hot ? '取消热门' : '标为热门'" @click="toggleHot(f)">
          <span v-if="f.hot" class="text-red-500">🔥</span>
          <span v-else class="text-gray-300">·</span>
        </button>
        <span class="flex-1">#{{ f.id }} {{ f.name }}</span>
        <!-- 👉 练习点：删除 —— DELETE /api/fruit/:id -->
        <button class="text-xs text-red-500" @click="removeFruit(f.id)">删除</button>
      </li>
    </ul>

    <p v-if="displayList.length === 0" class="text-sm text-gray-400">
      列表为空，试试新增水果（首次新增会自动建表）。
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
          <tr class="border-b"><td class="px-2 py-1">取数</td><td class="px-2 py-1">axios / this.$http</td><td class="px-2 py-1">$fetch + onMounted</td><td class="px-2 py-1">useEffect + fetch</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">
        📝 小结：v-for 必须配稳定 :key（用 id 别用 index）；v-if 与 v-for 不要放同一元素（Vue3 下 v-if 优先），
        用 computed 预过滤再 v-for。本页增删改查全部走 <code>/api/fruit</code>：POST 建/增、GET 查、PATCH 增量改、DELETE 删；
        首次 POST 自动建库，引擎 schema-less，前端往 body 多塞字段后端照收。
      </p>
    </details>
  </main>
</template>
