<script setup lang="ts">
// 【集合案例 · Collection】路由 /basic
// 定位：演示后端「一个 JSON 文件 = 一套 CRUD 集合」引擎的全部能力 + 图片集合 / 验证码等基座能力。
// 与 social-start/app/basic/page.tsx 1:1 对齐，关键原则：
//   - Todo 的「增删查 + 分页 + 树形」全部操作同一个 todo.json 集合（/api/todo），
//     与 /todos、/todo-client 共用同一集合，体现"一个集合、多种访问范式"。
//     parentId 关系经 ?tree=1 由后端派生嵌套树，**不另建 tree.json**（树只是 todo 的视图）。
//   - 图片上传 + 静态访问（/api/image/*）、图形验证码（/api/captcha*）为独立进阶能力。
import { ref, computed, onMounted } from 'vue'
import TreeNode from '~/components/TreeNode.vue'

const todos = ref<any[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 8
const title = ref('')
const parentId = ref('')
const editing = ref<number | null>(null)
const images = ref<any[]>([])
const cap = ref<{ captchaId: string; image: string } | null>(null)
const code = ref('')
const capMsg = ref('')
const tree = ref<any[]>([])

async function loadTodos(p: number) {
  const j: any = await $fetch('/api/todo', { query: { page: p, pageSize, sort: '-id' } })
  todos.value = j.data || []
  total.value = j.total || 0
  page.value = p
}
async function loadImages() {
  const j: any = await $fetch('/api/image/list', { query: { pageSize: 12 } }).catch(() => null)
  if (j) images.value = j.data || []
}
async function loadCap() {
  const j: any = await $fetch('/api/captcha').catch(() => null)
  if (j) cap.value = j.data
  code.value = ''
  capMsg.value = ''
}
async function loadTree() {
  const j: any = await $fetch('/api/todo', { query: { tree: 1 } }).catch(() => null)
  if (j) tree.value = j.data || []
}

onMounted(() => {
  loadTodos(1)
  loadImages()
  loadCap()
  loadTree()
})

async function saveTodo(e: Event) {
  e.preventDefault()
  if (!title.value.trim()) return
  const payload = { title: title.value, parentId: parentId.value ? Number(parentId.value) : 0 }
  if (editing.value != null) {
    // 局部合并更新用 PATCH（replace=false），避免覆盖 title/parentId 等字段
    await $fetch(`/api/todo/${editing.value}`, { method: 'PATCH', body: payload })
    editing.value = null
  } else {
    await $fetch('/api/todo', { method: 'POST', body: { ...payload, done: false } })
  }
  title.value = ''
  parentId.value = ''
  loadTodos(page.value)
  loadTree()
}
function startEdit(t: any) {
  editing.value = t.id
  title.value = t.title
  parentId.value = String(t.parentId ?? 0)
}
function cancelEdit() {
  editing.value = null
  title.value = ''
  parentId.value = ''
}
async function delTodo(id: number) {
  await $fetch(`/api/todo/${id}`, { method: 'DELETE' })
  loadTodos(page.value)
  loadTree()
}
async function upload(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  const fd = new FormData()
  fd.append('file', file)
  await $fetch('/api/image/upload', { method: 'POST', body: fd })
  loadImages()
  input.value = ''
}
async function verify() {
  if (!cap.value) return
  const j: any = await $fetch('/api/captcha/verify', {
    method: 'POST',
    body: { captchaId: cap.value.captchaId, code: code.value },
  })
  capMsg.value = j.data?.success ? '✅ 校验通过' : '❌ 验证码错误'
}

const totalPages = computed(() => Math.max(Math.ceil(total.value / pageSize), 1))
</script>

<template>
  <main class="mx-auto max-w-6xl space-y-6 p-6">
    <h1 class="text-2xl font-bold">集合案例（Collection）· 基座能力演示 · pages/basic.vue</h1>

    <div class="grid gap-6 md:grid-cols-3">
      <!-- Todo CRUD + 分页（操作 todo.json 集合） -->
      <section class="space-y-3 rounded-xl border p-4">
        <h2 class="font-semibold">Todo（增删查 + 分页 + 树形 parentId）</h2>
        <form class="space-y-2" @submit="saveTodo">
          <input
            v-model="title"
            class="w-full rounded border px-2 py-1"
            placeholder="标题"
          />
          <input
            v-model="parentId"
            class="w-full rounded border px-2 py-1"
            placeholder="parentId（0=根，可做树）"
          />
          <div class="flex gap-2">
            <button type="submit" class="rounded bg-blue-600 px-3 py-1 text-white">
              {{ editing != null ? '保存修改' : '新增' }}
            </button>
            <button
              v-if="editing != null"
              type="button"
              class="rounded border px-3 py-1"
              @click="cancelEdit"
            >
              取消
            </button>
          </div>
        </form>
        <ul class="space-y-1 text-sm">
          <li
            v-for="t in todos"
            :key="t.id"
            class="flex items-center justify-between gap-2 border-b py-1"
          >
            <span>
              #{{ t.id }} {{ t.title }} <span v-if="t.done">✅</span>
              <span v-if="t.parentId"> (p:{{ t.parentId }})</span>
            </span>
            <span class="flex shrink-0 gap-1">
              <button class="rounded border px-2 py-0.5 text-xs" type="button" @click="startEdit(t)">
                改
              </button>
              <button
                class="rounded border px-2 py-0.5 text-xs text-red-600"
                type="button"
                @click="delTodo(t.id)"
              >
                删
              </button>
            </span>
          </li>
        </ul>
        <div class="flex items-center justify-between text-sm">
          <button
            class="rounded border px-2 py-1 disabled:opacity-40"
            :disabled="page <= 1"
            @click="loadTodos(page - 1)"
          >
            上一页
          </button>
          <span>{{ page }} / {{ totalPages }}（共 {{ total }}）</span>
          <button
            class="rounded border px-2 py-1 disabled:opacity-40"
            :disabled="page >= totalPages"
            @click="loadTodos(page + 1)"
          >
            下一页
          </button>
        </div>
      </section>

      <!-- 图片上传 + 展示 -->
      <section class="space-y-3 rounded-xl border p-4">
        <h2 class="font-semibold">图片（上传 + 静态访问）</h2>
        <input type="file" accept="image/*" @change="upload" />
        <div class="grid grid-cols-3 gap-2">
          <a v-for="img in images" :key="img.name" :href="img.url" target="_blank" rel="noreferrer">
            <img :src="img.url" :alt="img.name" class="h-20 w-full rounded object-cover" />
          </a>
        </div>
      </section>

      <!-- 验证码 -->
      <section class="space-y-3 rounded-xl border p-4">
        <h2 class="font-semibold">图形验证码</h2>
        <template v-if="cap">
          <img :src="cap.image" alt="captcha" class="h-10" />
          <div class="flex gap-2">
            <input
              v-model="code"
              class="w-24 rounded border px-2 py-1"
              placeholder="输入"
            />
            <button class="rounded bg-green-600 px-3 py-1 text-white" @click="verify">校验</button>
            <button class="rounded border px-2" @click="loadCap">换一张</button>
          </div>
          <p class="text-sm">{{ capMsg }}</p>
        </template>
      </section>
    </div>

    <!-- 树形展示：复用 todo 的 parentId 关系，?tree=1 返回嵌套结构 -->
    <section class="space-y-3 rounded-xl border p-4">
      <div class="flex items-center justify-between">
        <h2 class="font-semibold">树形展示（todo 的 parentId 嵌套 · 同一 todo.json）</h2>
        <button class="rounded border px-2 py-1 text-sm" @click="loadTree">刷新树</button>
      </div>
      <p v-if="tree.length === 0" class="text-sm text-gray-500">
        暂无数据，先在上方「Todo」区新增带 parentId 的条目
      </p>
      <ul v-else class="space-y-1 text-sm">
        <TreeNode v-for="n in tree" :key="n.id" :node="n" />
      </ul>
    </section>
  </main>
</template>
