<script setup lang="ts">
// 【动画组合 · 路由级过渡（Vue Router + <Transition>）】
// 页面切换时的过渡，本质是给 <RouterView> 外层包一个 <Transition>：
//   <RouterView v-slot="{ Component }">
//     <Transition mode="out-in" name="slide"><component :is="Component" /></Transition>
//   </RouterView>
// 下面用 <component :is> 模拟「视图切换」，机制与真实路由完全一致；底端给出可直接抄的路由写法。
import { ref, markRaw, h } from 'vue'

const views: Record<string, { title: string; body: string; c: string }> = {
  home: { title: '首页', body: '欢迎来到首页，这里是概览内容。', c: 'bg-indigo-600' },
  about: { title: '关于', body: '这一段在「关于」视图，切换时滑入。', c: 'bg-emerald-600' },
  contact: { title: '联系', body: '这是「联系」视图，带不同的进入方向。', c: 'bg-rose-600' },
}
const current = ref<keyof typeof views>('home')

// 用 markRaw 包装一个渲染函数式「视图组件」，避免被 Vue 响应式代理
const viewComp = ref(
  markRaw({
    render: () => h('div', { class: `${views[current.value].c} rounded-2xl p-10 text-white` }, [
      h('h2', { class: 'text-3xl font-black' }, views[current.value].title),
      h('p', { class: 'mt-3 text-white/85' }, views[current.value].body),
    ]),
  }),
)
function go(k: keyof typeof views) {
  current.value = k
  viewComp.value = markRaw({
    render: () => h('div', { class: `${views[k].c} rounded-2xl p-10 text-white` }, [
      h('h2', { class: 'text-3xl font-black' }, views[k].title),
      h('p', { class: 'mt-3 text-white/85' }, views[k].body),
    ]),
  })
}
</script>

<template>
  <main class="min-h-screen bg-zinc-950 px-6 py-12 text-white">
    <div class="mx-auto max-w-3xl">
      <h1 class="mb-6 text-3xl font-black">路由级过渡（Route Transition）</h1>

      <nav class="mb-6 flex gap-2">
        <button
          v-for="k in Object.keys(views)"
          :key="k"
          class="rounded-lg px-4 py-2 text-sm font-medium transition"
          :class="current === k ? 'bg-white text-zinc-900' : 'bg-white/10 hover:bg-white/20'"
          @click="go(k as keyof typeof views)"
        >
          {{ views[k as keyof typeof views].title }}
        </button>
      </nav>

      <!-- 真实项目里把下面这个 <component> 换成 <RouterView v-slot> 里的 <component :is="Component"> 即可 -->
      <Transition mode="out-in" name="slide">
        <component :is="viewComp" :key="current" />
      </Transition>

      <pre class="mt-8 overflow-x-auto rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-white/70">// app.vue 或布局里这样写，即为「整站路由切换」加过渡
&lt;RouterView v-slot="{ Component }"&gt;
  &lt;Transition mode="out-in" name="slide"&gt;
    &lt;component :is="Component" /&gt;
  &lt;/Transition&gt;
&lt;/RouterView&gt;</pre>
    </div>
  </main>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: translateX(48px);
}
.slide-leave-to {
  opacity: 0;
  transform: translateX(-48px);
}
</style>
