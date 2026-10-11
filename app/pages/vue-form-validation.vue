<script setup lang="ts">
// 【Vue3 能力 · 表单校验 + 动效（VeeValidate + Zod）】
// VeeValidate 管「校验流程/绑定」，Zod 管「校验规则」，
// 二者用 @vee-validate/zod 的 toTypedSchema 桥接。错误时给输入框加抖动动画。
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
