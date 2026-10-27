<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（模板控制流篇）· 条件渲染 v-if / v-show
// · Vue2 与 Vue3：v-if / v-else-if / v-else 语法完全一致；v-show 也一致；
// · React 对照：三元表达式 {cond ? <A/> : <B/>} 或 && 短路，没有内置"切换"指令。
// 📌 实战定位：条件渲染【基础必学】；登录态/权限/加载-错误-空态三态切换全靠它。
// 🧭 学习模式：🔧固定写法=v-if/v-else-if/v-else 必须紧贴、v-show 用 display 隐藏；👉=练习点（已填）；文末 <details> 有三向对照。
// ───────────────────────────────────────────────────────────
import { ref } from 'vue'

const loggedIn = ref(false)
const role = ref<'admin' | 'user'>('user')
const showByVShow = ref(true)
const tab = ref<'a' | 'b'>('a')
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-5 p-6">
    <h1 class="text-2xl font-bold">条件渲染 v-if / v-show · pages/vue-conditional.vue</h1>

    <!-- ① v-if / v-else-if / v-else 必须紧贴 -->
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">① v-if / v-else-if / v-else（紧贴书写）</h2>
      <button class="rounded bg-blue-600 px-3 py-1 text-white" @click="loggedIn = !loggedIn">
        切换登录态（当前：{{ loggedIn ? '已登录' : '未登录' }}）
      </button>
      <button class="rounded border px-3 py-1" @click="role = role === 'admin' ? 'user' : 'admin'">
        切换角色（当前：{{ role }}）
      </button>
      <div class="rounded border p-3 text-sm">
        <!-- 👉 练习落地：把 role 也接进登录块，组合条件 loggedIn && role==='admin' -->
        <template v-if="loggedIn">
          <p>欢迎回来，{{ role === 'admin' ? '管理员' : '普通用户' }}。</p>
          <p v-if="role === 'admin'" class="mt-1 text-indigo-600">🔧 管理员入口（已接 role 判断显示）</p>
        </template>
        <p v-else>请先登录。</p>
      </div>
      <!-- 多分支 -->
      <div class="rounded border p-3 text-sm">
        <p v-if="role === 'admin'">🔧 管理员面板入口</p>
        <p v-else-if="role === 'user'">普通用户视图</p>
        <p v-else>未知角色</p>
      </div>
    </section>

    <!-- ② v-if（销毁/重建）vs v-show（display:none） -->
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">② v-if vs v-show（关键差异）</h2>
      <button class="rounded bg-blue-600 px-3 py-1 text-white" @click="showByVShow = !showByVShow">
        切换 v-show（{{ showByVShow ? '显示' : '隐藏' }}）
      </button>
      <p class="text-xs text-gray-500">
        打开浏览器元素审查：<code>v-if</code> 隐藏时 DOM 节点<strong>直接移除</strong>；
        <code>v-show</code> 隐藏时只是加了 <code>display:none</code>，节点还在。
      </p>
      <p v-show="showByVShow" class="rounded border p-2 text-sm">我用 v-show 控制（节点常驻、仅切 display）。</p>
    </section>

    <!-- ③ tab 切换：v-if 需要 key 时的陷阱 -->
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">③ 同位置切换不同元素 → 用 key 避免复用</h2>
      <div class="flex gap-2">
        <button class="rounded border px-3 py-1" :class="tab === 'a' && 'bg-blue-600 text-white'" @click="tab = 'a'">Tab A</button>
        <button class="rounded border px-3 py-1" :class="tab === 'b' && 'bg-blue-600 text-white'" @click="tab = 'b'">Tab B</button>
      </div>
      <!-- 两个 input 同位置，不加 key 会被 Vue 复用（切换后输入内容残留） -->
      <input v-if="tab === 'a'" key="a" class="rounded border px-2 py-1" placeholder="Tab A 的输入框" />
      <input v-else key="b" class="rounded border px-2 py-1" placeholder="Tab B 的输入框" />
    </section>

    <details class="mt-6 rounded border p-3 text-sm">
      <summary class="cursor-pointer font-semibold">📚 Vue2 / Vue3 / React 三向对照 & 本项目小结</summary>
      <table class="mt-2 w-full border-collapse text-left">
        <thead>
          <tr class="border-b">
            <th class="px-2 py-1">维度</th>
            <th class="px-2 py-1">Vue2 / Vue3</th>
            <th class="px-2 py-1">React</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b"><td class="px-2 py-1">单条件</td><td class="px-2 py-1">v-if="cond"</td><td class="px-2 py-1">{cond && &lt;A/&gt;}</td></tr>
          <tr class="border-b"><td class="px-2 py-1">二选一</td><td class="px-2 py-1">v-if / v-else</td><td class="px-2 py-1">{cond ? &lt;A/&gt; : &lt;B/&gt;}</td></tr>
          <tr class="border-b"><td class="px-2 py-1">频繁显隐</td><td class="px-2 py-1">v-show（留节点）</td><td class="px-2 py-1">控制 className display</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：切换频率高、节点重（如弹层）用 <code>v-show</code>；一次性条件、涉及数据重建用 <code>v-if</code>。同位置切换不同元素记得加 <code>:key</code> 防复用。</p>
    </details>
  </main>
</template>
