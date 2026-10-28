<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { ref } from 'vue'

// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（国际化篇）· vue-i18n
// · Vue2：vue-i18n v8，模板用 $t()；
// · Vue3：vue-i18n v9（composition），useI18n() 拿 t / locale，本例由 app/plugins/i18n.ts 注入；
// · React 对照：react-i18next / next-intl（见 social-start）。
// 📌 实战定位：多语言【常规业务常用】；后台/官网切语言必备。
// 🧭 学习模式：🔧固定写法=useI18n() → t() / locale.value=；👉=练习点（已填）；文末 <details> 有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
// 🔧 固定写法：useI18n 来自插件注入的 i18n 实例
const { t, locale } = useI18n()
function toggle() {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
}
// 👉 练习：带参数的文案 t('helloName', { name }) —— messages 里用 {name} 占位
const name = ref('World')
</script>

<template>
  <main class="mx-auto max-w-2xl space-y-4 p-6">
    <h1 class="text-2xl font-bold">多语言 vue-i18n · pages/vue-i18n.vue</h1>

    <section class="rounded-2xl bg-white p-5 shadow dark:bg-zinc-900">
      <h2 class="font-bold">① 基础文案 + 切语言</h2>
      <p class="mt-1 text-sm opacity-70">当前语言：{{ locale }}</p>
      <p class="mt-1 text-sm opacity-70">{{ t('hello') }}</p>
      <button class="mt-3 rounded bg-blue-600 px-3 py-1 text-white" @click="toggle">
        切到 {{ locale === 'zh' ? 'English' : '中文' }}
      </button>
    </section>

    <section class="rounded-2xl bg-white p-5 shadow dark:bg-zinc-900">
      <h2 class="font-bold">② 👉 参数化文案 t('helloName', { name })</h2>
      <input
        v-model="name"
        class="mt-1 w-full rounded border px-2 py-1 text-sm dark:bg-zinc-800"
        placeholder="输入名字"
      />
      <p class="mt-2 text-sm opacity-70">{{ t('helloName', { name: name }) }}</p>
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
          <tr class="border-b"><td class="px-2 py-1">取文案</td><td class="px-2 py-1">$t()</td><td class="px-2 py-1">useI18n().t</td><td class="px-2 py-1">useTranslation().t</td></tr>
          <tr class="border-b"><td class="px-2 py-1">切语言</td><td class="px-2 py-1">$i18n.locale=</td><td class="px-2 py-1">locale.value=</td><td class="px-2 py-1">i18n.changeLanguage</td></tr>
          <tr class="border-b"><td class="px-2 py-1">配置</td><td class="px-2 py-1">对象 messages</td><td class="px-2 py-1">对象 messages</td><td class="px-2 py-1">resources</td></tr>
        </tbody>
      </table>
      <p class="mt-2 text-gray-500">📝 小结：vue-i18n v9 用 useI18n() 拿 t/locale；本分支用 app/plugins/i18n.ts 创建实例并 app.use，页面直接 useI18n 即可。</p>
    </details>
  </main>
</template>
