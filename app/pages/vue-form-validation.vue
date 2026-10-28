<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 表单校验 + 动效（VeeValidate + Zod）
// ① 视角：从 React 转 Vue3（或纯 Vue3 起步）；Vue 生态用 VeeValidate 取代 React Hook Form。
// ② 实战定位：任何带输入框的后台表单都要校验，错误反馈+抖动动画是体验底线。
// ③ 学习模式：🔧 固定写法 = VeeValidate 管流程、Zod 管规则，toTypedSchema 桥接；
//          👉 练习点 = 把规则换成你自己的字段（手机号/用户名）。
// 📌 注意：VeeValidate 与 Zod 职责分离——前者绑定/提交流程，后者纯规则，互不直接耦合。
// 📌 延伸：Zod 已从纯前端校验走向全栈——NestJS 等后端也用 zod 校验入参（详见文末「Zod 深入」）。
// ───────────────────────────────────────────────────────────
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { ref } from 'vue'

// ── Zod 规则（纯规则层，与框架无关）──
// 🔧 固定写法：z.object({ 字段: z.类型().约束().约束('报错信息') })，链式子 API 可读性强
// 📌 Zod 已全栈化：原本是前端/TS 校验库，如今 NestJS 等后端也用它校验入参（nestjs-zod 等），
//    前后端可共用同一套 schema；本页只演示「前端表单」这一种用法。
const zodSchema = z.object({
  email: z.string().min(1, '邮箱必填').email('邮箱格式不正确'),
  password: z.string().min(6, '密码至少 6 位').max(20, '密码最多 20 位'),
})
// 📌 杀手锏：z.infer 从 schema 反推 TS 类型——运行时校验和静态类型同一份来源，前端类型不必手写、也不锁后端
type FormValues = z.infer<typeof zodSchema>
// 🔧 固定写法：toTypedSchema 把 Zod schema 桥接成 VeeValidate 认识的 schema
const schema = toTypedSchema(zodSchema)

// 🔧 固定写法：useForm 接收 validationSchema，吐出 errors / defineField / handleSubmit / isSubmitting
const { handleSubmit, errors, defineField, isSubmitting } = useForm({ validationSchema: schema })
// 🔧 固定写法：defineField 拆出「字段 ref + attrs」，attrs 用 v-bind 自动接校验触发（失焦/输入）
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const submitted = ref<string | null>(null)
// 🔧 固定写法：handleSubmit 包一层回调——只有校验全过才进这里，values 已是 FormValues 推断类型
const onSubmit = handleSubmit((values) => {
  submitted.value = JSON.stringify(values, null, 2)
})
</script>

<template>
  <main class="min-h-screen bg-zinc-950 px-6 py-12 text-white">
    <div class="mx-auto max-w-md">
      <h1 class="mb-6 text-3xl font-black">表单校验 · VeeValidate + Zod</h1>

      <form class="space-y-5" @submit.prevent="onSubmit">
        <div>
          <label class="mb-1 block text-sm text-white/70">邮箱</label>
          <input
            v-model="email"
            v-bind="emailAttrs"
            type="email"
            placeholder="you@example.com"
            class="w-full rounded-lg border bg-white/5 px-3 py-2 outline-none transition focus:border-indigo-400"
            :class="[
              errors.email ? 'border-rose-500 animate-shake' : 'border-white/15',
            ]"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-rose-400">{{ errors.email }}</p>
        </div>

        <div>
          <label class="mb-1 block text-sm text-white/70">密码</label>
          <input
            v-model="password"
            v-bind="passwordAttrs"
            type="password"
            placeholder="至少 6 位"
            class="w-full rounded-lg border bg-white/5 px-3 py-2 outline-none transition focus:border-indigo-400"
            :class="[
              errors.password ? 'border-rose-500 animate-shake' : 'border-white/15',
            ]"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-rose-400">{{ errors.password }}</p>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full rounded-lg bg-indigo-500 py-2.5 font-semibold transition hover:bg-indigo-400 disabled:opacity-50"
        >
          提交
        </button>
      </form>

      <pre v-if="submitted" class="mt-6 overflow-x-auto rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">{{ submitted }}</pre>
    </div>
  <details class="mt-8 rounded border p-4 text-sm">
    <summary class="cursor-pointer font-semibold">Vue2 / Vue3 / React 三向对照 + 小结</summary>
    <table class="mt-2 w-full border-collapse text-left">
      <thead><tr class="border-b">
        <th class="px-2 py-1">维度</th><th class="px-2 py-1">Vue2 (Options)</th><th class="px-2 py-1">Vue3 (本页)</th><th class="px-2 py-1">React</th>
      </tr></thead>
      <tbody>
        <tr class="border-b"><td class="px-2 py-1">校验库</td><td class="px-2 py-1">vee-validate v2 (mapFields)</td><td class="px-2 py-1">vee-validate v4 (useForm)</td><td class="px-2 py-1">react-hook-form + zod</td></tr>
        <tr class="border-b"><td class="px-2 py-1">规则</td><td class="px-2 py-1">自行写</td><td class="px-2 py-1">Zod via toTypedSchema</td><td class="px-2 py-1">zodResolver</td></tr>
        <tr class="border-b"><td class="px-2 py-1">字段绑定</td><td class="px-2 py-1">v-model + errors</td><td class="px-2 py-1">defineField</td><td class="px-2 py-1">register</td></tr>
      </tbody>
    </table>
    <p class="mt-2 text-gray-400">📝 小结：Vue2 用 v2 的 mapFields，Vue3 用 useForm + defineField（组合式）；React 对应 react-hook-form。错误抖动用 CSS @keyframes（见本页 &lt;style scoped&gt;）。</p>
  </details>

  <details class="mt-4 rounded border p-4 text-sm">
    <summary class="cursor-pointer font-semibold">Zod 深入：为什么火 + 已全栈化</summary>
    <ul class="mt-2 list-disc space-y-1 pl-5 text-gray-300">
      <li><b>TS-first（类型即 schema）</b>：写一次 <code>z.object(...)</code>，用 <code>z.infer&lt;typeof schema&gt;</code> 反推出 TS 类型，运行时校验和静态类型同一份来源——前端类型不必手写、也不锁后端（见上 <code>FormValues</code>）。</li>
      <li><b>组合子 API</b>：<code>z.string().min(1).email()</code> 链式可读；常用 <code>z.number()</code> / <code>z.boolean()</code> / <code>z.enum()</code> / <code>z.array()</code> / <code>z.object()</code>，复杂规则用 <code>.refine()</code> 自定义。</li>
      <li><b>安全解析</b>：<code>schema.safeParse(data)</code> 返回 <code>{ success, data | error }</code> 而非抛异常，特别适合表单边界 / 接口入参校验。</li>
      <li><b>↔ 跨框架通用</b>：核心 zod 语法三端一致；React 用 <code>zodResolver</code>（react-hook-form），Vue 用 <code>@vee-validate/zod</code> 的 <code>toTypedSchema</code>，Angular 也有对应 adapter——学一次，哪都能用。</li>
      <li><b>已全栈化 🔥</b>：zod 原本是纯前端/TS 校验库，如今连 <b>NestJS</b> 这类后端框架都接 zod 校验入参（nestjs-zod 等社区方案，或直接用 zod 写 DTO Pipe），前后端共用同一套 schema，告别重复写 class-validator。一句话：学 zod = 一次学习，前后端通吃。</li>
    </ul>
  </details>
</main>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}
.animate-shake {
  animation: shake 0.4s ease;
}
</style>
