<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（动画组合 · 滚动揭示篇）· 原生 IntersectionObserver
// · Vue2：无内置，常用 AOS / vue-observe-visibility 等第三方库；
// · Vue3：原生 IntersectionObserver + onMounted 监听，配合响应式标记 + Tailwind 过渡类；
// · React 对照：原生 IntersectionObserver + useEffect，或 react-intersection-observer 库。
// 📌 实战定位：滚动入场动画【了解即可·进阶】；比 AOS 更可控（阈值/once 自己定）。
// 🧭 学习模式：🔧固定写法=onMounted 里 new IntersectionObserver(...)+observe；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { onMounted, onBeforeUnmount, reactive, ref } from 'vue'

const blocks = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  title: `区块 ${i + 1}`,
  desc: '滚动到这里才入场，离开不会回退（once）。',
  c: ['from-sky-500 to-cyan-400', 'from-violet-500 to-fuchsia-400', 'from-amber-500 to-orange-400'][i % 3],
}))

const visible = reactive<Record<number, boolean>>({})
const root = ref<HTMLElement>()

let io: IntersectionObserver | null = null
onMounted(() => {
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const id = Number((e.target as HTMLElement).dataset.id)
        if (e.isIntersecting) {
          visible[id] = true
          io?.unobserve(e.target) // once：只播一次
        }
      })
    },
    { threshold: 0.25 },
  )
  root.value?.querySelectorAll('[data-id]').forEach((el) => io!.observe(el))
})
onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <main ref="root" class="min-h-screen bg-zinc-950 px-6 py-16 text-white">
    <div class="mx-auto max-w-2xl">
      <h1 class="mb-4 text-center text-3xl font-black">滚动揭示 · IntersectionObserver</h1>

      <!-- 页首三段式：这是什么 / 为什么 / 怎么用 -->
      <section class="mb-10 space-y-2 rounded-xl bg-white/5 p-5 text-sm leading-relaxed">
        <p><b>① 这是什么：</b>滚动揭示 = 元素进入视口时才播放入场动画（上移+淡入），常用于长页面分区。</p>
        <p><b>② 为什么用原生：</b>不引 AOS 等库，用浏览器原生 <code>IntersectionObserver</code> 监听「是否进入视口」，触发时机、阈值、只播一次（once）全部自己控制，更轻更可控。</p>
        <p><b>③ 怎么用：</b><code>onMounted</code> 里 <code>new IntersectionObserver</code> 给每个区块 <code>observe</code>，回调里翻响应式 <code>visible[id]</code> 标记，模板用 <code>:class</code> 切 Tailwind 过渡类；<code>onBeforeUnmount</code> 里 <code>disconnect</code>。</p>
      </section>

      <div class="space-y-6">
        <div
          v-for="b in blocks"
          :key="b.id"
          :data-id="b.id"
          class="rounded-2xl bg-gradient-to-br p-8 transition-all duration-700 ease-out"
          :class="[
            b.c,
            visible[b.id]
              ? 'translate-y-0 opacity-100'
              : 'translate-y-12 opacity-0',
          ]"
        >
          <h3 class="text-2xl font-bold">{{ b.title }}</h3>
          <p class="mt-2 text-white/85">{{ b.desc }}</p>
        </div>
      </div>

      <details class="mt-10 rounded border border-white/15 p-3 text-sm">
        <summary class="cursor-pointer font-semibold">📚 Vue2 / Vue3 / React 三向对照 & 本项目小结</summary>
        <table class="mt-2 w-full border-collapse text-left text-white/90">
          <thead>
            <tr class="border-b border-white/15">
              <th class="px-2 py-1">维度</th>
              <th class="px-2 py-1">Vue2</th>
              <th class="px-2 py-1">Vue3</th>
              <th class="px-2 py-1">React</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-white/10"><td class="px-2 py-1">监听</td><td class="px-2 py-1">AOS / vue-observe-visibility</td><td class="px-2 py-1">原生 IntersectionObserver</td><td class="px-2 py-1">原生 IO / react-intersection-observer</td></tr>
            <tr class="border-b border-white/10"><td class="px-2 py-1">挂载时机</td><td class="px-2 py-1">mounted 钩子</td><td class="px-2 py-1">onMounted</td><td class="px-2 py-1">useEffect</td></tr>
            <tr class="border-b border-white/10"><td class="px-2 py-1">动画</td><td class="px-2 py-1">CSS class 切换</td><td class="px-2 py-1">:class + Tailwind 过渡</td><td class="px-2 py-1">className / framer-motion</td></tr>
            <tr class="border-b border-white/10"><td class="px-2 py-1">收尾</td><td class="px-2 py-1">手动销毁</td><td class="px-2 py-1">onBeforeUnmount disconnect</td><td class="px-2 py-1">useEffect cleanup</td></tr>
          </tbody>
        </table>
        <p class="mt-2 text-white/60">📝 小结：三框架本质都是「IO 监听进入视口 → 翻标记 → CSS 过渡」。Vue3 用 onMounted 注册、onBeforeUnmount 断开，天然契合组合式生命周期。</p>
      </details>
    </div>
  </main>
</template>
