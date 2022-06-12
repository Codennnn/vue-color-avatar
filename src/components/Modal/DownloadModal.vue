<template>
  <div
    v-if="props.visible"
    class="download-modal-wrapper"
    @click="emit('close')"
  >
    <div class="download-modal" @click.stop>
      <div class="modal-body">
        <div class="avatar-preview">
          <img
            alt="vue-color-avatar"
            :src="props.imageUrl"
            class="avatar-img"
          />
        </div>

        <p class="tip">{{ t('text.downloadTip') }} 🥳</p>
      </div>

      <button type="button" class="close-btn" @click="emit('close')">
        {{ t('action.close') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const props = defineProps<{ visible?: boolean; imageUrl: string }>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t } = useI18n()
</script>

<style lang="scss" scoped>
@use 'src/styles/var';

.download-modal-wrapper {
  position: fixed;
  bottom: 0;
  left: 50%;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 2rem 0;
  overflow: hidden;
  transform: translate(-50%, 0);
  backdrop-filter: blur(0.3rem);

  @supports not (backdrop-filter: blur(0.3rem)) {
    background-color: rgba(var.$color-dark, 0.8);
  }
}

.download-modal {
  position: relative;
  width: 50%;
  min-width: 310px;
  max-width: 500px;
  background-color: darken(var.$color-dark, 1);
  border: 0.15rem solid rgba(var.$color-accent, 0.8);
  border-radius: 1rem;

  .modal-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 1.8rem 1.2rem 1rem 1.2rem;

    .avatar-preview {
      width: 60%;
      margin: 0 auto;

      @media screen and (max-width: var.$screen-md) {
        width: 80%;
      }

      @media screen and (max-width: var.$screen-sm) {
        width: 90%;
      }

      .avatar-img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .tip {
      max-width: 70%;
      margin: 0 auto;
      padding: 1.5rem 0;
      color: var.$color-text;
      font-size: 0.85rem;
      text-align: center;
      cursor: default;
    }
  }

  .close-btn {
    position: absolute;
    right: 1rem;
    bottom: -1rem;
    min-width: 5rem;
    height: 2.5rem;
    margin: 0 1rem;
    margin-left: auto;
    padding: 0 1rem;
    color: var.$color-text;
    font-weight: bold;
    background: var.$color-gray;
    border-radius: 0.2rem;
    border-radius: 0.6rem;
    cursor: pointer;
    transition: color 0.2s, transform 0.2s;
    user-select: none;

    &:hover {
      color: lighten(var.$color-text, 10);
      transform: translateY(-0.3rem);
    }
  }
}
</style>
