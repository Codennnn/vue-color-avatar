<template>
  <main class="main">
    <Container>
      <div class="content-warpper">
        <div class="content-view">
          <Header />

          <div class="playground">
            <div class="avatar-wrapper">
              <VueColorAvatar
                ref="colorAvatarRef"
                :option="avatarOption"
                :size="280"
                :style="{
                  transform: `rotateY(${flipped ? -180 : 0}deg)`,
                }"
              />
            </div>

            <ActionBar @action="handleAction" />

            <div class="action-group">
              <button
                type="button"
                class="action-btn action-randomize"
                @click="handleGenerate"
              >
                {{ t('action.randomize') }}
              </button>

              <button
                type="button"
                class="action-btn action-download"
                :disabled="downloading"
                @click="handleDownload"
              >
                {{
                  downloading
                    ? `${t('action.downloading')}...`
                    : t('action.download')
                }}
              </button>

              <button
                type="button"
                class="action-btn action-multiple"
                @click="() => generateMultiple()"
              >
                {{ t('action.downloadMultiple') }}
              </button>
            </div>
          </div>

          <Footer />

          <CodeModal :visible="codeVisible" @close="codeVisible = false" />

          <DownloadModal
            :visible="downloadModalVisible"
            :image-url="imageDataURL"
            @close=";(downloadModalVisible = false), (imageDataURL = '')"
          />
        </div>

        <ConfettiCanvas />

        <div class="gradient-bg">
          <div class="gradient-top"></div>
          <div class="gradient-bottom"></div>
        </div>
      </div>
    </Container>

    <BatchDownloadModal
      :visible="avatarListVisible"
      :avatar-list="avatarList"
      @regenerate="generateMultiple"
      @close="handleCloseBatchModal"
      @download-selected="handleDownloadSelected"
    />

    <DownloadQueue
      :visible="downloadQueueVisible"
      :queue="downloadQueue"
      @close="downloadQueueVisible = false"
      @cancel="handleCancelDownload"
      @retry="handleRetryDownload"
      @cancel-all="handleCancelAll"
    />

    <Sider>
      <Configurator />
    </Sider>

    <div v-if="hiddenAvatarsVisible" class="hidden-avatars-container">
      <VueColorAvatar
        v-for="item in downloadQueue"
        :id="`hidden-avatar-${item.id}`"
        :key="item.id"
        :option="item.option"
        :size="280"
      />
    </div>
  </main>
</template>

<script lang="ts" setup>
import { nextTick, ref, watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'

import ActionBar from '@/components/ActionBar.vue'
import Configurator from '@/components/Configurator.vue'
import BatchDownloadModal from '@/components/Modal/BatchDownloadModal.vue'
import CodeModal from '@/components/Modal/CodeModal.vue'
import DownloadModal from '@/components/Modal/DownloadModal.vue'
import DownloadQueue from '@/components/Modal/DownloadQueue.vue'
import VueColorAvatar, {
  type VueColorAvatarRef,
} from '@/components/VueColorAvatar.vue'
import { ActionType } from '@/enums'
import { useAvatarOption } from '@/hooks'
import Container from '@/layouts/Container.vue'
import Footer from '@/layouts/Footer.vue'
import Header from '@/layouts/Header.vue'
import Sider from '@/layouts/Sider.vue'
import { useStore } from '@/store'
import { REDO, UNDO } from '@/store/mutation-type'
import type {
  AvatarDownloadItem,
  AvatarOption,
  DownloadQueueItem,
} from '@/types'
import {
  getRandomAvatarOption,
  getSpecialAvatarOption,
  showConfetti,
} from '@/utils'
import {
  DOWNLOAD_DELAY,
  NOT_COMPATIBLE_AGENTS,
  TRIGGER_PROBABILITY,
} from '@/utils/constant'
import { recordEvent } from '@/utils/ga'

import { name as appName } from '../package.json'
import ConfettiCanvas from './components/ConfettiCanvas.vue'

const store = useStore()

const [avatarOption, setAvatarOption] = useAvatarOption()

const { t } = useI18n()

const colorAvatarRef = ref<VueColorAvatarRef>()

function handleGenerate() {
  if (Math.random() <= TRIGGER_PROBABILITY) {
    let colorfulOption = getSpecialAvatarOption()
    while (
      JSON.stringify(colorfulOption) === JSON.stringify(avatarOption.value)
    ) {
      colorfulOption = getSpecialAvatarOption()
    }
    colorfulOption.wrapperShape = avatarOption.value.wrapperShape
    setAvatarOption(colorfulOption)
    showConfetti()
  } else {
    const randomOption = getRandomAvatarOption(avatarOption.value)
    setAvatarOption(randomOption)
  }

  recordEvent('click_randomize', {
    event_category: 'click',
  })
}

const downloadModalVisible = ref(false)
const downloading = ref(false)
const imageDataURL = ref('')

async function handleDownload() {
  try {
    downloading.value = true
    const avatarEle = colorAvatarRef.value?.avatarRef

    const userAgent = window.navigator.userAgent.toLowerCase()
    const notCompatible = NOT_COMPATIBLE_AGENTS.some(
      (agent) => userAgent.indexOf(agent) !== -1
    )

    if (avatarEle) {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(avatarEle, {
        backgroundColor: null,
      })
      const dataURL = canvas.toDataURL()

      if (notCompatible) {
        imageDataURL.value = dataURL
        downloadModalVisible.value = true
      } else {
        const trigger = document.createElement('a')
        trigger.href = dataURL
        trigger.download = `${appName}.png`
        trigger.click()
      }
    }

    recordEvent('click_download', {
      event_category: 'click',
    })
  } finally {
    setTimeout(() => {
      downloading.value = false
    }, DOWNLOAD_DELAY)
  }
}

const flipped = ref(false)
const codeVisible = ref(false)

function handleAction(actionType: ActionType) {
  switch (actionType) {
    case ActionType.Undo:
      store[UNDO]()
      recordEvent('action_undo', {
        event_category: 'action',
        event_label: 'Undo',
      })
      break

    case ActionType.Redo:
      store[REDO]()
      recordEvent('action_redo', {
        event_category: 'action',
        event_label: 'Redo',
      })
      break

    case ActionType.Flip:
      flipped.value = !flipped.value
      recordEvent('action_flip_avatar', {
        event_category: 'action',
        event_label: 'Flip Avatar',
      })
      break

    case ActionType.Code:
      codeVisible.value = !codeVisible.value
      recordEvent('action_view_code', {
        event_category: 'action',
        event_label: 'View Avatar Option Code',
      })
      break
  }
}

const avatarListVisible = ref(false)
const avatarList = ref<AvatarOption[]>([])

watchEffect(() => {
  avatarListVisible.value =
    Array.isArray(avatarList.value) && avatarList.value.length > 0
})

function handleCloseBatchModal() {
  avatarListVisible.value = false
  avatarList.value = []
}

async function generateMultiple(count = 5 * 6) {
  const { default: hash } = await import('object-hash')

  const avatarMap = [...Array(count)].reduce<Map<string, AvatarOption>>(
    (res) => {
      let randomAvatarOption: AvatarOption
      let hashKey: string

      do {
        randomAvatarOption = getRandomAvatarOption(avatarOption.value)
        hashKey = hash.sha1(randomAvatarOption)
      } while (
        randomAvatarOption.background.color === 'transparent' ||
        res.has(hashKey)
      )

      res.set(hashKey, randomAvatarOption)

      return res
    },
    new Map()
  )

  avatarList.value = Array.from(avatarMap.values())

  recordEvent('click_generate_multiple', {
    event_category: 'click',
  })
}

const downloadQueueVisible = ref(false)
const downloadQueue = ref<DownloadQueueItem[]>([])
const hiddenAvatarsVisible = ref(false)

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

async function handleDownloadSelected(items: AvatarDownloadItem[]) {
  if (items.length === 0) return

  const queueItems: DownloadQueueItem[] = items.map((item) => ({
    id: generateId(),
    index: item.index,
    option: avatarList.value[item.index],
    thumbnail: '',
    status: 'pending',
    progress: 0,
    fileName: `${appName}-${item.index + 1}.png`,
  }))

  downloadQueue.value = queueItems
  downloadQueueVisible.value = true
  hiddenAvatarsVisible.value = true

  handleCloseBatchModal()

  await nextTick()

  await processDownloadQueue()
}

async function downloadAvatar(
  elementId: string,
  fileName: string
): Promise<boolean> {
  try {
    const element = window.document.querySelector(`#${elementId}`)
    if (element instanceof HTMLElement) {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(element, {
        backgroundColor: null,
      })
      const dataURL = canvas.toDataURL()

      const trigger = document.createElement('a')
      trigger.href = dataURL
      trigger.download = fileName
      trigger.click()

      return true
    }
    return false
  } catch {
    return false
  }
}

let processingAbort = false
let isProcessing = false

function handleCancelDownload(id: string) {
  const item = downloadQueue.value.find((q) => q.id === id)
  if (item && ['pending', 'processing'].includes(item.status)) {
    item.status = 'cancelled'
    item.progress = 0
  }
}

function handleRetryDownload(id: string) {
  const item = downloadQueue.value.find((q) => q.id === id)
  if (item && ['cancelled', 'error'].includes(item.status)) {
    item.status = 'pending'
    item.progress = 0

    if (!isProcessing) {
      processDownloadQueue()
    }
  }
}

function handleCancelAll() {
  processingAbort = true
  downloadQueue.value.forEach((item) => {
    if (['pending', 'processing'].includes(item.status)) {
      item.status = 'cancelled'
      item.progress = 0
    }
  })
}

async function processDownloadQueue() {
  if (isProcessing) return

  isProcessing = true
  processingAbort = false

  for (const item of downloadQueue.value) {
    if (processingAbort) break

    if (item.status === 'cancelled') continue

    if (item.status === 'pending') {
      item.status = 'processing'
      item.progress = 30

      try {
        await nextTick()

        const success = await downloadAvatar(
          `hidden-avatar-${item.id}`,
          item.fileName
        )
        item.progress = 100
        item.status = success ? 'completed' : 'error'
      } catch {
        item.status = 'error'
        item.progress = 0
      }

      await new Promise((resolve) => setTimeout(resolve, 200))
    }
  }

  isProcessing = false

  recordEvent('click_download_multiple', {
    event_category: 'click',
  })
}
</script>

<style lang="scss" scoped>
@use 'src/styles/var';

.main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: var.$color-text;
  background-color: var.$color-page-bg;

  .content-warpper {
    height: 100%;
    transform: scale(1);

    .content-view {
      position: relative;
      z-index: 110;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow-y: auto;
    }
  }

  .hidden-avatars-container {
    position: fixed;
    left: -9999px;
    top: -9999px;
    visibility: hidden;
    pointer-events: none;
  }
}

.playground {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;

  .avatar-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    @media screen and (max-width: var.$screen-sm) {
      transform: scale(0.85);
    }
  }

  .action-group {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 4rem;
    column-gap: 1rem;

    @supports not (column-gap: 1rem) {
      .action-btn {
        margin: 0 0.5rem;
      }
    }

    .action-btn {
      min-width: 6rem;
      height: 2.5rem;
      padding: 0 1rem;
      color: var.$color-text;
      font-weight: bold;
      background: var.$color-gray;
      border-radius: 0.6rem;
      cursor: pointer;
      transition: color 0.2s;
      user-select: none;
      border: none;

      &:hover {
        color: lighten(var.$color-text, 10);
      }

      &:disabled,
      &[disabled] {
        color: rgba(var.$color-text, 0.5);
        cursor: default;
      }
    }

    @media screen and (max-width: var.$screen-sm) {
      .action-multiple {
        display: none;
      }
    }
  }
}

@supports (filter: blur(4rem)) or (-webkit-filter: blur(4rem)) or
  (-moz-filter: blur(4rem)) {
  .gradient-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    @mixin gradient-style($color) {
      position: absolute;
      width: 100vh;
      height: 100vh;
      background-image: radial-gradient(
        rgba($color, 0.8) 20%,
        rgba($color, 0.6) 40%,
        rgba($color, 0.4) 60%,
        rgba($color, 0.2) 80%,
        transparent 100%
      );
      border-radius: 50%;
      opacity: 0.2;
      filter: blur(4rem);
    }

    .gradient-top {
      @include gradient-style(var.$color-secondary);

      top: -50%;
      right: -20%;
    }

    .gradient-bottom {
      @include gradient-style(var.$color-accent);

      bottom: -50%;
      left: -20%;
    }
  }
}
</style>
