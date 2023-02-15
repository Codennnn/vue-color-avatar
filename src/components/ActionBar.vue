<template>
  <div class="action-menu">
    <div
      v-for="ac in actions"
      :key="ac.type"
      class="menu-item"
      :class="{ disabled: ac.disabled }"
      :title="ac.tip"
      @click="emit('action', ac.type)"
    >
      <img :src="ac.icon" :alt="ac.tip" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import IconBack from '@/assets/icons/icon-back.svg'
import IconCode from '@/assets/icons/icon-code.svg'
import IconFlip from '@/assets/icons/icon-flip.svg'
import IconNext from '@/assets/icons/icon-next.svg'
import { ActionType } from '@/enums'
import { useStore } from '@/store'

const emit = defineEmits<{
  (e: 'action', actionType: ActionType): void
}>()

const { t } = useI18n()

const store = useStore()

const canUndo = computed(() => store.history.past.length > 0)
const canRedo = computed(() => store.history.future.length > 0)

const actions = computed(() => [
  {
    type: ActionType.Undo,
    icon: IconBack,
    tip: t('action.undo'),
    disabled: !canUndo.value,
  },
  {
    type: ActionType.Redo,
    icon: IconNext,
    tip: t('action.redo'),
    disabled: !canRedo.value,
  },
  {
    type: ActionType.Flip,
    icon: IconFlip,
    tip: t('action.flip'),
  },
  {
    type: ActionType.Code,
    icon: IconCode,
    tip: t('action.code'),
  },
])
</script>

<style lang="scss" scoped>
@use 'src/styles/var';

.action-menu {
  display: flex;
  align-items: center;
  margin-top: 5rem;
  padding: 0.5rem;
  background-color: var.$color-gray;
  border-radius: 2rem;

  .menu-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    margin: 0 0.5rem;
    background-color: lighten(var.$color-gray, 10);
    border-radius: 50%;
    cursor: pointer;
    transition: opacity 0.2s;

    &.disabled {
      cursor: default;
      opacity: 0.6;
    }
  }
}
</style>
