<script setup lang="ts">
import { GitBranch, ArrowRight } from '@lucide/vue'
import Button from '~/components/ui/button/Button.vue'
</script>

<template>
  <main class="flex min-h-svh flex-col items-center justify-center gap-4">
    <Button>
      <GitBranch />
      Nuxt.js starter
      <ArrowRight />
    </Button>
  </main>
</template>
