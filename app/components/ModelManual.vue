<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 子组件：手写 props + emit 实现「等价于 v-model」的效果
// 📌 v-model 的本质 = props（父→子）+ emit（子→父）两者的语法糖。
//    父组件写 v-model="x"，Vue 会展开成：
//      :modelValue="x"  +  @update:modelValue="x = $event"
//    所以子组件只要 ① 声明 modelValue prop ② emit('update:modelValue', v) 即可。
// ↔ React：同一件事要写 value={x} onChange={e=>setX(e.target.value)}，没有语法糖。
// ───────────────────────────────────────────────────────────

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

// 🔧 固定写法：读 prop、抛事件，就是 v-model 的全部秘密
function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <input
    :value="props.modelValue"
    class="w-full rounded border px-2 py-1"
    placeholder="手写 props+emit 等价版"
    @input="onInput"
  >
</template>
