<script setup lang="ts">
// 【动画组合 · 滚动揭示（原生 IntersectionObserver）】
// 不引第三方库：用浏览器原生 IntersectionObserver 监听元素是否进入视口，
// 进入时翻动 Vue 响应式标记，配合 Tailwind 过渡类做入场动画。
// 比 AOS 更可控：触发时机、阈值、只播一次都自己说了算。
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
      <h1 class="mb-12 text-center text-3xl font-black">滚动揭示 · IntersectionObserver</h1>

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
    </div>
  </main>
</template>
