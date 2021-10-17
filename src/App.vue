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

            <ActionBar @actionHandler="handleAction" />

            <div class="action-group">
              <button class="action-randomize" @click="handleGenerate">
                {{ t('action.randomize') }}
              </button>
              <button
                class="action-download"
                :disabled="downloading"
                @click="handleDownload"
              >
                {{
                  downloading
                    ? `${t('action.downloading')}...`
                    : t('action.download')
                }}
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

        <Confetti />

        <div class="gradient-bg">
          <div class="gradient-top"></div>
          <div class="gradient-bottom"></div>
        </div>
      </div>
    </Container>

    <Sider>
      <Configurator />
    </Sider>
  </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import ActionBar from '@/components/ActionBar.vue'
import CodeModal from '@/components/CodeModal.vue'
import Configurator from '@/components/Configurator.vue'
import DownloadModal from '@/components/DownloadModal.vue'
import type { VueColorAvatarRef } from '@/components/VueColorAvatar.vue'
import VueColorAvatar from '@/components/VueColorAvatar.vue'
import { ActionType } from '@/enums'
import { useAvatarOption } from '@/hooks'
import Container from '@/layouts/Container.vue'
import Footer from '@/layouts/Footer.vue'
import Header from '@/layouts/Header.vue'
import Sider from '@/layouts/Sider.vue'
import { useStore } from '@/store'
import { REDO, UNDO } from '@/store/mutation-type'
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
import { recordClick } from '@/utils/ga'

import Confetti from './components/Confetti.vue'

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
    setAvatarOption(colorfulOption)
    showConfetti()
  } else {
    const randomOption = getRandomAvatarOption(avatarOption.value)
    setAvatarOption(randomOption)
  }
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
        trigger.download = 'vue-color-avatar.png'
        trigger.click()
      }
    }
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
      store.commit(UNDO)
      break

    case ActionType.Redo:
      store.commit(REDO)
      break

    case ActionType.Flip:
      flipped.value = !flipped.value
      break

    case ActionType.Code:
      codeVisible.value = !codeVisible.value
      recordClick({
        event_category: 'code',
        event_label: 'view code',
      })
      break
  }
}
</script>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: $color-text;
  background-color: $color-page-bg;

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

    @media screen and (max-width: $screen-sm) {
      transform: scale(0.85);
    }
  }

  .action-group {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 4rem;

    .action-randomize,
    .action-download {
      min-width: 6rem;
      height: 2.5rem;
      margin: 0 1rem;
      padding: 0 1rem;
      color: $color-text;
      font-weight: bold;
      background: $color-gray;
      border-radius: 0.6rem;
      cursor: pointer;
      transition: color 0.2s;
      user-select: none;

      &:hover {
        color: lighten($color-text, 10);
      }

      &:disabled,
      &[disabled] {
        color: rgba($color-text, 0.5);
        cursor: default;
      }
    }
  }
}

.gradient-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  @mixin gradient-block($color) {
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
    @include gradient-block($color-secondary);

    top: -50%;
    right: -20%;
  }

  .gradient-bottom {
    @include gradient-block($color-accent);

    bottom: -50%;
    left: -20%;
  }
}
</style>
