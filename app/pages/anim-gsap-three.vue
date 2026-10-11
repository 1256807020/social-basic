<script setup lang="ts">
// 【动画组合 1/9 · GSAP + Three.js + ScrollTrigger】
// 商业级滚动驱动 3D 动效工业标准：
//   - Three.js 搭 3D 场景（此处用 WebGLRenderer；2026 生产标准可换 three/webgpu 的 WebGPURenderer）
//   - GSAP 时间轴精准控制模型 位移 / 旋转 / 材质颜色
//   - ScrollTrigger 绑定页面滚动进度做 scrub，实现沉浸式 3D 叙事
// 库均经 CDN 注入（UMD 全局），不污染 package.json。
useHead({
  script: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js' },
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
    const gsap: any = await waitFor(() => (window as any).gsap)
    const ScrollTrigger: any = await waitFor(() => (window as any).ScrollTrigger)
    gsap.registerPlugin(ScrollTrigger)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0b1020)
    const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100)
    camera.position.z = 6
    const renderer = new THREE.WebGLRenderer({ canvas: canvas.value!, antialias: true })
    renderer.setSize(innerWidth, innerHeight)

    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const dir = new THREE.DirectionalLight(0xffffff, 0.9)
    dir.position.set(3, 5, 4)
    scene.add(dir)

    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.6, 0),
      new THREE.MeshStandardMaterial({ color: 0x4f9dff, roughness: 0.3, metalness: 0.4, flatShading: true }),
    )
    scene.add(mesh)

    // GSAP 时间轴：随滚动 scrub 控制 位移 / 旋转 / 材质色相
    const tl = gsap.timeline({
      scrollTrigger: { trigger: '#scroll-stage', start: 'top top', end: 'bottom bottom', scrub: 1 },
    })
    tl.to(mesh.position, { y: 2.2, ease: 'none' }, 0)
    tl.to(mesh.rotation, { x: Math.PI * 2, z: Math.PI, ease: 'none' }, 0)
    tl.to(mesh.material.color, { r: 1, g: 0.3, b: 0.6, ease: 'none' }, 0)

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
    status.value = '向下滚动体验 3D 叙事 ▼'
  } catch (e: any) {
    status.value = '加载失败：' + e.message + '（请检查网络/CDN）'
  }
})
</script>

<template>
  <div id="scroll-stage">
    <canvas ref="canvas" class="sticky top-0 h-screen w-full"></canvas>
    <div class="pointer-events-none sticky top-4 z-10 text-center text-sm text-white/80">
      {{ status }}
    </div>
    <section class="h-screen"></section>
    <section class="flex h-screen items-center justify-center text-3xl font-bold text-white">第一幕 · 模型升起</section>
    <section class="flex h-screen items-center justify-center text-3xl font-bold text-white">第二幕 · 旋转与变色</section>
    <section class="flex h-screen items-center justify-center text-3xl font-bold text-white">终幕 · 沉浸式叙事完成</section>
  </div>
</template>
