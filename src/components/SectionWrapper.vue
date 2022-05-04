<template>
  <div class="setting-section">
    <div class="section-title">{{ props.title }}</div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title?: string
}>()
</script>

<style lang="scss" scoped>
.setting-section {
  padding: 1.8rem 1rem;

  .section-title {
    margin-bottom: 1.5rem;
    font-weight: bold;
    line-height: 23px;
  }
}
</style>
