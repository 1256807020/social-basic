<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 状态机（XState + @xstate/vue）
// ① 视角：从 React 转 Vue3（或纯 Vue3 起步）；XState 在两端用法几乎一致。
// ② 实战定位：复杂交互的「合法状态流转」（红绿灯/订单/向导步骤）用状态机比 if/else 稳。
// ③ 学习模式：🔧 固定写法 = createMachine 画状态图 + useMachine 接进响应式；
//          👉 练习点 = 把红绿灯换成「订单状态机」（待付款→已付款→已发货）。
// 📌 注意：非法跳转被 XState 直接忽略，不会抛错也不会进错状态——这是状态机最大的价值。
// ───────────────────────────────────────────────────────────
import { createMachine } from 'xstate'
import { useMachine } from '@xstate/vue'

const machine = createMachine({
  id: 'traffic',
  initial: 'red',
  states: {
    red: { on: { NEXT: 'green' }, meta: { label: '停止', c: 'bg-red-500', ring: 'shadow-red-500/50' } },
    green: { on: { NEXT: 'yellow' }, meta: { label: '通行', c: 'bg-green-500', ring: 'shadow-green-500/50' } },
    yellow: { on: { NEXT: 'red' }, meta: { label: '注意', c: 'bg-yellow-400', ring: 'shadow-yellow-400/50' } },
  },
})

const { state, send } = useMachine(machine)
// state.value 是 XState 的 State 对象，meta 通过 state.value.getMeta() 取
</script>

<template>
  <main class="min-h-screen bg-zinc-950 px-6 py-12 text-white">
    <div class="mx-auto max-w-md text-center">
      <h1 class="mb-8 text-3xl font-black">状态机 · XState 红绿灯</h1>

      <!-- 灯组 -->
      <div class="mx-auto mb-8 flex w-28 flex-col items-center gap-4 rounded-3xl bg-black/60 p-5">
        <div
          v-for="s in ['red', 'green', 'yellow']"
          :key="s"
          class="h-16 w-16 rounded-full transition-all duration-300"
          :class="[
            state.matches(s) ? (s === 'red' ? 'bg-red-500 shadow-[0_0_30px] shadow-red-500' : s === 'green' ? 'bg-green-500 shadow-[0_0_30px] shadow-green-500' : 'bg-yellow-400 shadow-[0_0_30px] shadow-yellow-400') : 'bg-white/10',
          ]"
        />
      </div>

      <p class="mb-4 text-lg">
        当前状态：<span class="font-bold text-indigo-300">{{ state.value }}</span>
      </p>

      <button
        class="rounded-lg bg-indigo-500 px-6 py-2.5 font-semibold transition hover:bg-indigo-400"
        @click="send({ type: 'NEXT' })"
      >
        切换 →
      </button>

      <p class="mt-8 rounded-xl border border-white/10 bg-white/5 p-4 text-left text-sm text-white/70">
        状态图里只允许 red→green→yellow→red，非法跳转会被 XState 直接忽略，
        比一堆 if/else 更不容易出 bug。把 NEXT 换成「定时器自动 send」即可变自动红绿灯。
      </p>
    </div>
  <details class="mt-8 rounded border p-4 text-sm">
    <summary class="cursor-pointer font-semibold">Vue2 / Vue3 / React 三向对照 + 小结</summary>
    <table class="mt-2 w-full border-collapse text-left">
      <thead><tr class="border-b">
        <th class="px-2 py-1">维度</th><th class="px-2 py-1">Vue2 (Options)</th><th class="px-2 py-1">Vue3 (本页)</th><th class="px-2 py-1">React</th>
      </tr></thead>
      <tbody>
        <tr class="border-b"><td class="px-2 py-1">状态机库</td><td class="px-2 py-1">xstate + @xstate/vue(老)</td><td class="px-2 py-1">xstate + @xstate/vue</td><td class="px-2 py-1">xstate + @xstate/react</td></tr>
        <tr class="border-b"><td class="px-2 py-1">接入响应式</td><td class="px-2 py-1">this.state / computed</td><td class="px-2 py-1">useMachine → state/send</td><td class="px-2 py-1">useMachine → state.send</td></tr>
        <tr class="border-b"><td class="px-2 py-1">读当前态</td><td class="px-2 py-1">this.current</td><td class="px-2 py-1">state.value / state.matches</td><td class="px-2 py-1">state.value / state.matches</td></tr>
      </tbody>
    </table>
    <p class="mt-2 text-gray-400">📝 小结：Vue2/Vue3/React 三端都用 XState 同一套状态图，只是接入钩子不同（@xstate/vue vs @xstate/react）。状态图定义一次，UI 层只看 state.matches 高亮。</p>
  </details>
</main>
</template>
