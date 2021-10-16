<template>
  <!-- <div
    class="logo"
    :style="{ width: `${props.size}rem`, height: `${props.size}rem` }"
  /> -->
  <img
    style="width: 40px; height: 40px"
    :src="LogoSvg"
    :style="{ width: `${props.size}rem`, height: `${props.size}rem` }"
  />
</template>

<script lang="ts" setup>
import LogoSvg from '@/assets/logo.svg'

const props = withDefaults(defineProps<{ size?: number }>(), {
  size: 2.5,
})
</script>

<!-- <style lang="scss" scoped>
.logo {
  position: relative;
  overflow: hidden;
  background-color: $color-accent;
  border-radius: 25%;

  &::after {
    position: absolute;
    top: -40%;
    right: -40%;
    width: 100%;
    height: 100%;
    background-color: $color-secondary;
    border-radius: 50%;
    content: '';
  }
}
</style> -->
