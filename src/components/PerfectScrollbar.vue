<template>
  <div ref="scrollWrapper" style="position: relative; overflow: hidden">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import PerfectScrollbar from 'perfect-scrollbar'
import { onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{ options?: PerfectScrollbar.Options }>()

const scrollWrapper = ref<HTMLDivElement>()

let ps: PerfectScrollbar

onMounted(() => {
  if (!scrollWrapper.value) {
    console.warn(`No valid 'PerfectScrollbar' container found`)
    return
  }

  ps = new PerfectScrollbar(scrollWrapper.value, {
    minScrollbarLength: 20,
    maxScrollbarLength: 160,
    ...props.options,
  })
})

onUnmounted(() => {
  ps.destroy()
})
</script>
