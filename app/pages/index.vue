<template>
  <main class="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
    <h1 class="text-3xl font-bold">Social Basic</h1>
    <p class="max-w-md text-gray-600">Nuxt 4 全栈基座（对标 social-start 的 Next.js 版）。</p>
    <button
      class="inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <line x1="6" x2="6" y1="3" y2="15" />
        <circle cx="18" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M18 9a9 9 0 0 1-9 9" />
      </svg>
      Nuxt.js starter
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </button>
    <NuxtLink to="/basic" class="text-sm text-blue-600 underline">前往 /basic 演示页</NuxtLink>
  </main>
</template>
