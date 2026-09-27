<script setup lang="ts">
// /basic 演示页：对标 social-start 的四大能力演示
// 1) 图形验证码 2) 树形 3) 图片上传（以及一个通用 CRUD 列表）

const captcha = ref<{ captchaId: string; image: string } | null>(null)
const captchaInput = ref('')
const captchaMsg = ref('')

async function loadCaptcha() {
  const data: any = await $fetch('/api/captcha')
  captcha.value = data.data
  captchaInput.value = ''
  captchaMsg.value = ''
}
async function verifyCaptcha() {
  if (!captcha.value) return
  const data: any = await $fetch('/api/captcha/verify', {
    method: 'POST',
    body: { captchaId: captcha.value.captchaId, code: captchaInput.value },
  })
  captchaMsg.value = data.data?.success ? '✅ 校验通过' : '❌ 校验失败'
}

// 树形
const treeName = 'tree'
const title = ref('')
const parentId = ref('0')
const tree = ref<any[]>([])

async function loadTree() {
  const data: any = await $fetch(`/api/${treeName}?tree=1&parentKey=parentId`)
  tree.value = data.data || []
}
async function addNode() {
  if (!title.value) return
  await $fetch(`/api/${treeName}`, {
    method: 'POST',
    body: { title: title.value, parentId: Number(parentId.value) || 0 },
  })
  title.value = ''
  await loadTree()
}

// 图片上传
const images = ref<{ name: string; url: string }[]>([])
async function loadImages() {
  const data: any = await $fetch('/api/image/list')
  images.value = data.data || []
}
async function onUpload(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files || !files.length) return
  for (const f of Array.from(files)) {
    const fd = new FormData()
    fd.append('file', f)
    await $fetch('/api/image/upload', { method: 'POST', body: fd })
  }
  await loadImages()
  ;(e.target as HTMLInputElement).value = ''
}

// 通用 CRUD 列表（演示分页 + 关键字）
const listName = 'todo'
const keyword = ref('')
const items = ref<any[]>([])
const page = ref(1)
const total = ref(0)
const totalPages = ref(1)

async function loadList() {
  const data: any = await $fetch(`/api/${listName}`, {
    query: { pageSize: 5, page: page.value, keyword: keyword.value || undefined, sort: '-id' },
  })
  items.value = data.data || []
  total.value = data.total || 0
  totalPages.value = data.totalPages || 1
}

onMounted(() => {
  loadCaptcha()
  loadTree()
  loadImages()
  loadList()
})
</script>

<template>
  <main class="mx-auto max-w-4xl space-y-6 p-6">
    <h1 class="text-3xl font-bold">Basic</h1>
    <p class="text-gray-500">Nuxt 4 全栈基座能力演示（对标 social-start 的 Next.js 版）。</p>

    <!-- 1. 图形验证码 -->
    <section class="rounded-lg border border-gray-200 p-4">
      <h2 class="mb-3 text-lg font-semibold">图形验证码</h2>
      <div class="flex items-center gap-3">
        <img v-if="captcha" :src="captcha.image" alt="captcha" class="h-10 rounded border" />
        <button class="rounded bg-gray-100 px-3 py-1.5 text-sm hover:bg-gray-200" @click="loadCaptcha">
          换一张
        </button>
        <input
          v-model="captchaInput"
          placeholder="输入"
          class="w-28 rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
        <button
          class="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          @click="verifyCaptcha"
        >
          校验
        </button>
        <span v-if="captchaMsg" class="text-sm">{{ captchaMsg }}</span>
      </div>
    </section>

    <!-- 2. 树形 -->
    <section class="rounded-lg border border-gray-200 p-4">
      <h2 class="mb-3 text-lg font-semibold">树形（集合：{{ treeName }}）</h2>
      <div class="mb-3 flex items-center gap-2">
        <input
          v-model="title"
          placeholder="标题"
          class="w-40 rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
        <input
          v-model="parentId"
          placeholder="parentId"
          class="w-24 rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
        <button
          class="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          @click="addNode"
        >
          新增
        </button>
        <button class="rounded bg-gray-100 px-3 py-1.5 text-sm hover:bg-gray-200" @click="loadTree">
          刷新树
        </button>
      </div>
      <TreeNode v-if="tree.length" :nodes="tree" />
      <p v-else class="text-sm text-gray-400">暂无节点，先新增一个（parentId=0 为根）。</p>
    </section>

    <!-- 3. 图片上传 -->
    <section class="rounded-lg border border-gray-200 p-4">
      <h2 class="mb-3 text-lg font-semibold">图片上传</h2>
      <input type="file" accept="image/*" class="mb-3 block text-sm" @change="onUpload" />
      <div class="flex flex-wrap gap-3">
        <img
          v-for="img in images"
          :key="img.name"
          :src="img.url"
          :alt="img.name"
          class="h-24 w-24 rounded border object-cover"
        />
      </div>
      <p v-if="!images.length" class="text-sm text-gray-400">还没有上传的图片。</p>
    </section>

    <!-- 4. 通用 CRUD 列表 -->
    <section class="rounded-lg border border-gray-200 p-4">
      <h2 class="mb-3 text-lg font-semibold">通用 CRUD 列表（集合：{{ listName }}）</h2>
      <div class="mb-3 flex items-center gap-2">
        <input
          v-model="keyword"
          placeholder="关键字搜索"
          class="w-40 rounded border border-gray-300 px-2 py-1.5 text-sm"
          @keyup.enter="loadList"
        />
        <button class="rounded bg-gray-100 px-3 py-1.5 text-sm hover:bg-gray-200" @click="loadList">
          搜索
        </button>
      </div>
      <table class="w-full text-left text-sm">
        <thead class="text-gray-500">
          <tr>
            <th class="py-1">id</th>
            <th class="py-1">title</th>
            <th class="py-1">status</th>
            <th class="py-1">updatedAt</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="it in items" :key="it.id" class="border-t border-gray-100">
            <td class="py-1">{{ it.id }}</td>
            <td class="py-1">{{ it.title }}</td>
            <td class="py-1">{{ it.status }}</td>
            <td class="py-1 text-gray-400">{{ it.updatedAt }}</td>
          </tr>
        </tbody>
      </table>
      <div class="mt-3 flex items-center gap-2 text-sm">
        <button class="rounded bg-gray-100 px-2 py-1 hover:bg-gray-200" :disabled="page <= 1" @click="page--; loadList()">
          上一页
        </button>
        <span class="text-gray-500">第 {{ page }} / {{ totalPages }} 页（共 {{ total }} 条）</span>
        <button class="rounded bg-gray-100 px-2 py-1 hover:bg-gray-200" :disabled="page >= totalPages" @click="page++; loadList()">
          下一页
        </button>
      </div>
    </section>
  </main>
</template>
