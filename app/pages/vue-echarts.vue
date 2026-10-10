<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（图表篇）· 原生 ECharts 接入 Vue3
// · Vue2：vue-echarts 封装，或 mounted 里 echarts.init(this.$refs.x)；
// · Vue3：onMounted 里 echarts.init(ref.value)，option 变 setOption，onUnmounted dispose；
// · React 对照：useRef + useEffect init（见 social-start 的 echarts）。
// 📌 实战定位：数据可视化【常规业务常用】；echarts 是国内主流。本分支已加 echarts 依赖。
// 🧭 学习模式：🔧固定写法=Chart 容器组件（init/setOption/resize/dispose）；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'

const el = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null
const option = {
  title: { text: 'Vue3 + ECharts' },
  tooltip: {},
  xAxis: { data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  yAxis: {},
  series: [{ type: 'bar', data: [5, 20, 36, 10, 15] }],
}
onMounted(() => {
  // 🔧 固定写法：init + setOption + 自适应 + 卸载 dispose
  if (el.value) {
    chart = echarts.init(el.value)
    chart.setOption(option)
    window.addEventListener('resize', () => chart?.resize())
  }
})
onUnmounted(() => {
  chart?.dispose()
  chart = null
})
// 👉 练习：把 series.type 改成 'line' 看折线图
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">ECharts 图表 · pages/vue-echarts.vue</h1>
    <div ref="el" class="h-64 w-full rounded border bg-white"></div>

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
          <tr class="border-b"><td class="px-2 py-1">接入</td><td class="px-2 py-1">mounted init</td><td class="px-2 py-1">onMounted init</td><td class="px-2 py-1">useEffect init</td></tr>
          <tr class="border-b"><td class="px-2 py-1">更新</td><td class="px-2 py-1">watch option</td><td class="px-2 py-1">chart.setOption</td><td class="px-2 py-1">setOption</td></tr>
          <tr class="border-b"><td class="px-2 py-1">销毁</td><td class="px-2 py-1">beforeDestroy</td><td class="px-2 py-1">onUnmounted dispose</td><td class="px-2 py-1">useEffect cleanup</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：原生 echarts 用 ref + onMounted 最稳，option 变化 setOption，卸载必须 dispose 防内存泄漏。</p>
    </details>
  </main>
</template>
