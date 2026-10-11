<script setup lang="ts">
// 【Vue3 能力 · 状态机（XState + @xstate/vue）】
// 复杂交互的「状态」用状态机描述最清晰：红→绿→黄→红，永远合法。
// XState 定义状态图，@xstate/vue 的 useMachine 把 state/send 接进 Vue 响应式。
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
  </main>
</template>
