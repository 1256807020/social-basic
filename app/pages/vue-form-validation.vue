<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 表单校验 + 动效（VeeValidate + Zod）
// ① 视角：从 React 转 Vue3（或纯 Vue3 起步）；Vue 生态用 VeeValidate 取代 React Hook Form。
// ② 实战定位：任何带输入框的后台表单都要校验，错误反馈+抖动动画是体验底线。
// ③ 学习模式：🔧 固定写法 = VeeValidate 管流程、Zod 管规则，toTypedSchema 桥接；
//          👉 练习点 = 把规则换成你自己的字段（手机号/用户名）。
// 📌 注意：VeeValidate 与 Zod 职责分离——前者绑定/提交流程，后者纯规则，互不直接耦合。
// ───────────────────────────────────────────────────────────
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { ref } from 'vue'

const schema = toTypedSchema(
  z.object({
    email: z.string().min(1, '邮箱必填').email('邮箱格式不正确'),
    password: z.string().min(6, '密码至少 6 位').max(20, '密码最多 20 位'),
  }),
)

const { handleSubmit, errors, defineField, isSubmitting } = useForm({ validationSchema: schema })
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const submitted = ref<string | null>(null)
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
