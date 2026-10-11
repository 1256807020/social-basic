<script setup lang="ts">
// 【动画组合 2/9 · Anime.js v4 + Three.js】
// 轻量替代方案：Anime.js v4 原生支持直接控制 Three.js Mesh 属性（position / rotation / scale / 颜色），
// 无需 GSAP 商业授权，小体量项目也能流畅编排 3D 模型动画。
// Anime v4 为 ESM，经 module 脚本注入到 window.animeV4；Three.js 走 UMD 全局。
useHead({
  script: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js' },
    {
      type: 'module',
      innerHTML:
        "import * as A from 'https://cdn.jsdelivr.net/npm/animejs@4.0.0/+esm'; window.animeV4 = A;",
    },
  ],
})

const canvas = ref<HTMLCanvasElement | null>(null)
const status = ref('加载中…')

function waitFor(getter: () => any, timeout = 8000) {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const tick = () => {
      const v = getter()
      if (v) return resolve(v)
      if (Date.now() - start > timeout) return reject(new Error('库加载超时'))
      requestAnimationFrame(tick)
    }
    tick()
  })
}

onMounted(async () => {
  try {
    const THREE: any = await waitFor(() => (window as any).THREE)
    const anime: any = await waitFor(() => (window as any).animeV4)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x101522)
    const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100)
    camera.position.z = 6
    const renderer = new THREE.WebGLRenderer({ canvas: canvas.value!, antialias: true })
    renderer.setSize(innerWidth, innerHeight)
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const dir = new THREE.DirectionalLight(0xffffff, 0.9)
    dir.position.set(3, 5, 4)
    scene.add(dir)

    const mat = new THREE.MeshStandardMaterial({ color: 0x4f9dff, roughness: 0.35, metalness: 0.3, flatShading: true })
    const mesh = new THREE.Mesh(new THREE.TorusKnotGeometry(1.1, 0.36, 120, 16), mat)
    scene.add(mesh)

    // Anime v4：直接把 Three.js 对象当 target 编排时间轴（循环 + 往返）
    const col = { h: 0.58 }
    const tl = anime.createTimeline({ loop: true, alternate: true })
    tl.add(mesh.position, { y: [-2, 2.4], duration: 2200, ease: 'inOutSine' }, 0)
    tl.add(mesh.rotation, { y: Math.PI * 2, duration: 2200, ease: 'inOutSine' }, 0)
    tl.add(
      mesh.scale,
      { x: [0.6, 1.3], y: [0.6, 1.3], z: [0.6, 1.3], duration: 2200, ease: 'inOutSine' },
      0,
    )
    tl.add(
      col,
      {
        h: [0.58, 0.95],
        duration: 2200,
        ease: 'inOutSine',
        onUpdate: () => mat.color.setHSL(col.h, 0.7, 0.55),
      },
      0,
    )

    const onResize = () => {
      camera.aspect = innerWidth / innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(innerWidth, innerHeight)
    }
    addEventListener('resize', onResize)
    const loop = () => {
      renderer.render(scene, camera)
      requestAnimationFrame(loop)
    }
    loop()
    status.value = 'Anime.js v4 正在驱动 Three.js 模型（循环动画）'
  } catch (e: any) {
    status.value = '加载失败：' + e.message + '（请检查网络/CDN）'
  }
})
</script>

<template>
  <main class="relative">
    <canvas ref="canvas" class="h-screen w-full"></canvas>
    <div class="pointer-events-none absolute left-4 top-4 text-sm text-white/80">{{ status }}</div>
  </main>
</template>
