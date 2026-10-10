import { ref } from 'vue'

// 示例组合式函数（被 pages/vue-test.vue 与 useCounter.spec.ts 共用）
export function useCounter(start = 0) {
  const count = ref(start)
  const inc = () => count.value++
  return { count, inc }
}
