<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（DOM 访问篇）· 模板引用 ref + nextTick
// · Vue2：this.$refs.input 拿到 DOM；
// · Vue3：const input = ref(null) + <input ref="input">，在 onMounted / 事件里用 input.value；Vue3.5+ 也可用 useTemplateRef('input')；
// · React 对照：const r = useRef(null) + <input ref={r}>；访问在 useEffect 里（≈ onMounted）。
// 📌 实战定位：模板引用【基础必学】；自动聚焦、读 DOM 尺寸/媒体信息、v-for 取列表 ref、挂载第三方 DOM 库（ECharts/地图）。
// 🧭 学习模式：🔧固定写法=const x = ref<HTMLInputElement>(); <input ref="x">；👉=练习点（已填）；文末 <details> 有三向对照。
// ───────────────────────────────────────────────────────────
import { ref, nextTick, onMounted } from 'vue'

// 🔧 固定写法：ref 初始值为 null（模板 ref 在挂载后才赋值）
const inputRef = ref<HTMLInputElement | null>(null)
const boxRef = ref<HTMLElement | null>(null)
const log = ref('还没点按钮')

// nextTick：DOM 更新（重渲染）完成后才执行回调
async function measure() {
  // 先改文本，再等 DOM 刷新，最后量宽高 —— 否则拿到的是旧值
  if (boxRef.value) boxRef.value.textContent = '已更新：请重新测量我'
  await nextTick()
  if (boxRef.value) log.value = `框宽 ${Math.round(boxRef.value.offsetWidth)}px，高 ${Math.round(boxRef.value.offsetHeight)}px`
}

// 自动聚焦：组件挂载后立刻聚焦输入框（典型场景：搜索框、弹窗第一输入项）
onMounted(() => {
  inputRef.value?.focus()
})
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-5 p-6">
    <h1 class="text-2xl font-bold">模板引用 ref + nextTick · pages/vue-template-ref.vue</h1>

    <!-- ① 模板引用：拿到真实 DOM 并自动聚焦 -->
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">① ref 拿 DOM（自动聚焦）</h2>
      <input ref="inputRef" class="rounded border px-2 py-1" placeholder="组件挂载后会自动聚焦到这里" />
      <p class="text-xs text-gray-500">打开页面时光标应已在此输入框（onMounted 里 inputRef.value.focus()）。</p>
    </section>

    <!-- ② nextTick：等 DOM 更新再读 -->
    <section class="space-y-2">
      <h2 class="text-lg font-semibold">② nextTick（DOM 刷新后再测量）</h2>
      <div ref="boxRef" class="rounded border p-3 text-sm">初始：点下面按钮测我宽高</div>
      <button class="rounded bg-blue-600 px-3 py-1 text-white" @click="measure">改文本并测量</button>
      <p class="text-xs text-gray-600">{{ log }}</p>
    </section>

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
          <tr class="border-b"><td class="px-2 py-1">声明</td><td class="px-2 py-1">this.$refs.x</td><td class="px-2 py-1">const x = ref(null); ref="x"</td><td class="px-2 py-1">useRef(null); ref={x}</td></tr>
          <tr class="border-b"><td class="px-2 py-1">取用时机</td><td class="px-2 py-1">mounted 后</td><td class="px-2 py-1">onMounted 后</td><td class="px-2 py-1">useEffect 内</td></tr>
          <tr class="border-b"><td class="px-2 py-1">等 DOM 刷新</td><td class="px-2 py-1">this.$nextTick</td><td class="px-2 py-1">await nextTick()</td><td class="px-2 py-1">无（依赖驱动）</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：模板 ref 让你"绕过响应式、直接碰 DOM"——只在必须时才用（聚焦、量尺寸、挂第三方库）。改数据后若要立刻读 DOM，记得包 nextTick。</p>
    </details>
  </main>
</template>
