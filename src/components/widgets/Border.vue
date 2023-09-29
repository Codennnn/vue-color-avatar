<template>
  <div
    class="avatar-border"
    :style="{ borderColor: props.color, borderRadius: props.radius }"
  />
</template>

<script lang="ts" setup>
import { type AvatarOption } from '../../types'

interface BorderProps {
  color: AvatarOption['background']['borderColor']
  radius: string
}

const props = defineProps<BorderProps>()
</script>

<style lang="scss" scoped>
.avatar-border {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  width: 100%;
  height: 100%;
  border-style: solid;
  border-width: 10px;
  transition: border-color 0.1s;
}
</style>
