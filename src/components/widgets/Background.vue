<template>
  <div class="avatar-background" :style="{ background: props.color }"></div>
</template>

<script lang="ts" setup>
import { type AvatarOption } from '../../types'

interface BackgroundProps {
  color: AvatarOption['background']['color']
}

const props = defineProps<BackgroundProps>()
</script>

<style lang="scss" scoped>
.avatar-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: background-color 0.1s;
}
</style>
