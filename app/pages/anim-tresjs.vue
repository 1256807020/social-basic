<script setup lang="ts">
// 【动画组合 · TresJS】
// 用 Vue 组件写 Three.js：<TresCanvas> 内用 <TresMesh>/<TresBoxGeometry> 等声明 3D 场景，
// 而非命令式 new THREE.Mesh()。下面用 useRenderLoop 在每帧更新旋转，形成持续动画。
// 注意：WebGL 只能在浏览器跑，用 <ClientOnly> 包裹避免 SSR 报错。
import { TresCanvas, useRenderLoop } from '@tresjs/core'
import { ref } from 'vue'

const rot = ref(0)
const { onLoop } = useRenderLoop()
onLoop(({ delta }) => {
  rot.value += delta * 0.6
})

const color = ref('#6366f1')
const colors = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b']
function changeColor() {
  color.value = colors[(colors.indexOf(color.value) + 1) % colors.length]
}
</script>

<template>
  <main class="relative min-h-screen bg-slate-950 text-white">
    <ClientOnly>
      <TresCanvas clear-color="#0f172a" window-size>
        <TresPerspectiveCamera :position="[0, 0, 5]" :fov="50" />
        <TresAmbientLight :intensity="0.8" />
        <TresDirectionalLight :position="[3, 3, 3]" :intensity="1.2" />
        <TresMesh :rotation="[rot, rot, 0]">
          <TresBoxGeometry :args="[1.6, 1.6, 1.6]" />
          <TresMeshStandardMaterial :color="color" />
        </TresMesh>
      </TresCanvas>
    </ClientOnly>

    <div class="pointer-events-none absolute inset-x-0 top-8 text-center">
      <h1 class="text-3xl font-black">TresJS · Vue 写 3D</h1>
      <p class="mt-2 text-white/60">组件式声明场景，useRenderLoop 驱动旋转</p>
    </div>

    <button
      class="absolute bottom-10 left-1/2 -translate-x-1/2 rounded-lg bg-white/10 px-5 py-2.5 text-sm font-medium backdrop-blur transition hover:bg-white/20"
      @click="changeColor"
    >
      🎨 切换材质颜色
    </button>
  </main>
</template>
