<template>
  <img
    style="width: 40px; height: 40px"
    :src="LogoSvg"
    :style="{ width: `${props.size}rem`, height: `${props.size}rem` }"
    alt="logo"
  />
</template>

<script lang="ts" setup>
import LogoSvg from '@/assets/logo.svg'

const props = withDefaults(defineProps<{ size?: number }>(), {
  size: 2.5,
})
</script>
