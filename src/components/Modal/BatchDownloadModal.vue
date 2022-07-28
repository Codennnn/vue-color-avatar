<template>
  <ModalWrapper :visible="props.visible" @close="emit('close')">
    <div class="container">
      <div class="top-bar">
        <div>{{ t('text.downloadMultipleTip') }}</div>
        <div class="right">
          <button
            type="button"
            class="regenerate-btn"
            :disabled="making"
            @click="emit('regenerate')"
          >
            {{ t(`text.regenerate`) }}
          </button>

          <button type="button" class="download-btn" @click="make">
            {{
              making
                ? `${t('text.downloadingMultiple')}(${madeCount}/${
                    avatarList?.length
                  })`
                : t(`text.downloadMultiple`)
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
                :style="{ opacity: making && i + 1 > madeCount ? 0.5 : 1 }"
              >
                <VueColorAvatar :id="`avatar-${i}`" :option="opt" :size="280" />

                <button class="download-single" @click="handleDownload(i)">
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
import { ref } from 'vue'
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
}>()

const { t } = useI18n()

const making = ref(false)
const madeCount = ref(0)

async function handleDownload(avatarIndex) {
  const avatarEle = window.document.querySelector(`#avatar-${avatarIndex}`)

  if (avatarEle instanceof HTMLElement) {
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(avatarEle, {
      backgroundColor: null,
    })
    const dataURL = canvas.toDataURL()

    const trigger = document.createElement('a')
    trigger.href = dataURL
    trigger.download = `${appName}.png`
    trigger.click()
  }

  recordEvent('click_download', {
    event_category: 'click',
  })
}

async function make() {
  if (props.avatarList && !making.value) {
    making.value = true
    madeCount.value = 1

    const html2canvas = (await import('html2canvas')).default

    const { default: JSZip } = await import('jszip')
    const jsZip = new JSZip()

    for (let i = 0; i <= props.avatarList.length; i += 1) {
      const dom = window.document.querySelector(`#avatar-${i}`)

      if (dom instanceof HTMLElement) {
        const canvas = await html2canvas(dom, {
          backgroundColor: null,
        })

        const dataUrl = canvas.toDataURL().replace('data:image/png;base64,', '')
        jsZip.file(`${i + 1}.png`, dataUrl, { base64: true })
        madeCount.value = madeCount.value += 1
      }
    }

    const base64 = await jsZip.generateAsync({ type: 'base64' })

    making.value = false
    madeCount.value = 0

    const a = window.document.createElement('a')
    a.href = 'data:application/zip;base64,' + base64
    a.download = `${appName}.zip`
    a.click()

    recordEvent('click_download_multiple', {
      event_category: 'click',
    })
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
    height: $top-bar-height;
    padding: 1rem 2rem;
    background-color: lighten(var.$color-dark, 6);

    .right {
      display: flex;
      align-items: center;
      margin-left: auto;

      .download-btn {
        color: #fff;
        background-color: var.$color-accent;
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

        &:disabled,
        &[disabled] {
          color: rgba(#fff, 0.8);
          cursor: not-allowed;
        }
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
        margin-left: 1rem;
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

        &:hover {
          color: lighten(var.$color-text, 10);
        }
      }

      &:hover .download-single {
        opacity: 1;
      }
    }
  }
}
</style>
