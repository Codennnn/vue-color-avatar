<template>
  <ModalWrapper :visible="props.visible" @close="emit('close')">
    <div class="container">
      <div class="top-bar">
        <div class="select-all-wrapper">
          <label class="select-all-label">
            <input
              type="checkbox"
              class="select-all-checkbox"
              :checked="isAllSelected"
              :indeterminate="isIndeterminate"
              @change="toggleSelectAll"
            />
            <span>{{ t('text.selectAll') }}</span>
          </label>
          <span class="selected-count">({{ t('text.selectedCount', { count: selectedAvatarList.length }) }})</span>
        </div>
        <div class="right">
          <button
            type="button"
            class="regenerate-btn"
            :disabled="making"
            @click="emit('regenerate')"
          >
            {{ t(`text.regenerate`) }}
          </button>

          <button
            type="button"
            class="download-btn"
            :disabled="selectedAvatarList.length === 0 || making"
            @click="make"
          >
            {{
              making
                ? `${t('text.downloadingMultiple')}(${madeCount}/${selectedAvatarList.length})`
                : t('text.downloadSelected', { count: selectedAvatarList.length })
            }}
          </button>
        </div>
      </div>

      <div class="content-box">
        <PerfectScrollbar
          style="height: 100%; overflow: hidden"
          :options="{ suppressScrollX: false }"
        >
          <div class="content">
            <template v-for="(opt, i) in props.avatarList" :key="i">
              <div
                class="avatar-box"
                :class="{ selected: isSelected(i) }"
                :style="{ opacity: making && i + 1 > madeCount ? 0.5 : 1 }"
                @click="toggleSelection(i)"
              >
                <VueColorAvatar :id="`avatar-${i}`" :option="opt" :size="280" />

                <div class="avatar-overlay">
                  <div class="checkbox-wrapper">
                    <input
                      type="checkbox"
                      :checked="isSelected(i)"
                      @click.stop
                      @change="toggleSelection(i)"
                    />
                  </div>
                </div>

                <button
                  class="download-single"
                  :disabled="making"
                  @click.stop="handleDownload(i)"
                >
                  {{ t('action.download') }}
                </button>
              </div>
            </template>
          </div>
        </PerfectScrollbar>
      </div>
    </div>
  </ModalWrapper>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import PerfectScrollbar from '@/components/PerfectScrollbar.vue'
import VueColorAvatar from '@/components/VueColorAvatar.vue'
import type { AvatarOption } from '@/types'
import { recordEvent } from '@/utils/ga'

import { name as appName } from '../../../package.json'
import ModalWrapper from './ModalWrapper.vue'

const props = defineProps<{ visible?: boolean; avatarList?: AvatarOption[] }>()

const emit = defineEmits<{
  (e: 'regenerate'): void
  (e: 'close'): void
  (e: 'downloadSelected', selectedIndices: number[]): void
}>()

const { t } = useI18n()

const making = ref(false)
const madeCount = ref(0)

const selectedIndices = ref<number[]>([])

const isAllSelected = computed(() => {
  if (!props.avatarList || props.avatarList.length === 0) return false
  return selectedIndices.value.length === props.avatarList.length
})

const isIndeterminate = computed(() => {
  if (!props.avatarList) return false
  const count = selectedIndices.value.length
  return count > 0 && count < props.avatarList.length
})

const selectedAvatarList = computed(() => {
  if (!props.avatarList) return []
  return selectedIndices.value.map((idx) => props.avatarList[idx])
})

function isSelected(index: number): boolean {
  return selectedIndices.value.includes(index)
}

function toggleSelection(index: number) {
  if (isSelected(index)) {
    selectedIndices.value = selectedIndices.value.filter((i) => i !== index)
  } else {
    selectedIndices.value = [...selectedIndices.value, index]
  }
}

function toggleSelectAll() {
  if (!props.avatarList) return

  if (isAllSelected.value) {
    selectedIndices.value = []
  } else {
    selectedIndices.value = props.avatarList.map((_, i) => i)
  }
}

watch(
  () => props.avatarList,
  (newList) => {
    if (newList && newList.length > 0) {
      selectedIndices.value = newList.map((_, i) => i)
    } else {
      selectedIndices.value = []
    }
  },
  { immediate: true }
)

async function handleDownload(avatarIndex: number) {
  const avatarEle = window.document.querySelector(`#avatar-${avatarIndex}`)

  if (avatarEle instanceof HTMLElement) {
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(avatarEle, {
      backgroundColor: null,
    })
    const dataURL = canvas.toDataURL()

    const trigger = document.createElement('a')
    trigger.href = dataURL
    trigger.download = `${appName}-${avatarIndex + 1}.png`
    trigger.click()
  }

  recordEvent('click_download', {
    event_category: 'click',
  })
}

async function make() {
  if (selectedAvatarList.value.length > 0 && !making.value) {
    emit('downloadSelected', selectedIndices.value)
  }
}
</script>

<style lang="scss" scoped>
@use 'src/styles/var';

.container {
  position: absolute;
  top: 50%;
  left: 50%;
  height: min(90vh, 1000px);
  overflow: hidden;
  background-color: lighten(var.$color-dark, 3);
  border-radius: 1rem;
  transform: translate(-50%, -50%);

  $top-bar-height: 3.5rem;

  .top-bar {
    position: absolute;
    right: 0;
    left: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: $top-bar-height;
    padding: 1rem 2rem;
    background-color: lighten(var.$color-dark, 6);

    .select-all-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var.$color-text;

      .select-all-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;

        .select-all-checkbox {
          width: 1rem;
          height: 1rem;
          cursor: pointer;
          accent-color: var.$color-accent;
        }
      }

      .selected-count {
        color: var.$color-accent;
        font-weight: bold;
      }
    }

    .right {
      display: flex;
      align-items: center;

      .download-btn {
        color: #fff;
        background-color: var.$color-accent;

        &:disabled,
        &[disabled] {
          background-color: rgba(var.$color-accent, 0.5);
        }
      }

      .regenerate-btn,
      .download-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2rem;
        margin-left: 1rem;
        padding: 0 1rem;
        border-radius: 0.4rem;
        cursor: pointer;
        border: none;
        font-weight: bold;

        &:disabled,
        &[disabled] {
          color: rgba(#fff, 0.8);
          cursor: not-allowed;
        }
      }

      .regenerate-btn {
        color: var.$color-text;
        background-color: var.$color-gray;
      }
    }
  }

  .content-box {
    height: 100%;
    padding: $top-bar-height 0rem 0rem 0rem;
  }

  .content {
    z-index: 10;
    display: grid;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    justify-content: space-between;
    width: max(85vw, 1280px);
    padding: 2rem;

    .avatar-box {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 0.5rem;
      transition: box-shadow 0.2s;

      &:hover {
        box-shadow: 0 0 1.5rem rgba(var.$color-accent, 0.3);
      }

      &.selected {
        box-shadow: 0 0 0 0.2rem var.$color-accent;

        .avatar-overlay {
          opacity: 1;
        }
      }

      .avatar-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(var.$color-accent, 0.1);
        border-radius: 0.5rem;
        opacity: 0;
        transition: opacity 0.2s;
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        padding: 0.75rem;

        .checkbox-wrapper {
          input {
            width: 1.25rem;
            height: 1.25rem;
            cursor: pointer;
            accent-color: var.$color-accent;
          }
        }
      }

      .download-single {
        position: absolute;
        bottom: 1rem;
        left: 50%;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 6.6rem;
        height: 2.3rem;
        padding: 0 1rem;
        color: var.$color-text;
        font-weight: bold;
        background: var.$color-gray;
        border-radius: 0.4rem;
        border-radius: 0.6rem;
        transform: translateX(-50%);
        cursor: pointer;
        opacity: 0;
        transition: color 0.2s;
        user-select: none;
        border: none;

        &:hover {
          color: lighten(var.$color-text, 10);
        }

        &:disabled,
        &[disabled] {
          cursor: not-allowed;
          opacity: 0.5;
        }
      }

      &:hover .download-single {
        opacity: 1;
      }
    }
  }
}
</style>