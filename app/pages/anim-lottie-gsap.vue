<script setup lang="ts">
// 【动画组合 5/9 · Lottie + GSAP】
// 设计师与开发无缝衔接：Lottie 渲染矢量动效（此处内联一段手写 bodymovin JSON，无需外部资源），
// GSAP 负责控制「播放时机 / 进度」，并把进度同步给进度条与叙事文字，
// 解决纯 Lottie「只能一次性播完、交互弱」的短板。
useHead({
  script: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js' },
  ],
})

const lottieBox = ref<HTMLElement | null>(null)
const bar = ref<HTMLElement | null>(null)
const status = ref('加载中…')
const playing = ref(false)
const activeStep = ref(0)

// 内联最小可用 Lottie（蓝圈旋转 + 脉冲），避免依赖外部 JSON 资源
const data = {
  v: '5.7.0', fr: 30, ip: 0, op: 60, w: 200, h: 200, nm: 'demo', ddd: 0, assets: [],
  layers: [{
    ddd: 0, ind: 1, ty: 4, nm: 'c', sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 1, k: [{ t: 0, s: [0] }, { t: 60, s: [360] }] },
      p: { a: 0, k: [100, 100, 0] }, a: { a: 0, k: [0, 0, 0] },
      s: { a: 1, k: [{ t: 0, s: [50, 50, 100] }, { t: 30, s: [100, 100, 100] }, { t: 60, s: [50, 50, 100] }] },
    },
    shapes: [{
      ty: 'gr',
      it: [
        { ty: 'el', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] } },
        { ty: 'fl', c: { a: 0, k: [0.31, 0.62, 1, 1] }, o: { a: 0, k: 100 } },
        { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
      ],
    }],
    ip: 0, op: 60, st: 0,
  }],
}

const steps = [
  { t: '① 设计师在 AE 导出 Lottie JSON', d: '高复杂度矢量动效，像素级还原品牌。' },
  { t: '② GSAP 接管播放时机', d: '不再只能「一次性播完」，可暂停 / 拖动 / 正放倒放。' },
  { t: '③ 进度联动页面其它元素', d: '进度条与叙事文字随同一时间轴同步，时序统一。' },
]

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

// GSAP 控制的播放进度代理（0~1）
const clip = reactive({ t: 0 })
let anim: any = null
let tween: any = null

function applyProgress(p: number) {
  if (!anim) return
  clip.t = p
  anim.goToAndStop(p * (anim.totalFrames - 1), true)
  if (bar.value) bar.value.style.width = `${p * 100}%`
  activeStep.value = Math.min(steps.length - 1, Math.floor(p * steps.length))
}

function play() {
  if (!anim) return
  if (clip.t >= 0.999) { clip.t = 0; applyProgress(0) }
  playing.value = true
  tween && tween.kill()
  tween = (window as any).gsap.to(clip, {
    t: 1,
    duration: 4 * (1 - clip.t),
    ease: 'none',
    onUpdate: () => applyProgress(clip.t),
    onComplete: () => { playing.value = false },
  })
}
function pause() {
  playing.value = false
  tween && tween.pause()
}
function restart() {
  tween && tween.kill()
  playing.value = false
  applyProgress(0)
}
function scrub(e: Event) {
  tween && tween.kill()
  playing.value = false
  applyProgress(Number((e.target as HTMLInputElement).value) / 100)
}

onMounted(async () => {
  try {
    const lottie: any = await waitFor(() => (window as any).lottie)
    await waitFor(() => (window as any).gsap)
    anim = lottie.loadAnimation({ container: lottieBox.value!, renderer: 'svg', loop: false, autoplay: false, animationData: data })
    anim.addEventListener('DOMLoaded', () => {
      applyProgress(0)
      status.value = 'GSAP 已接管：点播放 / 拖动滑块，进度条与叙事同步联动'
    })
  } catch (e: any) {
    status.value = '加载失败：' + e.message + '（请检查网络 / CDN）'
  }
})
</script>

<template>
  <main class="min-h-screen space-y-8 bg-zinc-950 p-8 text-white">
    <h1 class="text-4xl font-black">Lottie + GSAP 动效协作</h1>
    <p class="max-w-2xl text-white/70">
      Lottie 渲染 AE 导出的矢量动效，GSAP 控制播放时机并把进度同步给页面其它元素 —— 这是两者最经典的分工。
    </p>

    <!-- Lottie 舞台 + GSAP 控制 -->
    <section class="grid gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-2">
      <div class="flex flex-col items-center justify-center gap-4">
        <div ref="lottieBox" class="h-48 w-48"></div>
        <p class="text-sm text-white/60">{{ status }}</p>
        <div class="flex gap-2">
          <button @click="play" :disabled="playing"
            class="rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold disabled:opacity-40">播放</button>
          <button @click="pause" :disabled="!playing"
            class="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold disabled:opacity-40">暂停</button>
          <button @click="restart"
            class="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold">重置</button>
        </div>
        <div class="flex w-full items-center gap-2">
          <span class="text-xs text-white/50">拖动</span>
          <input type="range" min="0" max="100" :value="clip.t * 100" @input="scrub"
            class="flex-1 accent-indigo-400" />
          <span class="w-10 text-right font-mono text-xs text-white/60">{{ Math.round(clip.t * 100) }}%</span>
        </div>
      </div>

      <!-- 联动：进度条 + 叙事步骤 -->
      <div class="flex flex-col gap-4">
        <div>
          <p class="mb-1 text-xs text-white/50">GSAP 联动进度条</p>
          <div class="h-2 w-full overflow-hidden rounded bg-white/10">
            <div ref="bar" class="h-full bg-blue-500" style="width: 0%"></div>
          </div>
        </div>
        <ul class="space-y-3">
          <li v-for="(s, i) in steps" :key="i"
            class="rounded-xl border border-white/10 p-3 transition-opacity duration-300"
            :class="activeStep === i ? 'bg-white/10 opacity-100' : 'opacity-40'">
            <p class="font-semibold">{{ s.t }}</p>
            <p class="text-sm text-white/60">{{ s.d }}</p>
          </li>
        </ul>
      </div>
    </section>
  </main>
</template>
