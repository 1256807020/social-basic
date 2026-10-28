<script setup lang="ts">
// ───────────────────────────────────────────────────────────
// 从 Vue2 升级到 Vue3（动画篇）· Anime.js v4 × Three.js 3D 编排
// ① 视角/切入点：Anime.js v4 原生可直接把 Three.js 对象（Vector3/Euler/Material.color 等）当 target 编排时间轴，
//    多属性（position/rotation/scale/颜色）一条 timeline 统一驱动，无需 GSAP 商业授权；对照 GSAP(授权)/anime v3(需适配)/纯手写 rAF(繁琐)。
// ② 实战定位：3D 模型循环展示、产品 3D 预览、数据可视化动效——Three.js 负责画几何与光照，Anime.js 负责「何时动 / 怎么联动」。
// ③ 学习模式：🔧createTimeline({ loop, alternate }) + tl.add(target,{ 属性:[from,to], duration, ease }, position) 把 THREE 对象直接喂给 anime；
//    👉练习点 = 多 mesh 编排 / stagger 错峰 / 与相机联动 / 事件触发播放。文末有 Vue2/Vue3/React 三向对照。
// ───────────────────────────────────────────────────────────
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const canvas = ref<HTMLCanvasElement | null>(null)
const status = ref('加载中…')

// 放到外层以便 onBeforeUnmount 清理；仅在 onMounted（客户端）内赋值
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let rafId = 0

function onResize() {
  if (!camera || !renderer) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

onMounted(async () => {
  try {
    // anime.js v4 为 ESM，动态 import 避免 Nuxt SSR 阶段触碰其浏览器 API
    const { createTimeline } = await import('animejs')

    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x101522)
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.z = 6
    renderer = new THREE.WebGLRenderer({ canvas: canvas.value!, antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const dir = new THREE.DirectionalLight(0xffffff, 0.9)
    dir.position.set(3, 5, 4)
    scene.add(dir)

    const mat = new THREE.MeshStandardMaterial({ color: 0x4f9dff, roughness: 0.35, metalness: 0.3, flatShading: true })
    const mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(1.1, 0.36, 120, 16), mat)
    scene.add(mesh)

    // Anime v4：直接把 Three.js 对象当 target 编排时间轴（循环 + 往返）
    const col = { h: 0.58 }
    const tl = createTimeline({ loop: true, alternate: true })
    tl.add(mesh.position, { y: [-2, 2.4], duration: 2200, ease: 'inOutSine' }, 0)
    tl.add(mesh.rotation, { y: Math.PI * 2, duration: 2200, ease: 'inOutSine' }, 0)
    tl.add(mesh.scale, { x: [0.6, 1.3], y: [0.6, 1.3], z: [0.6, 1.3], duration: 2200, ease: 'inOutSine' }, 0)
    tl.add(col, {
      h: [0.58, 0.95],
      duration: 2200,
      ease: 'inOutSine',
      onUpdate: () => mat.color.setHSL(col.h, 0.7, 0.55),
    }, 0)

    const loop = () => {
      if (!renderer || !scene || !camera) return
      renderer.render(scene, camera)
      rafId = requestAnimationFrame(loop)
    }
    loop()
    window.addEventListener('resize', onResize)
    status.value = 'Anime.js v4 正在驱动 Three.js 模型（循环动画）'
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    status.value = '加载失败：' + msg
  }
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('resize', onResize)
  renderer?.dispose()
})
</script>

<template>
  <main class="relative">
    <canvas ref="canvas" class="h-screen w-full"></canvas>
    <div class="pointer-events-none absolute left-4 top-4 text-sm text-white/80">{{ status }}</div>

    <details class="fixed bottom-4 left-4 z-10 max-w-sm rounded-lg border border-white/10 bg-black/60 p-3 text-xs text-white/80 backdrop-blur">
      <summary class="cursor-pointer font-semibold">📚 Vue2 / Vue3 / React 三向对照 & 本项目小结</summary>
      <table class="mt-3 w-full border-collapse text-left">
        <thead>
          <tr class="border-b border-white/20">
            <th class="px-2 py-1">维度</th>
            <th class="px-2 py-1">Vue2 / Vue3</th>
            <th class="px-2 py-1">React</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b border-white/10"><td class="px-2 py-1">3D 库</td><td class="px-2 py-1">three（npm）</td><td class="px-2 py-1">@react-three/fiber + drei（声明式）</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">动画编排</td><td class="px-2 py-1">animejs createTimeline 直驱 mesh</td><td class="px-2 py-1">animejs 同思路 / useFrame 声明式</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">多属性联动</td><td class="px-2 py-1">位置/旋转/缩放/颜色同一 timeline</td><td class="px-2 py-1">同</td></tr>
          <tr class="border-b border-white/10"><td class="px-2 py-1">适用场景</td><td class="px-2 py-1">真 3D 几何 + 光照</td><td class="px-2 py-1">同</td></tr>
        </tbody>
      </table>
      <p class="mt-3 text-white/50">
        📝 小结：Three.js 负责「画什么」（几何体 + 材质 + 光照），Anime.js v4 负责「怎么动」——它原生支持把
        <code>THREE.Vector3</code>/<code>Euler</code>/<code>Material</code> 直接当动画 target，用一条
        <code>createTimeline({ loop, alternate })</code> 把多属性（position/rotation/scale/颜色 HSL）统一编排，往返循环。
        易错点：① anime v4 是 ESM，Nuxt 里动态 <code>import('animejs')</code> 避免 SSR 触及浏览器 API；
        ② <code>tl.add(target, { 属性:[from,to], duration, ease }, position)</code> 的 <code>position</code>（此处 0）是把各段对齐到同一时间轴起点实现「同时动」；
        ③ three 资源要清理：<code>onBeforeUnmount</code> 里 <code>cancelAnimationFrame</code> + 移除 resize 监听 + <code>renderer.dispose()</code>，否则切页面会泄漏 WebGL 上下文。
      </p>
    </details>
  </main>
</template>
