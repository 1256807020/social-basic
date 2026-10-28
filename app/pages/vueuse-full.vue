<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// VueUse 高频 composables 合集（@vueuse/core）
// ① 视角：从 React 转 Vue3（或纯 Vue3 起步）；VueUse ≈ React 的 ahooks 角色。
// ② 实战定位：暗色/持久化/鼠标/请求/复制/防抖/节流等高频副作用，用组合式函数一行接入。
// ③ 学习模式：🔧 固定写法 = 从 @vueuse/core 取 useXxx，直接得到响应式 ref；
//          👉 练习点 = 把 useThrottleFn 打的接口换成 /api/collections，或自建 data/<r>.json 走全套 CRUD。
// 📌 注意：VueUse 与 React 的 ahooks 一一对应（useDark↔useDark、useDebounceFn↔useDebounceFn），
//    只是 Vue 端返回 ref、React 端返回 [value, fn] 元组。
// ───────────────────────────────────────────────────────────
import {
  useClipboard,
  useDark,
  useDebounceFn,
  useFetch,
  useMouse,
  useStorage,
  useThrottleFn,
} from "@vueuse/core";
import { computed, ref } from "vue";
import type { ApiResult, HealthData } from "~/types/api";

// 暗色模式（自动持久化到 localStorage，并切换 <html class="dark">）
const isDark = useDark();

// 计数器（持久化，刷新不丢）
const count = useStorage("vu-demo-count", 0);

// 鼠标坐标
const { x, y } = useMouse();

// 网络请求（SSR 安全，调用我们自己的接口 /api/health，返回统一信封 ApiResult<HealthData>）
const { data, error } = useFetch<ApiResult<HealthData>>("/api/health").json();

// 剪贴板
const source = ref("https://vueuse.org");
const { copy, copied } = useClipboard({ source });

// 防抖输入（防抖输入框的理解完全正确：停手 400ms 才生效，适合搜索联想/避免每次按键打接口）
// 节流按钮防重复点击：见下方 useThrottleFn，首点立即触发、窗口内连点被吞
const raw = ref("");
const debounced = ref("");
const onInput = useDebounceFn((v: string) => (debounced.value = v), 400);

// 输入框原生事件（类型安全：Event → HTMLInputElement，避免 any 关掉类型检查）
function onRawInput(e: Event) {
  const el = e.target as HTMLInputElement;
  raw.value = el.value;
  onInput(el.value);
}

// 节流：防重复点击（首点立即触发，1.2s 窗口内连点被吞），每次点击都请求我们自己的 /api/health
// 防抖输入框，节流按钮防重复点击
const clicked = ref(0);
const fired = ref(0);
const lastPing = ref<HealthData | null>(null);
const ping = useThrottleFn(
  async () => {
    fired.value++;
    const res = await $fetch<ApiResult<HealthData>>("/api/health");
    lastPing.value = res.data;
  },
  1200,
  false,
  true
);
const onPingClick = () => {
  clicked.value++;
  ping();
};

// 取信封里的 data 负载（禁 any：ApiResult<HealthData> 已锁类型，error 时回退 null）
const health = computed<HealthData | null>(() =>
  error.value ? null : data.value?.data ?? null
);
</script>

<template>
  <main
    class="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-zinc-950 dark:text-white"
  >
    <div class="mx-auto max-w-3xl space-y-4">
      <h1 class="text-3xl font-black">VueUse 常用 composables</h1>

      <div class="grid gap-4 sm:grid-cols-2">
        <section class="rounded-2xl bg-white p-5 shadow dark:bg-zinc-900">
          <h2 class="font-bold">useDark</h2>
          <p class="mt-1 text-sm opacity-70">
            当前：{{ isDark ? "🌙 暗色" : "☀️ 亮色" }}（已写入 html.dark）
          </p>
          <button
            class="mt-3 rounded bg-zinc-900 px-3 py-1.5 text-sm text-white dark:bg-white dark:text-zinc-900"
            @click="isDark = !isDark"
          >
            切换
          </button>
        </section>

        <section class="rounded-2xl bg-white p-5 shadow dark:bg-zinc-900">
          <h2 class="font-bold">useStorage</h2>
          <p class="mt-1 text-sm opacity-70">
            计数：{{ count }}（刷新页面仍在）
          </p>
          <button
            class="mt-3 rounded bg-indigo-500 px-3 py-1.5 text-sm text-white"
            @click="count++"
          >
            +1
          </button>
        </section>

        <section class="rounded-2xl bg-white p-5 shadow dark:bg-zinc-900">
          <h2 class="font-bold">useMouse</h2>
          <p class="mt-1 font-mono text-sm opacity-70">
            x: {{ Math.round(x) }}, y: {{ Math.round(y) }}
          </p>
        </section>

        <section class="rounded-2xl bg-white p-5 shadow dark:bg-zinc-900">
          <h2 class="font-bold">useFetch（我们的接口 /api/health）</h2>
          <template v-if="health">
            <p class="mt-1 text-sm opacity-70">环境：{{ health.env }}</p>
            <p class="mt-1 text-sm opacity-70">
              运行时长：{{ health.uptime }}s
            </p>
            <p class="mt-1 text-sm opacity-70">
              集合数：{{ health.collections }}
            </p>
            <p class="mt-1 break-all font-mono text-xs opacity-70">
              数据目录：{{ health.dataDir }}
            </p>
          </template>
          <p v-else class="mt-1 text-sm opacity-70">请求失败 / 加载中…</p>
        </section>

        <section class="rounded-2xl bg-white p-5 shadow dark:bg-zinc-900">
          <h2 class="font-bold">useClipboard</h2>
          <p class="mt-1 break-all font-mono text-xs opacity-70">
            {{ source }}
          </p>
          <button
            class="mt-3 rounded bg-emerald-500 px-3 py-1.5 text-sm text-white"
            @click="copy(source)"
          >
            {{ copied ? "已复制 ✓" : "复制" }}
          </button>
        </section>

        <section class="rounded-2xl bg-white p-5 shadow dark:bg-zinc-900">
          <h2 class="font-bold">useDebounceFn</h2>
          <input
            class="mt-1 w-full rounded border px-2 py-1 text-sm dark:bg-zinc-800"
            placeholder="输入…400ms 后生效"
            :value="raw"
            @input="onRawInput"
          />
          <p class="mt-2 text-sm opacity-70">
            防抖结果：{{ debounced || "—" }}
          </p>
        </section>

        <section class="rounded-2xl bg-white p-5 shadow dark:bg-zinc-900">
          <h2 class="font-bold">useThrottleFn（防重复点击 + 调我们的接口）</h2>
          <p class="mt-1 text-xs opacity-70">
            节流 1.2s（首点立即触发，窗口内连点被吞），每次点击都请求
            /api/health
          </p>
          <button
            class="mt-3 rounded bg-rose-500 px-3 py-1.5 text-sm text-white"
            @click="onPingClick"
          >
            连点我
          </button>
          <p class="mt-2 text-sm opacity-70">
            点击次数：{{ clicked }} ｜ 实际请求：{{ fired }}
          </p>
          <p class="mt-1 text-sm opacity-70">
            最近 ping 运行时长：{{ lastPing ? lastPing.uptime + "s" : "—" }}
          </p>
        </section>
      </div>
    </div>
    <details class="mt-8 rounded border p-4 text-sm">
      <summary class="cursor-pointer font-semibold">
        Vue2 / Vue3 / React 三向对照 + 小结
      </summary>
      <table class="mt-2 w-full border-collapse text-left">
        <thead>
          <tr class="border-b">
            <th class="px-2 py-1">能力</th>
            <th class="px-2 py-1">Vue2</th>
            <th class="px-2 py-1">Vue3 (本页 VueUse)</th>
            <th class="px-2 py-1">React (ahooks)</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b">
            <td class="px-2 py-1">暗色</td>
            <td class="px-2 py-1">手写 toggleClass</td>
            <td class="px-2 py-1">useDark</td>
            <td class="px-2 py-1">useDark（ahooks 无，用 state）</td>
          </tr>
          <tr class="border-b">
            <td class="px-2 py-1">持久化</td>
            <td class="px-2 py-1">localStorage + watch</td>
            <td class="px-2 py-1">useStorage</td>
            <td class="px-2 py-1">useLocalStorageState</td>
          </tr>
          <tr class="border-b">
            <td class="px-2 py-1">请求</td>
            <td class="px-2 py-1">axios + watch</td>
            <td class="px-2 py-1">useFetch</td>
            <td class="px-2 py-1">useRequest / useFetch（ahooks）</td>
          </tr>
          <tr class="border-b">
            <td class="px-2 py-1">防抖</td>
            <td class="px-2 py-1">lodash.debounce</td>
            <td class="px-2 py-1">useDebounceFn</td>
            <td class="px-2 py-1">useDebounceFn</td>
          </tr>
          <tr class="border-b">
            <td class="px-2 py-1">节流</td>
            <td class="px-2 py-1">lodash.throttle</td>
            <td class="px-2 py-1">useThrottleFn</td>
            <td class="px-2 py-1">useThrottleFn</td>
          </tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-400">
        📝 小结：VueUse 是 Vue 版的 ahooks——高频副作用一行接入，返回 ref。React
        端多为 [value, fn] 元组，Vue 端直接 ref，心智略不同但能力对等。
      </p>
    </details>
  </main>
</template>
