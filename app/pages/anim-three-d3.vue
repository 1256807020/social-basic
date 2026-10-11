<script setup lang="ts">
// 【动画组合 3/9 · Three.js + D3.js】
// 3D 数据可视化专属组合：Three.js 负责 3D 空间渲染，D3.js 处理数据映射（scaleLinear / 配色方案），
// 快速打造可交互的 3D 数据大屏。下方 3D 柱状图的高度与颜色均由 D3 计算。
useHead({
  script: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js' },
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
    const d3: any = await waitFor(() => (window as any).d3)

    const data = [12, 30, 18, 40, 25, 33, 22, 28]
    const yScale = d3.scaleLinear().domain([0, d3.max(data)]).range([0.2, 3.2])
    const color = d3.scaleOrdinal(d3.schemeCategory10)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0d1117)
    const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 100)
    camera.position.set(0, 4, 9)
    camera.lookAt(0, 0, 0)
    const renderer = new THREE.WebGLRenderer({ canvas: canvas.value!, antialias: true })
    renderer.setSize(innerWidth, innerHeight)
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const dir = new THREE.DirectionalLight(0xffffff, 0.9)
    dir.position.set(4, 8, 6)
    scene.add(dir)

    const group = new THREE.Group()
    const step = 1.4
    data.forEach((v, i) => {
      const h = yScale(v)
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, h, 0.9),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(color(i)), roughness: 0.4 }),
      )
      bar.position.set((i - (data.length - 1) / 2) * step, h / 2, 0)
      group.add(bar)
    })
    scene.add(group)

    let dragging = false
    let lastX = 0
    const onDown = (e: any) => {
      dragging = true
      lastX = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    }
    const onUp = () => (dragging = false)
    const onMove = (e: any) => {
      if (!dragging) return
      const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0
      group.rotation.y += (x - lastX) * 0.01
      lastX = x
    }
    canvas.value!.addEventListener('pointerdown', onDown)
    addEventListener('pointerup', onUp)
    addEventListener('pointermove', onMove)

    const onResize = () => {
      camera.aspect = innerWidth / innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(innerWidth, innerHeight)
    }
    addEventListener('resize', onResize)
    const loop = () => {
      if (!dragging) group.rotation.y += 0.004
      renderer.render(scene, camera)
      requestAnimationFrame(loop)
    }
    loop()
    status.value = '拖拽旋转 · 柱高与配色由 D3 计算'
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
