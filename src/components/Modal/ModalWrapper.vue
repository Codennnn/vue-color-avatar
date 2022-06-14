<template>
  <transition name="fade">
    <div v-if="props.visible" class="modal" @click.self="emit('close')">
      <slot />
    </div>
  </transition>
</template>

<script lang="ts" setup>
const props = defineProps<{ visible?: boolean }>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  overflow: hidden;
  backdrop-filter: blur(0.1rem);
}

.fade-enter-active,
.fade-leave-active {
  @media (prefers-reduced-motion: no-preference) {
    transition: opacity 0.25s ease, transform 0.2s;
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
