<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 生产级 CRUD 增强演示 · §17.2（树 / 拖动排序 / 多字段排序 / 自定义操作列）
// ① 视角：从「会写简单列表 CRUD」进阶到「生产里真正天天见的 CRUD 变体」。
// ② 实战定位：树形菜单、可拖拽排序的后台列表、多列排序、行内业务动作——
//    这些是后台系统绕不开的增删改查，基座引擎已原生支持，缺的是演示页。
// ③ 学习模式：🔧 固定写法 = 树用 tree=1+parentKey；排序用 sort=f1,-f2；
//    拖拽 = 每条 order + batch-update 增量持久化。👉 练习点：把排序字段换成你自己的业务字段。
// ───────────────────────────────────────────────────────────
import { ref, onMounted } from 'vue'

const RES = 'pro-crud-demo' // 🔧 固定写法：新资源只建 data/<resource>.json（首次 POST 自动建库），语义化命名

interface Row {
  id: number
  name: string
  parentId: number | null
  order: number
  status: string
  createdAt?: string
  children?: Row[]
}

const tree = ref<Row[]>([]) // 树（tree=1 返回嵌套）
const list = ref<Row[]>([]) // 平铺列表（拖动排序 / 多字段排序 / 自定义操作列共用）
const loading = ref(false)
const sortKey = ref('order') // 当前多字段排序：-order / order / name / status,name / -createdAt
const newName = ref('')
const newParentId = ref<number | null>(null)

// 🔧 固定写法：Nuxt 全局 $fetch 直接打 /api/*，无需自己拼 baseURL；统一取 .data（呼应 §0 信封铁律）
async function api(path: string, opts: Record<string, unknown> = {}): Promise<unknown> {
  const res = (await $fetch(`/api/${RES}${path}`, opts as any)) as { data: any }
  return res.data
}

// 首次进入：集合为空则灌种子（不提交 data/*.json，符合 §16.4 铁律）
async function ensureSeed() {
  const c = (await api('/count')) as { total: number }
  if (c.total > 0) return
  const seed: Omit<Row, 'id'>[] = [
    { name: '前端', parentId: null, order: 1, status: 'active' },
    { name: '后端', parentId: null, order: 2, status: 'active' },
    { name: 'Vue 组件', parentId: 1, order: 1, status: 'active' },
    { name: 'React 组件', parentId: 1, order: 2, status: 'pending' },
    { name: 'Node 服务', parentId: 2, order: 1, status: 'active' },
  ]
  // 🔧 固定写法：POST 数组 = 批量新增（引擎对每条自动补 id/createdAt）
  await api('', { method: 'POST', body: seed })
}

async function refresh() {
  loading.value = true
  try {
    await ensureSeed()
    // 树：tree=1 + parentKey/childrenKey，引擎返回嵌套
    const t = (await api(`?tree=1&parentKey=parentId&childrenKey=children&pageSize=1000`)) as { data: Row[] }
    tree.value = t.data
    // 平铺 + 多字段排序
    const l = (await api(`?sort=${sortKey.value}&pageSize=1000`)) as { data: Row[] }
    list.value = l.data
  } finally {
    loading.value = false
  }
}

onMounted(refresh)

async function addRow() {
  if (!newName.value.trim()) return
  // 🔧 固定写法：单条对象 = 新增；parentId 决定挂在树的哪一层
  await api('', { method: 'POST', body: { name: newName.value.trim(), parentId: newParentId.value, order: list.value.length + 1, status: 'active' } })
  newName.value = ''
  newParentId.value = null
  await refresh()
}

async function delRow(id: number) {
  await api(`/${id}`, { method: 'DELETE' })
  await refresh()
}

// 自定义操作列：审核 / 启用 / 禁用（走 batch-update 持久化，非纯前端）
async function setStatus(id: number, status: string) {
  await api('/batch-update', { method: 'POST', body: [{ id, status }] })
  await refresh()
}

// 📌 导出：把当前列表打成 JSON 下载（UI 层动作，不依赖额外接口）
function exportRows() {
  const blob = new Blob([JSON.stringify(list.value, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${RES}.json`
  a.click()
}

// 📌 拖动排序：HTML5 draggable，drop 后重排 order 并 batch-update 增量持久化
//    铁律：每条 order 字段 + batch-update，禁用「单条 blob 记录装大数组」（§0）
const dragId = ref<number | null>(null)
async function onDrop(targetId: number) {
  if (dragId.value == null || dragId.value === targetId) return
  const arr = [...list.value]
  const from = arr.findIndex((r) => r.id === dragId.value)
  const to = arr.findIndex((r) => r.id === targetId)
  const [moved] = arr.splice(from, 1)
  arr.splice(to, 0, moved)
  // 重算 order，只发变化的那几条（增量，不整个覆盖集合）
  const updates = arr.map((r, i) => ({ id: r.id, order: i + 1 }))
  await api('/batch-update', { method: 'POST', body: updates })
  dragId.value = null
  await refresh()
}

// 树 → 平铺（带层级缩进），用简单嵌套 <ul> 渲染，避免递归组件
function flatten(nodes: Row[], depth = 0): { row: Row; depth: number }[] {
  return nodes.flatMap((n) => [{ row: n, depth }, ...flatten(n.children ?? [], depth + 1)])
}
</script>

<template>
  <main class="mx-auto max-w-4xl space-y-6 p-6">
    <header class="space-y-1">
      <h1 class="text-2xl font-bold">生产级 CRUD 增强 · §17.2 · /pro-crud</h1>
      <p class="text-sm text-gray-500">
        一个 JSON = 一套 CRUD，下面四种变体全部走 <code>/api/pro-crud-demo</code>，零自造接口。
      </p>
    </header>

    <section class="space-y-3 rounded border p-4">
      <h2 class="text-lg font-semibold">① 树形 CRUD（tree=1）</h2>
      <ul class="space-y-1 text-sm">
        <li v-for="item in flatten(tree)" :key="item.row.id" :style="{ paddingLeft: item.depth * 16 + 'px' }" class="flex items-center gap-2">
          <span class="flex-1">{{ item.row.name }} <span class="text-gray-400">#{{ item.row.id }} · {{ item.row.status }}</span></span>
          <button class="rounded bg-emerald-600 px-2 py-0.5 text-white" @click="newParentId = item.row.id; newName = '子级'">+子级</button>
          <button class="rounded bg-red-500 px-2 py-0.5 text-white" @click="delRow(item.row.id)">删除</button>
        </li>
      </ul>
    </section>

    <section class="space-y-3 rounded border p-4">
      <h2 class="text-lg font-semibold">新增节点</h2>
      <div class="flex gap-2 text-sm">
        <input v-model="newName" placeholder="名称" class="rounded border px-2 py-1" />
        <label class="flex items-center gap-1">
          父级：
          <select v-model.number="newParentId" class="rounded border px-2 py-1">
            <option :value="null">根</option>
            <option v-for="n in flatten(tree)" :key="n.row.id" :value="n.row.id">{{ n.row.name }}</option>
          </select>
        </label>
        <button class="rounded bg-blue-600 px-3 py-1 text-white" @click="addRow">新增</button>
      </div>
    </section>

    <section class="space-y-3 rounded border p-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold">② 多字段排序 + ③ 拖动排序 + ④ 自定义操作列（同一张列表）</h2>
        <button class="rounded bg-gray-700 px-2 py-1 text-white text-xs" @click="exportRows">导出 JSON</button>
      </div>

      <!-- 多字段排序控制：sort=f1,-f2（- 前缀降序） -->
      <div class="flex items-center gap-2 text-sm">
        <span>排序：</span>
        <select v-model="sortKey" class="rounded border px-2 py-1" @change="refresh">
          <option value="order">order 升</option>
          <option value="-order">order 降</option>
          <option value="name">name 升</option>
          <option value="status,name">status, name</option>
          <option value="-createdAt">createdAt 降</option>
        </select>
        <span class="text-gray-400">↔ React：React-Table 的 sortingState；这里直接拼 query 让引擎排</span>
      </div>

      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b">
            <th class="px-2 py-1">拖拽</th>
            <th class="px-2 py-1">#</th>
            <th class="px-2 py-1">name</th>
            <th class="px-2 py-1">order</th>
            <th class="px-2 py-1">status</th>
            <th class="px-2 py-1">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in list"
            :key="row.id"
            class="border-b"
            draggable="true"
            @dragstart="dragId = row.id"
            @dragover.prevent
            @drop="onDrop(row.id)"
          >
            <td class="px-2 py-1 cursor-move">⠿</td>
            <td class="px-2 py-1 text-gray-400">{{ row.id }}</td>
            <td class="px-2 py-1">{{ row.name }}</td>
            <td class="px-2 py-1">{{ row.order }}</td>
            <td class="px-2 py-1">
              <span :class="row.status === 'active' ? 'text-emerald-600' : row.status === 'disabled' ? 'text-red-500' : 'text-amber-500'">{{ row.status }}</span>
            </td>
            <td class="px-2 py-1 space-x-1">
              <!-- 自定义操作列：行内业务动作 -->
              <button class="rounded bg-emerald-600 px-2 py-0.5 text-white" @click="setStatus(row.id, 'active')">审核</button>
              <button class="rounded bg-blue-600 px-2 py-0.5 text-white" @click="setStatus(row.id, 'active')">启用</button>
              <button class="rounded bg-gray-500 px-2 py-0.5 text-white" @click="setStatus(row.id, 'disabled')">禁用</button>
              <button class="rounded bg-red-500 px-2 py-0.5 text-white" @click="delRow(row.id)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="loading" class="text-xs text-gray-400">加载中…</p>
    </section>

    <details class="rounded border p-4 text-sm">
      <summary class="cursor-pointer font-semibold">Vue2 / Vue3 / React 三向对照 + 小结</summary>
      <table class="mt-2 w-full border-collapse text-left">
        <thead>
          <tr class="border-b">
            <th class="px-2 py-1">能力</th>
            <th class="px-2 py-1">Vue2 (Options)</th>
            <th class="px-2 py-1">Vue3 (本页 / Nuxt)</th>
            <th class="px-2 py-1">React</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b"><td class="px-2 py-1">数据请求</td><td class="px-2 py-1">this.$http / axios</td><td class="px-2 py-1">$fetch / useFetch（自动拆 .data）</td><td class="px-2 py-1">fetch / TanStack Query</td></tr>
          <tr class="border-b"><td class="px-2 py-1">树形</td><td class="px-2 py-1">递归组件 + props</td><td class="px-2 py-1">tree=1 让引擎返回嵌套，或 flatten 平铺渲染</td><td class="px-2 py-1">递归组件 / 受控树</td></tr>
          <tr class="border-b"><td class="px-2 py-1">排序</td><td class="px-2 py-1">computed 前端排</td><td class="px-2 py-1">sort=f1,-f2 让引擎排（可多字段）</td><td class="px-2 py-1">React-Table sortingState</td></tr>
          <tr class="border-b"><td class="px-2 py-1">拖拽排序</td><td class="px-2 py-1">vuedraggable</td><td class="px-2 py-1">HTML5 draggable + order + batch-update</td><td class="px-2 py-1">dnd-kit / react-beautiful-dnd</td></tr>
          <tr class="border-b"><td class="px-2 py-1">行内动作</td><td class="px-2 py-1">作用域插槽</td><td class="px-2 py-1">模板内 @click 直接调 batch-update</td><td class="px-2 py-1">column.render</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">
        📝 小结：生产 CRUD 的难点不在「增删改」，而在树/排序/拖拽/行内动作这些变体。
        本基座把它们收敛成「query 参数 + 两个批量端点（batch-update / batch-delete）」，
        前端只管组装请求，不用写后端。拖拽排序记住铁律：每条 order + 增量 batch-update。
      </p>
    </details>
  </main>
</template>
