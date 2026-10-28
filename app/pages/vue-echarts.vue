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
import type { EChartsOption } from 'echarts'

const el = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

// 🔧 固定写法：数据/类型用 ref 驱动，统一 buildOption 出配置，render 调 setOption
const chartType = ref<'bar' | 'line' | 'pie'>('bar')
const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const data = ref<number[]>([5, 20, 36, 10, 15])

function buildOption(): EChartsOption {
  if (chartType.value === 'pie') {
    return {
      title: { text: 'Vue3 + ECharts' },
      tooltip: {},
      series: [
        { type: 'pie', radius: '50%', data: labels.map((n, i) => ({ name: n, value: data.value[i] })) },
      ],
    }
  }
  return {
    title: { text: 'Vue3 + ECharts' },
    tooltip: {},
    xAxis: { data: labels },
    yAxis: {},
    series: [{ type: chartType.value, data: data.value }],
  }
}
function render() {
  // notMerge=true：bar/line/pie 结构不同，切换时整份替换更干净
  chart?.setOption(buildOption(), true)
}
function switchType(t: 'bar' | 'line' | 'pie') {
  chartType.value = t
  render()
}
function refresh() {
  data.value = data.value.map(() => Math.floor(Math.random() * 50))
  render()
}
function onResize() {
  chart?.resize()
}
onMounted(() => {
  // 🔧 固定写法：init + setOption + 窗口自适应 + 卸载 dispose
  if (el.value) {
    chart = echarts.init(el.value)
    chart.setOption(buildOption())
    window.addEventListener('resize', onResize)
  }
})
onUnmounted(() => {
  // 🔧 固定写法：必须 dispose，否则切走页面图表实例残留导致内存泄漏
  window.removeEventListener('resize', onResize)
  chart?.dispose()
  chart = null
})
// 👉 练习：把 series.type 改成 'line' 看折线图（本例已做成「柱状/折线/饼图」切换按钮，直接点）
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">ECharts 图表 · pages/vue-echarts.vue</h1>

    <section class="rounded-2xl bg-white p-5 shadow dark:bg-zinc-900">
      <h2 class="font-bold">① 类型切换 + 数据刷新</h2>
      <p class="mt-1 text-xs opacity-70">点按钮切 bar/line/pie，或刷新随机数据，观察 setOption 更新与生命周期。</p>
      <div class="mt-3 flex flex-wrap gap-2">
        <button class="rounded bg-blue-600 px-3 py-1 text-sm text-white" @click="switchType('bar')">柱状</button>
        <button class="rounded bg-blue-600 px-3 py-1 text-sm text-white" @click="switchType('line')">折线</button>
        <button class="rounded bg-blue-600 px-3 py-1 text-sm text-white" @click="switchType('pie')">饼图</button>
        <button class="rounded bg-zinc-500 px-3 py-1 text-sm text-white" @click="refresh">刷新数据</button>
      </div>
      <div ref="el" class="mt-3 h-64 w-full rounded border"></div>
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
          <tr class="border-b"><td class="px-2 py-1">接入</td><td class="px-2 py-1">mounted init</td><td class="px-2 py-1">onMounted init</td><td class="px-2 py-1">useEffect init</td></tr>
          <tr class="border-b"><td class="px-2 py-1">更新</td><td class="px-2 py-1">watch option</td><td class="px-2 py-1">chart.setOption</td><td class="px-2 py-1">setOption</td></tr>
          <tr class="border-b"><td class="px-2 py-1">销毁</td><td class="px-2 py-1">beforeDestroy</td><td class="px-2 py-1">onUnmounted dispose</td><td class="px-2 py-1">useEffect cleanup</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：原生 echarts 用 ref + onMounted 最稳，option 变化 setOption（notMerge=true 切换结构），卸载必须 dispose 防内存泄漏，容器 resize 要 resize 图表。</p>
    </details>
  </main>
</template>
