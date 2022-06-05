<template>
  <section class="container" :class="{ full: isCollapsed }">
    <slot />
  </section>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'

import { useSider } from '@/hooks'
import { SCREEN } from '@/utils/constant'

const { isCollapsed, openSider, closeSider } = useSider()

function handleWindowResize() {
  if (window.innerWidth <= SCREEN.lg) {
    closeSider()
  } else {
    openSider()
  }
}

onMounted(() => {
  void (function () {
    const throttle = function (
      type: string,
      customEventName: string,
      obj: Window
    ) {
      obj = obj || window
      let running = false
      const func = () => {
        if (running) {
          return
        }
        running = true
        requestAnimationFrame(() => {
          obj.dispatchEvent(new CustomEvent(customEventName))
          running = false
        })
      }
      obj.addEventListener(type, func)
    }
    throttle('resize', 'optimizedResize', window)
  })()

  window.addEventListener('optimizedResize', handleWindowResize)
})

onUnmounted(() => {
  window.removeEventListener('optimizedResize', handleWindowResize)
})
</script>

<style lang="scss" scoped>
@use 'src/styles/var';

.container {
  height: 100%;
  padding-right: var.$layout-sider-width;

  &.full {
    padding-right: 0;
  }

  @media screen and (max-width: var.$screen-lg) {
    padding-right: 0;
  }

  @media (prefers-reduced-motion: no-preference) {
    transition: padding-right 0.2s;
  }
}
</style>
